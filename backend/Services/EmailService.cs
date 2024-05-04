using backend.Interfaces;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private const string EMAIL_SENDERS_KEY = "EmailSettings:Email";
        private const string EMAIL_PORT_KEY = "Port";
        private const string EMAIL_HOST_KEY = "Host";
        private const string EMAIL_PASSWORD_KEY = "Password";

        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(string subject, string message, string toEmail)
        {
            try
            {
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_configuration[EMAIL_SENDERS_KEY]);
                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = subject;

                var builder = new BodyBuilder();
                builder.HtmlBody = message;
                email.Body = builder.ToMessageBody();

                int port;
                int.TryParse(_configuration[EMAIL_PORT_KEY], out port);

                using (var smtp = new SmtpClient())
                {
                    smtp.Connect(_configuration[EMAIL_HOST_KEY], port, SecureSocketOptions.StartTls);
                    smtp.Authenticate(_configuration[EMAIL_SENDERS_KEY], _configuration[EMAIL_PASSWORD_KEY]);

                    var result = await smtp.SendAsync(email);

                    smtp.Disconnect(true);
                }
                return true;
            }
            catch 
            {
                return false;
            }
        }
    }
}
