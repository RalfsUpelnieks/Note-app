using System.ComponentModel.DataAnnotations;

namespace backend.Models {
    public class Block {
        [Key, StringLength(24)]
        public string blockId { get; set; } = null!;

        [Required, StringLength(30)]
        public string type { get; set; } = null!;

        public string properties { get; set; } = null!;

        [Required]
        public int position { get; set; }

        [Required, StringLength(24)]
        public string pageId { get; set; } = null!;

        public Page Page { get; set; } = null!;
        public Files File { get; set; } = null!;
    }
}
