using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
    public class Event {
        [Key, StringLength(24)]
        public string eventId { get; set; } = null!;

        public string title { get; set; } = null!;

        public DateTime startDate { get; set; }

        public DateTime endDate { get; set; }

        [Required, StringLength(24)]
        public string blockId { get; set; } = null!;

        public Block Block { get; set; } = null!;
    }
}
