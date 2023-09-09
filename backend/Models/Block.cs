using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
    public class Block {
        [Key, StringLength(24)]
        public string blockId { get; set; } = null!;

        [Required, StringLength(20)]
        public string tag { get; set; } = null!;

        public string html { get; set; } = null!;

        public string uniqueData { get; set; } = null!;

        [Required]
        public int position { get; set; }

        [Required, StringLength(24)]
        public string pageId { get; set; } = null!;

        public Page Page { get; set; } = null!;

        public File file { get; set; } = null!;

        public ICollection<Event> Event { get; set; } = null!;
    }
}
