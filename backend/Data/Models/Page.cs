using System.ComponentModel.DataAnnotations;

namespace backend.Data 
{
    public class Page 
    {
        [Key, MaxLength(24)]
        public string PageId { get; set; }

        public string Title { get; set; }
        public int Position { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }

        [MaxLength(24)]
        public string BookId { get; set; }
        public Book Book { get; set; }

        public ICollection<Block> Blocks { get; set; }
    }
}