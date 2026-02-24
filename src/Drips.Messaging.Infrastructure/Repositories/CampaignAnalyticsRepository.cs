using Dapper;
using System.Data;

namespace Drips.Messaging.Infrastructure.Repositories;

public class CampaignAnalyticsRepository
{
    private readonly IDbConnection _connection;

    public CampaignAnalyticsRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<dynamic> GetAnalytics(Guid campaignId)
    {
        var sql = @"
        SELECT
            COUNT(CASE WHEN m.Direction = 'Inbound' THEN 1 END) AS TotalInbound,
            COUNT(CASE WHEN m.Signal = 'Interested' THEN 1 END) AS Interested,
            COUNT(CASE WHEN m.Signal = 'Confused' THEN 1 END) AS Confused,
            COUNT(CASE WHEN m.Signal = 'OptOut' THEN 1 END) AS OptOut
        FROM Messages m
        JOIN Conversations c ON m.ConversationId = c.Id
        WHERE c.CampaignId = @CampaignId
        ";

        return await _connection.QuerySingleAsync(sql, new { CampaignId = campaignId });
    }
}
