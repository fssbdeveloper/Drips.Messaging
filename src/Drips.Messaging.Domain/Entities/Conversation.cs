namespace Drips.Messaging.Domain.Entities;

public class Conversation
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public string LeadPhone { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
}
