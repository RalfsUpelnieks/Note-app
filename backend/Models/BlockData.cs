namespace backend.Models 
{
    public class BlockData : GetBlockData
    {
        public int Position { get; set; }
        public string PageId { get; set; }
    }
}
