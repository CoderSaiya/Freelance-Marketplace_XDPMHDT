using FreelanceMarketplace.Services.Interface;
using FreelanceMarketplace.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FreelanceMarketplace.Data;
using FreelanceMarketplace.Middlewares;
using FreelanceMarketplace.Hubs;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using FreelanceMarketplace.GraphQL.Schemas.Mutations;
using FreelanceMarketplace.GraphQL.Schemas.Queries;
using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.GraphQL.Schemas;
using GraphQL;
using GraphQL.Types;
using FreelanceMarketplace.Services.Implementations;
using FreelanceMarketplace.Services.Interfaces;


var builder = WebApplication.CreateBuilder(args);

// Add SignalR service
builder.Services.AddSignalR();

// Configure authentication with JWT Bearer
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    //options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = ClaimTypes.Role
    };

    // Add this section to handle WebSocket authentication
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = "838128278169-ug2l134id0g6krlkhiklt8u606iln46u.apps.googleusercontent.com";
    options.ClientSecret = "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";
    options.CallbackPath = "/auth/callback";
});

builder.Services.AddControllersWithViews();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:5173") // replace with your frontend port
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// Configure authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("FreelancerOnly", policy => policy.RequireRole("Freelancer"));
    options.AddPolicy("ClientOnly", policy => policy.RequireRole("Client"));
    options.AddPolicy("Public", policy => policy.RequireAssertion(context => true));
});

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IImgService, ImgService>();
builder.Services.AddScoped<GoogleDriveService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IApplyService, ApplyService>();
builder.Services.AddScoped<IContractService, ContractService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

// Configure Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        connectionString: "Data Source=DESKTOP-1FAVEMH\\SQLEXPRESS;Initial Catalog=FreelanceMarketplace;Integrated Security=True;trusted_connection=true;encrypt=false;",
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }),
    contextLifetime: ServiceLifetime.Scoped,
    optionsLifetime: ServiceLifetime.Singleton
);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Freelance Marketplace", Version = "v1" }));

builder.Services.AddSwaggerGen(c =>
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    }));
builder.Services.AddSwaggerGen(c =>
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    }));

// Register GraphQL types with scoped lifetime
builder.Services.AddScoped<ISchema, MainSchema>();

builder.Services.AddScoped<UserQuery>();
builder.Services.AddScoped<ContractQuery>();
builder.Services.AddScoped<CategoryQuery>();
builder.Services.AddScoped<ProjectQuery>();
builder.Services.AddScoped<UserProfileQuery>();
builder.Services.AddScoped<NotificationQuery>();
builder.Services.AddScoped<ApplyQuery>();

builder.Services.AddScoped<UserMutation>();
builder.Services.AddScoped<ContractMutation>();
builder.Services.AddScoped<CategoryMutation>();
builder.Services.AddScoped<ProjectMutation>();
builder.Services.AddScoped<UserProfileMutation>();
builder.Services.AddScoped<NotificationMutation>();
builder.Services.AddScoped<ApplyMutation>();

builder.Services.AddScoped<UserType>();
builder.Services.AddScoped<RefreshTokenType>();
builder.Services.AddScoped<UserProfileType>();
builder.Services.AddScoped<ProjectType>();
builder.Services.AddScoped<ContractType>();
builder.Services.AddScoped<ContractInputType>();
builder.Services.AddScoped<CategoryType>();
builder.Services.AddScoped<CategoryInputType>();
builder.Services.AddScoped<ProjectType>();
builder.Services.AddScoped<ProjectInputType>();
builder.Services.AddScoped<UserProfileType>();
builder.Services.AddScoped<NotificationType>();
builder.Services.AddScoped<ApplyType>();

builder.Services.AddScoped<PaymentType>();
builder.Services.AddScoped<PaymentInputType>();

builder.Services.AddScoped<ReviewType>();
builder.Services.AddScoped<ReviewInputType>();

// Adjust the GraphQL configuration to use AddSelfActivatingSchema
builder.Services.AddGraphQL(b => b
    .AddSelfActivatingSchema<MainSchema>()
    .AddSystemTextJson()
    .AddErrorInfoProvider(opt =>
    {
        opt.ExposeExceptionDetails = builder.Environment.IsDevelopment();
    })
    .AddErrorInfoProvider(opt => opt.ExposeExceptionDetails = builder.Environment.IsDevelopment())
    .AddGraphTypes(typeof(MainSchema).Assembly)
    .AddUserContextBuilder(ctx => new Dictionary<string, object?>
    {
        { "User", ctx.User }
    })
);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseGraphQLPlayground(); // GraphQL Playground UI
}

app.UseHttpsRedirection();

// Add UseRouting before UseAuthentication and UseAuthorization
app.UseRouting();

// Place UseCors before UseAuthentication and UseAuthorization
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<RoleMiddleware>();

// Use UseEndpoints to map hub and controllers
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<NotificationHub>("/notificationHub"); 
    endpoints.MapHub<ChatHub>("/chathub");
    endpoints.MapHub<VideoCallHub>("/videocallhub");
    endpoints.MapControllers();
    endpoints.MapMethods("/api/Auth/signin-google", new[] { "OPTIONS" }, context =>
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:5173");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        context.Response.StatusCode = 200;
        return Task.CompletedTask;
    });
});

app.UseGraphQL<ISchema>("/graphql"); // GraphQL endpoint

app.Run();