namespace backend.Models {
    public class UserRegistration {
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required bool IsAdmin { get; set; }
    }
}
