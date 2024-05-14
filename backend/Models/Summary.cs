namespace backend.Models
{
    public class Summary
    {
        public int Users { get; set; }
        public int Books { get; set; }
        public int Pages { get; set; }
        public int Blocks { get; set; }
        public int Files { get; set; }

        public List<UsersCreatedInDay> newUsersPastWeek { get; set; }
        public List<EntitiesCreatedInDay> entitiesCreatedPastMonth { get; set; }
    }
}
