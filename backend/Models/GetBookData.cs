namespace backend.Models
{
    public class GetBookData : BookData
    {
        public List<GetPageData> Pages { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
    }
}
