using Dapper;
using Microsoft.Data.Sqlite;
using System.Data;

namespace Drips.Messaging.Infrastructure.Database;

public class DbConnectionFactory
{
    private readonly string _connectionString;

    public DbConnectionFactory(string connectionString)
    {
        _connectionString = connectionString;
    }

    public IDbConnection CreateConnection()
        => new SqliteConnection(_connectionString);

    public void Initialize()
    {
        using var connection = new SqliteConnection(_connectionString);

        // This SQL creates the table if it doesn't already exist
        //const string sql = @"
        //    CREATE TABLE IF NOT EXISTS Messages (
        //        Id TEXT PRIMARY KEY,
        //        ConversationId TEXT NOT NULL,
        //        Direction TEXT NOT NULL,
        //        Content TEXT NOT NULL,
        //        SentAt TEXT NOT NULL
        //    );";
           

        //connection.Execute(sql);

        connection.Execute(@"
            CREATE TABLE IF NOT EXISTS Campaigns (
                Id TEXT PRIMARY KEY,
                Name TEXT NOT NULL,
                CreatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Conversations (
                Id TEXT PRIMARY KEY,
                CampaignId TEXT NOT NULL,
                LeadPhone TEXT NOT NULL,
                StartedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Messages (
                Id TEXT PRIMARY KEY,
                ConversationId TEXT NOT NULL,
                Direction TEXT NOT NULL,
                Content TEXT NOT NULL,
                SentAt TEXT NOT NULL,
                Signal TEXT NOT NULL
            );
            ");



    }


}
