using Drips.Messaging.Domain.Enums;

namespace Drips.Messaging.Domain.Entities;

public class Message
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public string Direction { get; set; } = string.Empty; // Inbound/Outbound
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public ConversationSignalType Signal { get; set; }
}


