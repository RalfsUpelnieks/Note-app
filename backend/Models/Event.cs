using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
    public class Event {
        [Key]
        public string eventId { get; set; }
        public string title { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        required public string blockId { get; set; }
        required public Block Block { get; set; }
    }
}
