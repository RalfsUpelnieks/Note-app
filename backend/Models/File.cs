using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace backend.Models {
    public class File {
        [Key, StringLength(24)]
        public string blockId { get; set; } = null!;
        public string url { get; set; } = null!;
        public int size { get; set; }

        public Block block { get; set; } = null!;
    }
}
