using Drips.Messaging.Domain.Enums;

namespace Drips.Messaging.Application.Services;

public class MessageClassifier
{
    public ConversationSignalType Classify(string content)
    {
        var lower = content.ToLower();

        if (lower.Contains("stop"))
            return ConversationSignalType.OptOut;

        if (lower.Contains("yes") || lower.Contains("interested"))
            return ConversationSignalType.Interested;

        if (lower.Contains("?"))
            return ConversationSignalType.Confused;

        return ConversationSignalType.Neutral;
    }

    public ConversationSignalType ClassifyMessage(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            return ConversationSignalType.Neutral;

        // Define keywords that signal an Opt-Out
        var optOutKeywords = new[] { "STOP", "UNSUBSCRIBE", "CANCEL", "QUIT", "END" };

        // Check if the message contains any of the keywords (case-insensitive)
        bool isOptOut = optOutKeywords.Any(keyword =>
                          message.Contains(keyword, StringComparison.OrdinalIgnoreCase));

        if (isOptOut)
        {
            return ConversationSignalType.OptOut;
        }

        return ConversationSignalType.Neutral;
    }



}
