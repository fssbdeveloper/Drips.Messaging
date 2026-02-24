
namespace Drips.Messaging.Domain.Entities
{
 

    public class Campaign
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public double CalculateEngagementScore(
            int totalMessages,
            int interestedCount,
            int optOutCount)
        {
            if (totalMessages == 0) return 0;
            var positiveWeight = interestedCount * 2;
            var negativeWeight = optOutCount * -3;
            return (positiveWeight + negativeWeight) / (double)totalMessages;
        }
    }

}
