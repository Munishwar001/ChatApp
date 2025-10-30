
namespace App.Application.Interfaces 
{ 
    public interface IEmailService
    {
        string GetEmailTemplate(string templateName, Dictionary<string, string> placeholders);
        Task SendEmailAsync(string to, string subject, string body);
    }
}