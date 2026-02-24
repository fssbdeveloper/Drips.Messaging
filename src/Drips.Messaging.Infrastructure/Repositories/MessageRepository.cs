using Dapper;
using Drips.Messaging.Domain.Entities;
using System.Data;

namespace Drips.Messaging.Infrastructure.Repositories;

public class MessageRepository
{
    private readonly IDbConnection _connection;

    public MessageRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task InsertAsync(Message message, CancellationToken ct)
    {
        var sql = @"INSERT INTO Messages 
                    (Id, ConversationId, Direction, Content, SentAt, Signal)
                    VALUES (@Id, @ConversationId, @Direction, @Content, @SentAt, @Signal)";

        // await _connection.ExecuteAsync(sql, message);
         await _connection.ExecuteAsync(sql, new
        {
            message.Id,
            message.ConversationId,
            message.Content,
            message.Direction,
            SentAt = DateTime.UtcNow,
            Signal = message.Signal.ToString() // Send the NAME of the enum to the DB
        });
    }

    public async Task<IReadOnlyList<Message>> GetByConversationIdAsync(
    Guid conversationId,
    CancellationToken ct = default)
    {
        const string sql = @"
                                SELECT Id,
                                       ConversationId,
                                       Content,
                                       Direction,
                                       SentAt
                                FROM Messages
                                WHERE ConversationId = @ConversationId
                                ORDER BY SentAt ASC";

        var results = await _connection.QueryAsync<Message>(sql, new { ConversationId = conversationId });

        return results.ToList();
    }


}
