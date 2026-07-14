namespace WellBeing360.WellnessService.DTOs
{
    public class LeaderboardEntry
    {
        public string EmployeeID { get; set; } = string.Empty;
        public int TotalPoints { get; set; }
        public int ActivitiesCompleted { get; set; }
    }
}
