using Drips.Messaging.Application.Services;
using Drips.Messaging.Domain.Entities;
using Drips.Messaging.Domain.Enums;
using Drips.Messaging.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Drips.Messaging.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/messages")]
public class MessagesController : ControllerBase
{
    private readonly MessageRepository _repository;
    private readonly MessageClassifier _classifier;

    public MessagesController(MessageRepository repository,
                             MessageClassifier classifier)
    {
            _repository = repository;
            _classifier = classifier;
    }

    public record IngestMessageRequest(
                                Guid CampaignId,
                                Guid ConversationId,
                                string Direction,
                                string Content,
                                string Signal
    );

    [HttpPost]
    //[Route("api/messages")]
    public async Task<IActionResult> Ingest(IngestMessageRequest request, CancellationToken ct)
    {
          
        var signal = _classifier.Classify(request.Content);
        
        if (request.Direction == "Outbound")
            signal = ConversationSignalType.Neutral;

        var message = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = request.ConversationId,
            Direction = request.Direction,
            Content = request.Content,
            SentAt = DateTime.UtcNow,
            Signal = signal
            
        };

        await _repository.InsertAsync(message, ct);

        return Ok(new
        {
            message.Id,
            Signal = signal.ToString()
        });
    }


 
}
