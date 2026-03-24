
using System.Reflection;
using System.Security.Claims;
using System.Text;
using Backend.API.Abstractions;
using Backend.API.DTO;
using Backend.API.Services;
using Backend.API.Validators;
using Backend.DataAccess;
using Backend.DataAccess.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.API.Configurations;

public static class DI
{
    public static IMvcBuilder AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        return services
            .AddAuth(configuration)
            .AddRedis(configuration)
            .AddMySwaggerGen()
            .AddMyDbContext(configuration)
            .AddMyServices()
            .AddMyRepositories()
            .AddMyValidators()
            .AddProfile()
            .AddCorsPolicy()
            .AddMySignalR()
            .AddControllers();
    }

    private static IServiceCollection AddProfile(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg =>
        {

        }, Assembly.GetExecutingAssembly());

        return services;
    }

    private static IServiceCollection AddMySwaggerGen(this IServiceCollection services)
    {
        services.AddSwaggerGen();
        services.AddOpenApi();

        return services;
    }

    private static IServiceCollection AddMyServices(this IServiceCollection services)
    {
        services.AddScoped<HouseAnnouncementsService>();
        services.AddScoped<JwtService>();
        services.AddScoped<UsersService>();
        services.AddScoped<ChatsService>();
        services.AddScoped<ChatsParticipantService>();
        services.AddScoped<HashPassword>();
        services.AddScoped<MessagesService>();
        services.AddScoped<IEmailSenderService, EmailSenderService>();
        services.AddScoped<IEmailVerificationService, EmailVerificationService>();
        services.AddScoped<EmailCodesService>();
        services.AddScoped<UsersAnnouncementsService>();

        return services;
    }

    private static IServiceCollection AddMyRepositories(this IServiceCollection services)
    {
        services.AddScoped<UserRepository>();
        services.AddScoped<FlatsRepository>();
        services.AddScoped<AnnouncementHouseRepository>();
        services.AddScoped<AnnouncementPhotoRepository>();

        return services;
    }

    private static IServiceCollection AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy
                    .WithOrigins(
                        "https://roomate.ru",
                        "https://overteck.ru",
                        "http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }

    private static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JWT");
        var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        })
            .AddCookie()
            .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = jwtSettings["Issuer"]!,
                ValidAudience = jwtSettings["Audience"]!,
                IssuerSigningKey = new SymmetricSecurityKey(secretKey)
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["token"];

                    return Task.CompletedTask;
                }
            };
        })
            .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
        {
            options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

            var section = configuration.GetSection("GoogleOAUTH");

            options.ClientId = section["ClientId"];
            options.ClientSecret = section["ClientSecret"];
            options.CallbackPath = "/google-callback";
            options.Scope.Add("profile");
            options.ClaimActions.MapJsonKey("picture", "picture");

            options.Events = new OAuthEvents
            {
                OnCreatingTicket = async context =>
                {
                    var email = context.Principal?.FindFirst(ClaimTypes.Email)?.Value;
                    var name = context.Principal?.FindFirst(ClaimTypes.GivenName)?.Value;
                    var surname = context.Principal?.FindFirst(ClaimTypes.Surname)?.Value;
                    var googleId = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    var picture = context.Principal.FindFirst("picture")?.Value;

                    if (email == null) return;

                    var usersService = context.HttpContext.RequestServices.GetRequiredService<UsersService>();

                    var newUser = new RegistrationRequest
                    (
                        email,
                        null,
                        surname,
                        null,
                        name,
                        null,
                        null,
                        null,
                        picture,
                        null
                    );

                    var token = await usersService.LoginWithGoogle(newUser);

                    context.HttpContext.Response.Cookies.Append("token", token, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Lax,
                    });
                },
            };
        });

        services.Configure<JwtOptions>(configuration.GetSection("JWT"));

        return services;
    }

    private static IServiceCollection AddMyDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString(nameof(MyDbContext));

        services.AddDbContext<MyDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        return services;
    }

    private static IServiceCollection AddMyValidators(this IServiceCollection services)
    {
        services.AddScoped<IValidator<RegistrationRequest>, UserRequestValidator>();
        services.AddScoped<IValidator<AnnouncementFlatRequest>, AnnouncementHouseRequestValidator>();
        services.AddScoped<IValidator<UpdateUserRequest>, UpdateUserRequestValidator>();
        services.AddScoped<IValidator<UserAnnouncementRequest>, UserAnnouncementValidator>();
        services.AddScoped<IValidator<UpdateAnnouncementRequest>, UpdateAnnouncementHouseValidator>();

        return services;
    }

    private static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
        });

        return services;
    }

    private static IServiceCollection AddMySignalR(this IServiceCollection services)
    {
        services.AddSignalR();

        return services;
    }
}