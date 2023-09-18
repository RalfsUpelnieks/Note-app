using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models {
    public class BlockData {
        public string blockId { get; set; } = null!;
        public string type { get; set; } = null!;
        public string properties { get; set; } = null!;
        public int position { get; set; }
        public string pageId { get; set; } = null!;
    }
}
