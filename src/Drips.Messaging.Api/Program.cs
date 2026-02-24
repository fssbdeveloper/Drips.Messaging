using Dapper;
using Drips.Messaging.Application.Services;
using Drips.Messaging.Infrastructure.Database;
using Drips.Messaging.Infrastructure.Repositories;
using Microsoft.AspNetCore.Connections;
using Microsoft.Data.Sqlite;
using Serilog;
using System.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Your Vite port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Host.UseSerilog((ctx, lc) =>
    lc.WriteTo.Console());

//builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // This converts all Enums to their String names in the JSON output
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get the string from the configuration
var connectionString = builder.Configuration.GetConnectionString("DripsConnection");

// Inject it into your factory
builder.Services.AddSingleton(new DbConnectionFactory(connectionString!));


//builder.Services.AddSingleton(new DbConnectionFactory("Data Source=messaging.db"));
builder.Services.AddScoped<IDbConnection>(sp =>
    sp.GetRequiredService<DbConnectionFactory>().CreateConnection());

builder.Services.AddScoped<MessageRepository>();
builder.Services.AddScoped<MessageClassifier>();
builder.Services.AddScoped<CampaignAnalyticsRepository>();
builder.Services.AddScoped<CampaignRepository>();
builder.Services.AddScoped<ConversationRepository>();


SqlMapper.AddTypeHandler(new GuidTypeHandler());
var app = builder.Build();


// --- ADD THIS SECTION ---
// Manually resolve the factory and run the init
using (var scope = app.Services.CreateScope())
{
    var factory = scope.ServiceProvider.GetRequiredService<DbConnectionFactory>();
    try
    {
        factory.Initialize();
        Log.Information("SQLite Database and Tables initialized successfully.");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while initializing the database.");
    }
}
// ------------------------



// enable the cors policy ---
// this MUST come after UseRouting and BEFORE UseAuthorization
app.UseCors("AllowReactApp");

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();




//to fix SQLLite guid issues, we can create a custom type handler for Dapper to convert between Guid and string

public class GuidTypeHandler : SqlMapper.TypeHandler<Guid>
{
    // This handles sending a Guid TO the database as a string
    public override void SetValue(IDbDataParameter parameter, Guid value)
        => parameter.Value = value.ToString();

    // This handles taking the string FROM the database and making it a Guid
    public override Guid Parse(object value)
        => Guid.Parse((string)value);
}
