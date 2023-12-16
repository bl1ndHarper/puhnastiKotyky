using System.Net;
using System.Net.Mail;

public class EmailService
{
    private readonly SmtpClient _smtpClient;

    public EmailService(string host, int port, string username, string password)
    {
        _smtpClient = new SmtpClient(host)
        {
            Port = port,
            Credentials = new NetworkCredential(username, password),
            EnableSsl = true
        };
    }

    public void SendConfirmationEmail(string to, string subject, string body)
    {
        var mailMessage = new MailMessage
        {
            From = new MailAddress(_smtpClient.Credentials.GetCredential(_smtpClient.Host, _smtpClient.Port, "basic").UserName),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(to);
        _smtpClient.Send(mailMessage);
    }
}