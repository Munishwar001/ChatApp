using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using App.Application.Interfaces;

namespace App.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly SmtpClient _smtpClient;
        private readonly string _from;

        public EmailService(IConfiguration config)
        {
            _config = config;

            var smtpSettings = _config.GetSection("Smtp");
            string host = smtpSettings["Host"];
            int port = int.Parse(smtpSettings["Port"]);
            string username = smtpSettings["Username"];
            string password = smtpSettings["Password"];
            _from = smtpSettings["From"];
            bool enableSsl = bool.Parse(smtpSettings["EnableSsl"]);

            _smtpClient = new SmtpClient(host)
            {
                Port = port,
                Credentials = new NetworkCredential(username, password),
                EnableSsl = enableSsl
            };
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var mailMessage = new MailMessage(_from, to, subject, body)
            {
                IsBodyHtml = true
            };

            await _smtpClient.SendMailAsync(mailMessage);
        }

        public string GetEmailTemplate(string templateName, Dictionary<string, string> placeholders)
        {
            var basePath = Directory.GetParent(Directory.GetCurrentDirectory())?.FullName;
            var path = Path.Combine(basePath, "App.Infrastructure", "Templates", templateName);

            if (!File.Exists(path))
                throw new FileNotFoundException($"Email template not found: {path}");

            var html = File.ReadAllText(path);

            foreach (var kvp in placeholders)
            {
                html = html.Replace($"{{{{{kvp.Key}}}}}", kvp.Value);
            }

            return html;
        }
    }
}
