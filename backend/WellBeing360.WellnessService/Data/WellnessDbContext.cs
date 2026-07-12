using Microsoft.EntityFrameworkCore;
using WellBeing360.WellnessService.Entities;
using System;

namespace WellBeing360.WellnessService.Data
{
    public class WellnessDbContext : DbContext
    {
        public WellnessDbContext(DbContextOptions<WellnessDbContext> options) : base(options)
        {
        }

        public DbSet<WellnessProgram> WellnessPrograms { get; set; }
        public DbSet<WellnessChallenge> WellnessChallenges { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<EAPService> EAPServices { get; set; }
        public DbSet<EAPSession> EAPSessions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            string[] empIds = {
                "EMP-482019", "EMP-928103", "EMP-104928", "EMP-736281", "EMP-283746",
                "EMP-573829", "EMP-100007", "EMP-100008", "EMP-100009", "EMP-100010",
                "EMP-100011", "EMP-100012", "EMP-100013", "EMP-100014", "EMP-100015",
                "EMP-100016", "EMP-100017", "EMP-100018", "EMP-100019", "EMP-100020"
            };

            // 1. Seed 20 Wellness Programs
            var programs = new WellnessProgram[20];
            for (int i = 0; i < 20; i++)
            {
                programs[i] = new WellnessProgram
                {
                    ProgramID = i + 1,
                    Name = i % 3 == 0 ? $"South India Wellness Campaign {i/3 + 1}" :
                           i % 3 == 1 ? $"Active Fitness Sprint {i/3 + 1}" :
                                        $"Mindfulness Camp {i/3 + 1}",
                    Theme = i % 3 == 0 ? "Fitness" : i % 3 == 1 ? "Nutrition" : "MentalHealth",
                    StartDate = new DateTime(2026, 1, 1).AddMonths(i),
                    EndDate = new DateTime(2026, 3, 31).AddMonths(i),
                    PointsOnOffer = 500 * (i + 1),
                    TargetParticipation = 100 * (i + 1),
                    Status = i == 0 ? "Active" : "Upcoming"
                };
            }
            modelBuilder.Entity<WellnessProgram>().HasData(programs);

            // 2. Seed 20 Wellness Challenges
            var challenges = new WellnessChallenge[20];
            for (int i = 0; i < 20; i++)
            {
                challenges[i] = new WellnessChallenge
                {
                    ChallengeID = i + 1,
                    ProgramID = (i % 20) + 1,
                    ChallengeName = i % 4 == 0 ? $"10K Steps Challenge {i/4 + 1}" :
                                    i % 4 == 1 ? $"Meditation Challenge {i/4 + 1}" :
                                    i % 4 == 2 ? $"Hydration Challenge {i/4 + 1}" :
                                                 $"Yoga Challenge {i/4 + 1}",
                    ActivityType = i % 4 == 0 ? "Steps" :
                                   i % 4 == 1 ? "Meditation" :
                                   i % 4 == 2 ? "WaterIntake" :
                                                "Workout",
                    DailyTarget = i % 4 == 0 ? 10000 : i % 4 == 1 ? 15 : i % 4 == 2 ? 8 : 45,
                    Duration = 10 + i,
                    PointsPerCompletion = 50 * (i % 5 + 1),
                    Status = "Active"
                };
            }
            modelBuilder.Entity<WellnessChallenge>().HasData(challenges);

            // 3. Seed 20 Activity Logs
            var logs = new ActivityLog[20];
            for (int i = 0; i < 20; i++)
            {
                logs[i] = new ActivityLog
                {
                    LogID = i + 1,
                    EmployeeID = empIds[i],
                    ChallengeID = i + 1,
                    LogDate = DateTime.UtcNow.AddDays(-i),
                    ActivityValue = i % 4 == 0 ? 10500 : i % 4 == 1 ? 20 : i % 4 == 2 ? 9 : 50,
                    PointsEarned = 50 * (i % 5 + 1),
                    Status = i % 2 == 0 ? "Verified" : "Submitted"
                };
            }
            modelBuilder.Entity<ActivityLog>().HasData(logs);

            // 4. Seed 20 EAP Services
            var services = new EAPService[20];
            for (int i = 0; i < 20; i++)
            {
                services[i] = new EAPService
                {
                    ServiceID = i + 1,
                    ServiceName = i % 4 == 0 ? $"Mental Health Counseling Suite {i/4 + 1}" :
                                  i % 4 == 1 ? $"Personal Finance Advising {i/4 + 1}" :
                                  i % 4 == 2 ? $"Corporate Legal Support {i/4 + 1}" :
                                               $"Work-Life Integration Program {i/4 + 1}",
                    Category = i % 4 == 0 ? "MentalHealthCounselling" :
                               i % 4 == 1 ? "FinancialCounselling" :
                               i % 4 == 2 ? "LegalAdvisory" :
                                            "ParentingAdvisory",
                    SessionsAllowedPerEmployee = 3 + (i % 3),
                    Status = "Active"
                };
            }
            modelBuilder.Entity<EAPService>().HasData(services);

            // 5. Seed 20 EAP Sessions
            string[] counsellorNames = {
                "Dr. Venkat Krishnan", "Dr. Lakshmi Narayanan", "Dr. Rajan Sundaram", "Dr. Meenakshi Ramesh",
                "Dr. Priyanka Raghavan", "Dr. Suresh Subramaniam", "Dr. Suresh Kuppusamy", "Dr. Divya Swaminathan",
                "Dr. Ananth Balasubramanian", "Dr. Meera Sundararajan", "Dr. Hariharan Murugan", "Dr. Balaji Venkatesh",
                "Dr. Sridhar Radhakrishnan", "Dr. Chitra Chinnasamy", "Dr. Vijay Deverakonda", "Dr. Nandini Ramakrishnan",
                "Dr. Ramesh Kuppusamy", "Dr. Balaji Venkatesh", "Dr. Lakshmi Narayanan", "Dr. Rajan Sundararajan"
            };

            var sessions = new EAPSession[20];
            for (int i = 0; i < 20; i++)
            {
                sessions[i] = new EAPSession
                {
                    SessionID = i + 1,
                    ServiceID = i + 1,
                    EmployeeID = empIds[i],
                    RequestedDate = DateTime.UtcNow.AddDays(-1),
                    SessionDate = DateTime.UtcNow.AddDays(i + 1),
                    Status = i % 3 == 0 ? "Scheduled" : i % 3 == 1 ? "Completed" : "Cancelled",
                    CounsellorRef = counsellorNames[i]
                };
            }
            modelBuilder.Entity<EAPSession>().HasData(sessions);
        }
    }
}
