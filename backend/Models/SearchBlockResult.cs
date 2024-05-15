namespace backend.Models
{
    public class SearchBlockResult
    {
        public string PageId { get; set; }
        public string BookTitle { get; set; }
        public string PageTitle { get; set; }
        public string Content { get; set; }
        public int Position { get; set; }
    }
}
