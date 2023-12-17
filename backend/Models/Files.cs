using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace backend.Models {
    public class Files {
        [Key, StringLength(24)]
        public string blockId { get; set; } = null!;
        public string filename { get; set; } = null!;
        public string url { get; set; } = null!;
        public long size { get; set; }

        public Block Block { get; set; } = null!;
    }
}
