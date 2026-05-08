using Backend.API.Configurations;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Host.UseSerilog((ctx, cfg) =>
{
    cfg.WriteTo.Seq("http://seq:80")
       .WriteTo.Console();
});

var app = builder.Build();

await app.Configure();

app.Run();