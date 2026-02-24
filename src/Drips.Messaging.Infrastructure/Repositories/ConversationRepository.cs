using Dapper;
using Drips.Messaging.Domain.Entities;
using Drips.Messaging.Infrastructure.Database;
using System.Data;

namespace Drips.Messaging.Infrastructure.Repositories;

public class ConversationRepository
{
    private readonly IDbConnection _connection;

    public ConversationRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task InsertAsync(Conversation conversation, CancellationToken ct)
    {
        var sql = @"INSERT INTO Conversations (Id, CampaignId, LeadPhone, StartedAt)
                    VALUES (@Id, @CampaignId, @LeadPhone, @StartedAt)";

        await _connection.ExecuteAsync(sql, conversation);
    }
    

    public async Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
    
        //  SQLite uses TEXT for Guids usually, Dapper handles the conversion 
        //const string sql = "SELECT * FROM Conversations WHERE Id = @Id LIMIT 1";
        const string sql = "SELECT * FROM Conversations  WHERE Id LIKE @Id LIMIT 1";//WHERE Id = @Id LIMIT 1";
     
        //  
        // Passing 'new { Id = id }' maps the C# variable to the @Id parameter safely
        return await _connection.QueryFirstOrDefaultAsync<Conversation>(
            new CommandDefinition(sql, new { Id = id.ToString() }, cancellationToken: ct)
        );
    }

    public async Task<IReadOnlyList<Conversation>> GetByCampaignIdAsync(Guid campaignId, CancellationToken ct = default)                                                                
    {
        const string sql = @"
                            SELECT Id, CampaignId, LeadPhone, StartedAt
                            FROM Conversations
                            WHERE CampaignId = @CampaignId
                            ORDER BY StartedAt DESC";

        var results = await _connection.QueryAsync<Conversation>(
            sql,
            new { CampaignId = campaignId });

        return results.ToList();
    }


}
