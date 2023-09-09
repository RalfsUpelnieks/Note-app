using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
    public class Block {
        [Key]
        public string blockId { get; set; }
        required public string tag { get; set; }
        public string html { get; set; } = string.Empty;
        [MaxLength(-1)]
        public string uniqueData { get; set; }
        required public int position { get; set; }

        required public string pageId { get; set; }
        public Page Page { get; set; }
        public File file { get; set; }
        public ICollection<Event> Event { get; set; }
    }
}
