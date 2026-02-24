using Dapper;
using Drips.Messaging.Domain.Entities;
using System.Data;

namespace Drips.Messaging.Infrastructure.Repositories;

public class CampaignRepository
{
    private readonly IDbConnection _connection;

    public CampaignRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task InsertAsync(Campaign campaign, CancellationToken ct)
    {
        var sql = @"INSERT INTO Campaigns (Id, Name, CreatedAt)
                    VALUES (@Id, @Name, @CreatedAt)";

        await _connection.ExecuteAsync(sql, campaign);
    }

    public async Task<IReadOnlyList<Campaign>> GetAllCampaigns(CancellationToken ct = default)
    {
        try
        {
            // 1. Only select columns that actually exist in your Campaigns table
            const string sql = "SELECT Id, Name, CreatedAt FROM Campaigns";

            // 2. Dapper's QueryAsync returns an IEnumerable. 
            // We call .ToList() to satisfy the IReadOnlyList return type.
            var result = await _connection.QueryAsync<Campaign>(
                new CommandDefinition(sql, cancellationToken: ct)
            );

            return result.ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database Error: {ex.Message}");
            throw;
        }
    }

    public async Task<Campaign?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            // 1. Force the GUID to uppercase/lowercase to match what's in the DB
            // SQLite is picky about "0f1c..." vs "0F1C..."
            string idString = id.ToString();//.ToLower();

            // 2. Use 'LIKE' if '=' is failing due to hidden whitespace or formatting
            const string sql = "SELECT Id, Name, CreatedAt FROM Campaigns WHERE Id LIKE @Id LIMIT 1";//WHERE Id = @Id LIMIT 1";

            return await _connection.QueryFirstOrDefaultAsync<Campaign>(
                new CommandDefinition(sql, new { Id = idString }, cancellationToken: ct)
            );
        }
        catch (Exception ex)
        {
            // Log this or set a breakpoint here!
            Console.WriteLine($"Database Error: {ex.Message}");
            throw;
        }
    }

 

}
