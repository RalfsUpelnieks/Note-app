namespace backend.Models.User
{
    public class AdminUserRegistration : UserRegistration
    {
        public bool IsAdmin { get; set; }
    }
}
