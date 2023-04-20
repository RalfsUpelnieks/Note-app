using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace backend.Models {
    public class File {
        [Key]
        public string blockId { get; set; }
        public string url { get; set; }
        public int size { get; set; }

        public Block block { get; set; }
    }
}
