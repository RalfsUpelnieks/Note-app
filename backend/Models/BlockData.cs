using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models {
    public class BlockData {
        public string blockId { get; set; }
        public string tag { get; set; }
        public string html { get; set; }
        public string uniqueData { get; set; }
        public int position { get; set; }
        public string pageId { get; set; }
    }
}
