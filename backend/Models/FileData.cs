using backend.Data;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class FileData
    {
        [MaxLength(24)]
        public string BlockId { get; set; } = null!;
        public string OwnersUsername { get; set; } = null!;
        public string Filename { get; set; } = null!;
        public long Size { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
