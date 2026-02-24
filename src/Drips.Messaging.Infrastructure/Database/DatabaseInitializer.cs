using Dapper;
using Microsoft.Data.Sqlite;

namespace Drips.Messaging.Infrastructure.Database;

public class DatabaseInitializer
{
    private readonly string _connectionString;

    public DatabaseInitializer(string connectionString)
    {
        _connectionString = connectionString;
    }

    //public void Initialize()
    //{
    //    using var connection = new SqliteConnection(_connectionString);

    //    // This SQL creates the table if it doesn't already exist
    //    const string sql = @"
    //        CREATE TABLE IF NOT EXISTS Messages (
    //            Id TEXT PRIMARY KEY,
    //            ConversationId TEXT NOT NULL,
    //            Direction TEXT NOT NULL,
    //            Content TEXT NOT NULL,
    //            SentAt TEXT NOT NULL
    //        );";

    //    connection.Execute(sql);
    //}
}
