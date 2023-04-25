namespace backend.Models {
    public class UserPasswordChange {
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
    }
}
