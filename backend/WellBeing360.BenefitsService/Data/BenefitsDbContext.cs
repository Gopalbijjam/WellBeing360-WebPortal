using Microsoft.EntityFrameworkCore;
using WellBeing360.BenefitsService.Entities;
using System;

namespace WellBeing360.BenefitsService.Data
{
    public class BenefitsDbContext : DbContext
    {
        public BenefitsDbContext(DbContextOptions<BenefitsDbContext> options) : base(options)
        {
        }

        public DbSet<BenefitPlan> BenefitPlans { get; set; }
        public DbSet<FlexBenefitBucket> FlexBenefitBuckets { get; set; }
        public DbSet<EnrolmentWindow> EnrolmentWindows { get; set; }
        public DbSet<BenefitEnrolment> BenefitEnrolments { get; set; }
        public DbSet<Dependent> Dependents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Seed 20 Benefit Plans
            var plans = new BenefitPlan[20];
            for (int i = 0; i < 20; i++)
            {
                plans[i] = new BenefitPlan
                {
                    PlanID = i + 1,
                    PlanName = i % 4 == 0 ? $"Gold Premium Health Plan {i/4 + 1}" :
                               i % 4 == 1 ? $"Silver Saver Health Plan {i/4 + 1}" :
                               i % 4 == 2 ? $"Elite Dental Care Plan {i/4 + 1}" :
                                            $"Flex Wellness Benefit Program {i/4 + 1}",
                    PlanType = i % 4 == 3 ? "FlexibleBenefit" : "GroupHealthInsurance",
                    EligibilityGrade = "G1,G2,G3,G4,G5,G6,G7",
                    EmployeeContribution = 10.00m * (i + 1),
                    EmployerContribution = 50.00m * (i + 1),
                    CoverageLimit = 100000.00m * (i + 1),
                    EffectiveDate = new DateTime(2026, 1, 1),
                    Status = "Active"
                };
            }
            modelBuilder.Entity<BenefitPlan>().HasData(plans);

            // 2. Seed 20 Flex Benefit Buckets
            var buckets = new FlexBenefitBucket[20];
            for (int i = 0; i < 20; i++)
            {
                buckets[i] = new FlexBenefitBucket
                {
                    BucketID = i + 1,
                    PlanID = ((i * 4) % 20) + 4, // Associated with FlexibleBenefit plans
                    BucketName = i % 5 == 0 ? "Medical Care" :
                                 i % 5 == 1 ? "Childcare Allowance" :
                                 i % 5 == 2 ? "Fitness Allowance" :
                                 i % 5 == 3 ? "Educational Support" :
                                              "Meal Allowance",
                    AnnualAllowance = 10000.00m * (i % 5 + 1),
                    CarryForwardAllowed = i % 2 == 0,
                    Status = "Active"
                };
            }
            modelBuilder.Entity<FlexBenefitBucket>().HasData(buckets);

            // 3. Seed 20 Enrolment Windows
            var windows = new EnrolmentWindow[20];
            for (int i = 0; i < 20; i++)
            {
                windows[i] = new EnrolmentWindow
                {
                    WindowID = i + 1,
                    PlanYear = 2020 + i,
                    OpenDate = new DateTime(2020 + i, 1, 1),
                    CloseDate = new DateTime(2020 + i, 12, 31),
                    EligibleGrades = "G1,G2,G3,G4,G5,G6,G7",
                    Status = i == 6 ? "Open" : "Closed" // Year 2026 is open
                };
            }
            modelBuilder.Entity<EnrolmentWindow>().HasData(windows);

            // 4. Seed 20 Benefit Enrolments
            string[] empIds = {
                "EMP-482019", "EMP-928103", "EMP-104928", "EMP-736281", "EMP-283746",
                "EMP-573829", "EMP-100007", "EMP-100008", "EMP-100009", "EMP-100010",
                "EMP-100011", "EMP-100012", "EMP-100013", "EMP-100014", "EMP-100015",
                "EMP-100016", "EMP-100017", "EMP-100018", "EMP-100019", "EMP-100020"
            };

            var enrolments = new BenefitEnrolment[20];
            for (int i = 0; i < 20; i++)
            {
                enrolments[i] = new BenefitEnrolment
                {
                    EnrolmentID = i + 1,
                    EmployeeID = empIds[i],
                    PlanID = (i % 20) + 1,
                    WindowID = 1,
                    CoverageOption = "Individual",
                    DependentsIncluded = i % 2 == 1,
                    EmployeeContributionAmount = 50.00m * (i + 1),
                    EffectiveDate = new DateTime(2026, 1, 1),
                    Status = i % 3 == 0 ? "Active" : i % 3 == 1 ? "Submitted" : "Cancelled"
                };
            }
            modelBuilder.Entity<BenefitEnrolment>().HasData(enrolments);

            // 5. Seed 20 Dependents with South Indian Names
            string[] southNames = {
                "Srinivasan Ramanathan", "Meenakshi Sundaram", "Karthik Subramanian", "Ananda Krishnan",
                "Divya Balasubramanian", "Hariharan Venkatraman", "Lakshmi Raghavan", "Rajan Swaminathan",
                "Sundar Kuppusamy", "Priyanka Deverakonda", "Suresh Chinnasamy", "Nandini Ramakrishnan",
                "Vijay Venkatesh", "Balaji Rangaswamy", "Chitra Rajarajan", "Sridhar Radhakrishnan",
                "Ramesh Kuppusamy", "Meera Subramaniam", "Kavitha Murugan", "Venkat Krishnaswamy"
            };

            var dependents = new Dependent[20];
            for (int i = 0; i < 20; i++)
            {
                dependents[i] = new Dependent
                {
                    DependentID = i + 1,
                    EmployeeID = empIds[i],
                    Name = southNames[i],
                    Relationship = i % 4 == 0 ? "Spouse" : i % 4 == 1 ? "Child" : i % 4 == 2 ? "Parent" : "Spouse",
                    DateOfBirth = new DateTime(1980 + (i * 2), 5, 12),
                    Status = "Active"
                };
            }
            modelBuilder.Entity<Dependent>().HasData(dependents);
        }
    }
}
