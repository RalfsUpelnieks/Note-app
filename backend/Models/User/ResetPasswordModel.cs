using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ResetPasswordModel : ValidateTokenModel
    {
        public string Password { get; set; }
    }
}
