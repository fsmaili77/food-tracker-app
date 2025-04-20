
using Microsoft.EntityFrameworkCore;
using FoodTracker.Data;
using FoodTracker.Models;
using FoodTracker.Services;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<FoodContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add background service for expiration notification
builder.Services.AddHostedService<ExpirationNotificationService>();

var app = builder.Build();

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/fooditems", async (FoodContext db) =>
    await db.FoodItems.OrderBy(f => f.ExpirationDate).ToListAsync());

app.MapPost("/fooditems", async (FoodItemDto foodItemDto, FoodContext db) =>
{
    if (string.IsNullOrWhiteSpace(foodItemDto.Name))
        return Results.BadRequest("Name is required");

    if (foodItemDto.ExpirationDate == default)
        return Results.BadRequest("ExpirationDate is required");

    var exists = await db.FoodItems.AnyAsync(f => f.Name.ToLower() == foodItemDto.Name.ToLower());
    if (exists)
        return Results.Conflict("Food item with the same name already exists");

    var foodItem = new FoodItem
    {
        Name = foodItemDto.Name,
        ExpirationDate = foodItemDto.ExpirationDate
    };

    db.FoodItems.Add(foodItem);
    await db.SaveChangesAsync();

    return Results.Created($"/fooditems/{foodItem.Id}", foodItem);
});

app.MapDelete("/fooditems/{id}", async (int id, FoodContext db) =>
{
    var foodItem = await db.FoodItems.FindAsync(id);
    if (foodItem == null)
        return Results.NotFound();

    db.FoodItems.Remove(foodItem);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();



