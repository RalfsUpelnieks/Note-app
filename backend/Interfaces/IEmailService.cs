namespace backend.Interfaces
{
    public interface IEmailService
    {
        public Task<bool> SendEmailAsync(string subject, string message, string toEmail);
    }
}
