using Microsoft.EntityFrameworkCore;
using WellBeing360.IdentityService.Entities;
using System;
using System.Security.Cryptography;
using System.Text;

namespace WellBeing360.IdentityService.Data
{
    public class IdentityDbContext : DbContext
    {
        public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var passwordHash = HashPassword("Password123!");

            // Seed 20 Users with South Indian Names
            modelBuilder.Entity<User>().HasData(
                new User { UserID = 1, EmployeeID = "EMP-482019", Name = "Karthik Venkataraman", Role = "Employee", Email = "employee@wellbeing360.com", Phone = "+919444012345", GradeID = "G3", DepartmentID = "Engineering", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 2, EmployeeID = "EMP-928103", Name = "Lakshmi Narayanan", Role = "HRBenefitsAdmin", Email = "hrbenefits@wellbeing360.com", Phone = "+919840123456", GradeID = "G5", DepartmentID = "Human Resources", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 3, EmployeeID = "EMP-104928", Name = "Ramesh Srinivasan", Role = "Finance", Email = "finance@wellbeing360.com", Phone = "+919940123457", GradeID = "G6", DepartmentID = "Finance", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 4, EmployeeID = "EMP-736281", Name = "Emma Soundararajan", Role = "WellnessCoordinator", Email = "wellness@wellbeing360.com", Phone = "+919444012348", GradeID = "G4", DepartmentID = "Human Resources", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 5, EmployeeID = "EMP-283746", Name = "David Rajarajan", Role = "RecognitionManager", Email = "recognition@wellbeing360.com", Phone = "+919840123459", GradeID = "G4", DepartmentID = "People & Culture", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 6, EmployeeID = "EMP-573829", Name = "Alice Meenakshi", Role = "Admin", Email = "admin@wellbeing360.com", Phone = "+919940123460", GradeID = "G7", DepartmentID = "IT", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 7, EmployeeID = "EMP-100007", Name = "Ananth Balasubramanian", Role = "Employee", Email = "ananth@wellbeing360.com", Phone = "+919444000007", GradeID = "G2", DepartmentID = "Engineering", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 8, EmployeeID = "EMP-100008", Name = "Meera Sundaram", Role = "Employee", Email = "meera@wellbeing360.com", Phone = "+919444000008", GradeID = "G3", DepartmentID = "Marketing", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 9, EmployeeID = "EMP-100009", Name = "Hariharan Murugan", Role = "Employee", Email = "hariharan@wellbeing360.com", Phone = "+919444000009", GradeID = "G4", DepartmentID = "Operations", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 10, EmployeeID = "EMP-100010", Name = "Priyanka Raghavan", Role = "Employee", Email = "priyanka@wellbeing360.com", Phone = "+919444000010", GradeID = "G3", DepartmentID = "Engineering", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 11, EmployeeID = "EMP-100011", Name = "Venkat Krishnan", Role = "Employee", Email = "venkat@wellbeing360.com", Phone = "+919444000011", GradeID = "G5", DepartmentID = "Engineering", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 12, EmployeeID = "EMP-100012", Name = "Sridhar Radhakrishnan", Role = "Employee", Email = "sridhar@wellbeing360.com", Phone = "+919444000012", GradeID = "G6", DepartmentID = "Sales", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 13, EmployeeID = "EMP-100013", Name = "Divya Swaminathan", Role = "Employee", Email = "divya@wellbeing360.com", Phone = "+919444000013", GradeID = "G2", DepartmentID = "Customer Success", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 14, EmployeeID = "EMP-100014", Name = "Suresh Kuppusamy", Role = "Employee", Email = "suresh@wellbeing360.com", Phone = "+919444000014", GradeID = "G1", DepartmentID = "Logistics", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 15, EmployeeID = "EMP-100015", Name = "Chitra Subramaniam", Role = "Employee", Email = "chitra@wellbeing360.com", Phone = "+919444000015", GradeID = "G4", DepartmentID = "HR", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 16, EmployeeID = "EMP-100016", Name = "Rajan Chinnasamy", Role = "Employee", Email = "rajan@wellbeing360.com", Phone = "+919444000016", GradeID = "G5", DepartmentID = "Finance", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 17, EmployeeID = "EMP-100017", Name = "Vijay Deverakonda", Role = "Employee", Email = "vijay@wellbeing360.com", Phone = "+919444000017", GradeID = "G6", DepartmentID = "Executive", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 18, EmployeeID = "EMP-100018", Name = "Nandini Ramakrishnan", Role = "Employee", Email = "nandini@wellbeing360.com", Phone = "+919444000018", GradeID = "G3", DepartmentID = "Design", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 19, EmployeeID = "EMP-100019", Name = "Balaji Venkatesh", Role = "Employee", Email = "balaji@wellbeing360.com", Phone = "+919444000019", GradeID = "G4", DepartmentID = "Engineering", Status = "Active", PasswordHash = passwordHash },
                new User { UserID = 20, EmployeeID = "EMP-100020", Name = "Kavitha Rangaswamy", Role = "Employee", Email = "kavitha@wellbeing360.com", Phone = "+919444000020", GradeID = "G3", DepartmentID = "QA", Status = "Active", PasswordHash = passwordHash }
            );

            // Seed 20 AuditLogs
            var auditSeed = new AuditLog[20];
            for (int i = 0; i < 20; i++)
            {
                auditSeed[i] = new AuditLog
                {
                    AuditID = i + 1,
                    UserID = ((i % 20) + 1).ToString(),
                    Action = $"User Action type {(i % 4) + 1}",
                    Module = i % 2 == 0 ? "Identity" : "Benefits",
                    Timestamp = DateTime.UtcNow.AddHours(-i)
                };
            }
            modelBuilder.Entity<AuditLog>().HasData(auditSeed);
        }

        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var builder = new StringBuilder();
                foreach (var b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
