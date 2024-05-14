using System.ComponentModel.DataAnnotations;

namespace backend.Data
{
    public class StoredFile
    {
        [MaxLength(24)]
        public string BlockId { get; set; } = null!;
        public string Filename { get; set; } = null!;
        public string Location { get; set; } = null!;
        public long Size { get; set; }
        public DateTime CreatedAt { get; set; }
        public Block Block { get; set; } = null!;
    }
}
