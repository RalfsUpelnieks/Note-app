using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [MaxLength(30)]
        public string Name { get; set; } = null!;

        [MaxLength(30)]
        public string Surname { get; set; } = null!;

        [MaxLength(255)]
        public string Username { get; set; } = null!;

        [MaxLength(320)]
        public string EmailAddress { get; set; } = null!;

        [MaxLength(500)]
        public string PasswordHash { get; set; } = null!;

        public bool EmailConfirmed { get; set; }

        [MaxLength(200)]
        public string? SecurityStamp { get; set; } = null!;

        public DateTime? StampExpiresAt { get; set; }

        public DateTime LastLoginAt { get; set; }
        public DateTime RegisteredAt { get; set; }
        public int Role { get; set; } = 0;
        public ICollection<Book> Books { get; set; } = null!;
    }
}
