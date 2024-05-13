using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ForgotPasswordModel
    {
        [EmailAddress]
        public string Email { get; set; }
    }
}
