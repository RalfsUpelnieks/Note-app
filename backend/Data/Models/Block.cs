using System.ComponentModel.DataAnnotations;

namespace backend.Data
{
    public class Block 
    {
        [Key, MaxLength(24)]
        public string BlockId { get; set; } = null!;

        [MaxLength(30)]
        public string Type { get; set; } = null!;

        public string Properties { get; set; } = null!;

        public int Position { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }

        [MaxLength(24)]
        public string PageId { get; set; } = null!;

        public Page Page { get; set; } = null!;
        public StoredFile File { get; set; } = null!;
    }
}
