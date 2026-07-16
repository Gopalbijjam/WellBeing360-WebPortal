using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add YARP reverse proxy services
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add JWT Authentication - must match the signing key/issuer/audience used by IdentityService
var keyStr = builder.Configuration["Jwt:Key"] ?? "SuperSecretWellBeing360SigningKey2026!";
var key = Encoding.ASCII.GetBytes(keyStr);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "WellBeing360",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "WellBeing360Client",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("authenticated", policy => policy.RequireAuthenticatedUser());
});

var app = builder.Build();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// Map reverse proxy routes
app.MapReverseProxy();

app.Run();
