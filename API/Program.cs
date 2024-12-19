using DokkanAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Ensure no trailing slash
            .AllowAnyHeader()
            .AllowAnyMethod();

    });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// Add detailed logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Add services to the container.
builder.Services.AddControllers(); // This is already present
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Authorization and Authentication services
builder.Services.AddAuthentication().AddCookie();
builder.Services.AddAuthorization();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(op => op.UseNpgsql(connectionString));
builder.Services.AddTransient<ICardService, CardService>();
builder.Services.AddMvc();
builder.Services.AddRouting();

var app = builder.Build();
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
