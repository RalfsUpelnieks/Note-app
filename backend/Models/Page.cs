using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
    public class Page {
        [Key, StringLength(24)]
        public string pageId { get; set; } = null!;

        public string title { get; set; } = null!;

        public int userId { get; set; }

        [Required, StringLength(24)]
        public User User { get; set; } = null!;

        public ICollection<Block> Blocks { get; set; } = null!;
    }
}