using Drips.Messaging.Domain.Entities;
using Drips.Messaging.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Drips.Messaging.Api.Controllers;

[ApiController]
[Route("api/dev")]
public class DevController : ControllerBase
{
    private readonly CampaignRepository _campaignRepository;
    private readonly ConversationRepository _conversationRepository;

    public DevController(
        CampaignRepository campaignRepository,
        ConversationRepository conversationRepository)
    {
        _campaignRepository = campaignRepository;
        _conversationRepository = conversationRepository;
    }

    [HttpPost("seed")]
    public async Task<IActionResult> Seed(CancellationToken ct)
    {
        var campaign = new Campaign
        {
            Id = Guid.NewGuid(),
            Name = "Spring Enrollment Campaign",
            CreatedAt = DateTime.UtcNow
        };

        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            CampaignId = campaign.Id,
            LeadPhone = "+15551234567",
            StartedAt = DateTime.UtcNow
        };

        await _campaignRepository.InsertAsync(campaign, ct);
        await _conversationRepository.InsertAsync(conversation, ct);



        return Ok(new
        {
            CampaignId = campaign.Id,
            ConversationId = conversation.Id
        });
    }
}
