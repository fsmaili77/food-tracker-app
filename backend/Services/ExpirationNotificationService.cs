using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using System.Net.Mail;
using System.Net;
using FoodTracker.Data;
using FoodTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodTracker.Services
{
    public class ExpirationNotificationService : BackgroundService
    {
        private readonly TimeSpan _checkInterval = TimeSpan.FromHours(24);
        private readonly ILogger<ExpirationNotificationService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly string? _notificationEmail;

        public ExpirationNotificationService(IServiceProvider serviceProvider, IConfiguration configuration, ILogger<ExpirationNotificationService> logger)
        {
            _serviceProvider = serviceProvider;
            _notificationEmail = configuration["NotificationEmail"];
            _logger = logger;
        }

        

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckExpirationsAsync();
                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckExpirationsAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<FoodContext>();

            var soonToExpire = await db.FoodItems
                .Where(f => f.ExpirationDate <= DateTime.UtcNow.AddDays(7) && f.ExpirationDate >= DateTime.UtcNow)
                .ToListAsync();

            if (soonToExpire.Any())
            {
                await SendNotificationEmailAsync(soonToExpire);
            }
        }

        private async Task SendNotificationEmailAsync(List<FoodItem> items)
        {
            if (string.IsNullOrEmpty(_notificationEmail))
                return;

            var body = "The following food items are about to expire within a week:\n\n" +
                       string.Join("\n", items.Select(i => $"{i.Name} - {i.ExpirationDate:d}"));
            
            //try-catch block to handle potential exceptions during email sending
            try
            {

            using var client = new SmtpClient("smtp.example.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("username", "password"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("no-reply@foodtracker.com"),
                Subject = "Food Expiration Notification",
                Body = body,
                IsBodyHtml = false,
            };
            mailMessage.To.Add(_notificationEmail);

            await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
             _logger.LogError(ex, "Failed to send expiration notification email.");
            }  
                
                finally
                {
                    _logger.LogInformation("Expiration notification email sent successfully.");
                }
        }
    }
}
