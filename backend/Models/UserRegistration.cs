namespace backend.Models
{
    public class UserRegistration
    {
        public required string FirstName { get; set; }
        public required string Lastname { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
