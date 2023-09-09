using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
    public class User {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(30)]
        public string Name { get; set; } = null!;

        [StringLength(30)]
        public string Surname { get; set; } = null!;

        [Required, StringLength(255)]
        public string Username { get; set; } = null!;

        [Required, StringLength(320)]
        public string EmailAddress { get; set; } = null!;

        [Required, StringLength(500)]
        public string PasswordHash { get; set; } = null!;
        public int Role { get; set; } = 0;
        public ICollection<Page> Pages { get; set; } = null!;
    }
}
