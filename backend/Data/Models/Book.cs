using System.ComponentModel.DataAnnotations;

namespace backend.Data
{
    public class Book
    {
        [Key, MaxLength(24)]
        public string BookId { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Color { get; set; } = null!;
        public int Position { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [MaxLength(24)]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<Page> Pages { get; set; } = null!;
    }
}
