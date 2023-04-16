using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
    public class Page {
        [Key]
        public string pageId { get; set; }
        public string title { get; set; } = string.Empty;
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
        public ICollection<Block> Blocks { get; set; }
    }
}