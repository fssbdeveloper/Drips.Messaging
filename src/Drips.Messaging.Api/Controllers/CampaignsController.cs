using Drips.Messaging.Api.Controllers;
using Drips.Messaging.Application.Services;
using Drips.Messaging.Domain.Entities;
using Drips.Messaging.Domain.Enums;
using Drips.Messaging.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/campaigns")]
public class CampaignsController : ControllerBase
{
    private readonly CampaignAnalyticsRepository _analyticsRepository;
    private readonly CampaignRepository _campaignRepository;
    private readonly ConversationRepository _conversationRepository;
    private readonly MessageRepository _messageRepository;
    private readonly MessageClassifier _classifier;

    public CampaignsController(CampaignAnalyticsRepository analyticsRepository, 
                                CampaignRepository campaignRepository,
                                ConversationRepository conversationRepository,
                                MessageRepository messageRepository,
                                MessageClassifier messageClassifier )
    {
        _analyticsRepository = analyticsRepository;
        _campaignRepository = campaignRepository;
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _classifier = messageClassifier;
    }

    [HttpGet("{id}/analytics")]
    public async Task<IActionResult> GetAnalytics(Guid id)
    {
        var result = await _analyticsRepository.GetAnalytics(id);

        var totalInbound = (int)result.TotalInbound;
        var interested = (int)result.Interested;
        var optOut = (int)result.OptOut;

        var campaign = new Campaign { Id = id };

        var engagementScore = campaign.CalculateEngagementScore(
            totalInbound,
            interested,
            optOut);

        return Ok(new
        {
            id,
            totalInbound,
            interested,
            result.Confused,
            optOut,
            engagementScore,
            optOutRate = totalInbound == 0 ? 0 : optOut / (double)totalInbound
        });
    }

    [HttpGet]  
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var campaigns = await _campaignRepository.GetAllCampaigns(ct);

        //return 200 OK with the list (even if empty [])
        return Ok(campaigns);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCampaignRequest request, CancellationToken ct)
    {
        var campaign = new Campaign
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };

        await _campaignRepository.InsertAsync(campaign, ct);

        return CreatedAtAction(
            nameof(GetById),
            new { id = campaign.Id },
            new { campaign.Id, campaign.Name });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        // Use your Dapper repository to find the record
        var campaign = await _campaignRepository.GetByIdAsync(id, ct);

        if (campaign == null)
        {
            return NotFound(); // returns 404 if the ID doesn't exist
        }

        return Ok(campaign); // returns 200 with the Campaign object
    }


    [HttpPost("{campaignId}/conversations")]
    public async Task<IActionResult> CreateConversation(Guid campaignId,
                                                        CreateConversationRequest request,
                                                        CancellationToken ct)
    {
        // Validate parent exists
        var campaign = await _campaignRepository.GetByIdAsync(campaignId, ct);
        if (campaign == null)
            return NotFound("Campaign not found.");

        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            CampaignId = campaignId,
            LeadPhone = request.LeadPhone,
            StartedAt = DateTime.UtcNow
        };

        await _conversationRepository.InsertAsync(conversation, ct);

        return Created(
            $"/api/conversations/{conversation.Id}",
            new
            {
                conversation.Id,
                conversation.CampaignId,
                conversation.LeadPhone
            });
    }

    [HttpPost("{conversationId}/messages")]
    public async Task<IActionResult> CreateMessage(Guid conversationId,
                                                    CreateMessageRequest request,
                                                    CancellationToken ct)
    {
        var conversation = await _conversationRepository.GetByIdAsync(conversationId, ct);

        if (conversation == null)
            return NotFound("Conversation not found.");

        var signal = _classifier.Classify(request.Content);
    
        if (request.Direction.ToString() == "Outbound")
            signal = ConversationSignalType.Neutral;

        var message = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            Content = request.Content,
            Direction = request.Direction.ToString(), // convert enum to string
            SentAt = DateTime.UtcNow,
            Signal = signal
        };

        if (message == null)
            return NotFound("Message not found.");

        await _messageRepository.InsertAsync(message, ct);


        return Created(
            $"/api/messages/{message.Id}",
            new
            {
                message.Id,
                message.ConversationId,
                message.Content,            
                Signal = message.Signal.ToString(),
                message.Direction
            });
    }

    [HttpGet("{campaignId}/conversations")]
    public async Task<IActionResult> GetConversations(Guid campaignId,
                                                        CancellationToken ct)
    {
        // Validate campaign exists (important)
        var campaign = await _campaignRepository.GetByIdAsync(campaignId, ct);
        if (campaign == null)
            return NotFound("Campaign not found.");

        var conversations = await _conversationRepository
            .GetByCampaignIdAsync(campaignId, ct);

        return Ok(conversations);
    }

    [HttpGet("{conversationId}/messages")]
    public async Task<IActionResult> GetMessages(Guid conversationId, CancellationToken ct)
    {
        var conversation = await _conversationRepository.GetByIdAsync(conversationId, ct);

        if (conversation == null)
            return NotFound("Conversation not found.");

        var messages = await _messageRepository.GetByConversationIdAsync(conversationId, ct);

        return Ok(messages);
    }


}



