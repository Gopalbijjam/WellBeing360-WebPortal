using Microsoft.EntityFrameworkCore;
using WellBeing360.RewardsService.Entities;
using System;

namespace WellBeing360.RewardsService.Data
{
    public class RewardsDbContext : DbContext
    {
        public RewardsDbContext(DbContextOptions<RewardsDbContext> options) : base(options)
        {
        }

        public DbSet<RecognitionAward> RecognitionAwards { get; set; }
        public DbSet<RewardPoints> RewardPoints { get; set; }
        public DbSet<RedemptionCatalog> RedemptionCatalogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<BenefitsReport> BenefitsReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Seed 20 Redemption Catalog Items
            var catalogItems = new RedemptionCatalog[20];
            for (int i = 0; i < 20; i++)
            {
                catalogItems[i] = new RedemptionCatalog
                {
                    ItemID = i + 1,
                    ItemName = i % 4 == 0 ? $"INR {500 * (i/4 + 1)} Flipkart Voucher" :
                               i % 4 == 1 ? $"INR {1000 * (i/4 + 1)} Decathlon Card" :
                               i % 4 == 2 ? $"Premium South Indian Spice Gift Pack {i/4 + 1}" :
                                            $"Yoga Mat & Health Gear Pack {i/4 + 1}",
                    Category = i % 4 == 2 ? "Merchandise" : "Voucher",
                    PointsRequired = 100 * (i + 1),
                    AvailableQuantity = 50 + i,
                    Status = "Available"
                };
            }
            modelBuilder.Entity<RedemptionCatalog>().HasData(catalogItems);

            // 2. Seed 20 RewardPoints (matching our 20 Employee IDs)
            string[] empIds = {
                "EMP-482019", "EMP-928103", "EMP-104928", "EMP-736281", "EMP-283746",
                "EMP-573829", "EMP-100007", "EMP-100008", "EMP-100009", "EMP-100010",
                "EMP-100011", "EMP-100012", "EMP-100013", "EMP-100014", "EMP-100015",
                "EMP-100016", "EMP-100017", "EMP-100018", "EMP-100019", "EMP-100020"
            };

            var points = new RewardPoints[20];
            for (int i = 0; i < 20; i++)
            {
                points[i] = new RewardPoints
                {
                    PointsID = i + 1,
                    EmployeeID = empIds[i],
                    TotalEarned = 100 * (i + 2),
                    TotalRedeemed = 50 * (i % 2),
                    Balance = (100 * (i + 2)) - (50 * (i % 2)),
                    LastUpdated = DateTime.UtcNow
                };
            }
            modelBuilder.Entity<RewardPoints>().HasData(points);

            // 3. Seed 20 RecognitionAwards
            string[] awardMessages = {
                "Karthik Venkataraman went above and beyond on engineering sprint!",
                "Lakshmi Narayanan configures the flex buckets perfectly.",
                "Ramesh Srinivasan helped review the whole budget reports.",
                "Emma Soundararajan launched an amazing 10K steps challenge.",
                "David Rajarajan designed a spectacular badge nominations screen.",
                "Alice Meenakshi set up the local db connection smoothly.",
                "Ananth Balasubramanian completed his health assessment early.",
                "Meera Sundaram showed excellent teamwork in sales demo.",
                "Hariharan Murugan coordinated the customer success logs.",
                "Priyanka Raghavan delivered the frontend Vite client builds.",
                "Venkat Krishnan solved the port binding conflict issue.",
                "Sridhar Radhakrishnan helped seed the SQL databases.",
                "Divya Swaminathan contributed code to the authentication api.",
                "Suresh Kuppusamy provided critical testing logs.",
                "Chitra Subramaniam approved all pending benefit enrolments.",
                "Rajan Chinnasamy helped design the Groww Light mode theme.",
                "Vijay Deverakonda participated in the hydration sprint.",
                "Nandini Ramakrishnan configured the EAP sessions list.",
                "Balaji Venkatesh resolved the type load exception error.",
                "Kavitha Rangaswamy wrote excellent unit verification plans."
            };

            var awards = new RecognitionAward[20];
            for (int i = 0; i < 20; i++)
            {
                awards[i] = new RecognitionAward
                {
                    AwardID = i + 1,
                    NominatorID = empIds[(i + 1) % 20],
                    RecipientID = empIds[i],
                    Category = i % 3 == 0 ? "Innovation" : i % 3 == 1 ? "Collaboration" : "Excellence",
                    BadgeName = i % 3 == 0 ? "ProblemSolver" : i % 3 == 1 ? "TeamPlayer" : "StarPerformer",
                    Message = awardMessages[i],
                    PointsAwarded = 100,
                    AwardDate = DateTime.UtcNow.AddDays(-i),
                    Status = "Awarded"
                };
            }
            modelBuilder.Entity<RecognitionAward>().HasData(awards);

            // 4. Seed 20 Notifications
            var notifications = new Notification[20];
            for (int i = 0; i < 20; i++)
            {
                notifications[i] = new Notification
                {
                    NotificationID = i + 1,
                    UserID = empIds[i],
                    Message = i % 2 == 0 ? "You have received a new recognition badge nomination!" : "Your flex benefits enrolment was processed successfully.",
                    Category = i % 2 == 0 ? "Recognition" : "Benefits",
                    Status = i % 3 == 0 ? "Read" : "Unread",
                    CreatedDate = DateTime.UtcNow.AddHours(-i)
                };
            }
            modelBuilder.Entity<Notification>().HasData(notifications);

            // 5. Seed 20 BenefitsReports
            var reports = new BenefitsReport[20];
            for (int i = 0; i < 20; i++)
            {
                reports[i] = new BenefitsReport
                {
                    ReportID = i + 1,
                    Scope = i % 3 == 0 ? "Global" : i % 3 == 1 ? "Department" : "Grade",
                    Metrics = $"{{\"EnrolmentRate\": {75.5f + (i % 5)}, \"PremiumCost\": {10000.00m * (i + 1)}}}",
                    GeneratedDate = DateTime.UtcNow.AddDays(-i)
                };
            }
            modelBuilder.Entity<BenefitsReport>().HasData(reports);
        }
    }
}
