using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
    public class Block {
        [Key]
        public string blockId { get; set; }
        required public string tag { get; set; }
        public string html { get; set; } = string.Empty;
        public string imageUrl { get; set; } = string.Empty;

        [ForeignKey("Page")]
        required public string PageId { get; set; }
        required public Page Page { get; set; }
    }
}
