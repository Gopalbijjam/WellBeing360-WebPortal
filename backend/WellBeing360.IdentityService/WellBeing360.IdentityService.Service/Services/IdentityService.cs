using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using WellBeing360.IdentityService.DTOs;
using WellBeing360.IdentityService.Entities;
using WellBeing360.IdentityService.Repositories.Interfaces;
using WellBeing360.IdentityService.Services.Interfaces;

namespace WellBeing360.IdentityService.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly IIdentityRepository _repository;
        private readonly IConfiguration _configuration;

        public IdentityService(IIdentityRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        public async Task<(bool Success, string Message, string? EmployeeID)> RegisterAsync(RegisterRequest request)
        {
            // Check if email already exists
            if (await _repository.UserExistsByEmailAsync(request.Email))
            {
                return (false, "Email is already registered.", null);
            }

            // Validate Role is valid
            var validRoles = new[] { "Employee", "HRBenefitsAdmin", "Finance", "WellnessCoordinator", "RecognitionManager", "Admin" };
            if (Array.IndexOf(validRoles, request.Role) == -1)
            {
                return (false, "Invalid role specified.", null);
            }

            // Generate Random Employee ID: EMP-XXXXXX
            var random = new Random();
            string employeeId;
            do
            {
                employeeId = $"EMP-{random.Next(100000, 999999)}";
            } while (await _repository.GetUserByEmployeeIdAsync(employeeId) != null);

            var user = new User
            {
                Name = request.Name,
                Role = request.Role,
                Email = request.Email,
                Phone = request.Phone,
                GradeID = request.GradeID,
                DepartmentID = request.DepartmentID,
                Status = "Active",
                EmployeeID = employeeId,
                PasswordHash = HashPassword(request.Password)
            };

            await _repository.AddUserAsync(user);
            await _repository.SaveChangesAsync();

            // Log Audit event
            await LogAuditAsync(user.UserID.ToString(), "User Registration", "Identity");

            return (true, "User registered successfully.", employeeId);
        }

        public async Task<(bool Success, string Message, string? Token, User? User)> LoginAsync(LoginRequest request)
        {
            var user = await _repository.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                return (false, "Invalid email or password.", null, null);
            }

            var hashedInput = HashPassword(request.Password);
            if (user.PasswordHash != hashedInput)
            {
                return (false, "Invalid email or password.", null, null);
            }

            if (user.Status != "Active")
            {
                return (false, "User account is inactive.", null, null);
            }

            var token = GenerateJwtToken(user);

            // Log Audit event
            await LogAuditAsync(user.UserID.ToString(), "User Login", "Identity");

            return (true, "Login successful.", token, user);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _repository.GetAllUsersAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _repository.GetUserByIdAsync(id);
        }

        public async Task<List<AuditLog>> GetAuditLogsAsync()
        {
            var logs = await _repository.GetAllUsersAsync(); // Wait, let's look at get audit logs query in repository or context
            // Ah! The Repository needs to support getting all AuditLogs. Let's add that to IIdentityRepository!
            // Wait, we need to get audit logs ordered by timestamp descending. Let's write the query in the repository.
            // But for now, let's call the repository method GetAuditLogsAsync. Let's make sure it is in repository interface.
            return await _repository.GetAuditLogsAsync();
        }

        public async Task LogAuditAsync(string userId, string action, string module)
        {
            try
            {
                var auditLog = new AuditLog
                {
                    UserID = userId,
                    Action = action,
                    Module = module,
                    Timestamp = DateTime.UtcNow
                };
                await _repository.AddAuditLogAsync(auditLog);
                await _repository.SaveChangesAsync();
            }
            catch
            {
                // Ignore audit logging errors to prevent breaking main request flow
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var keyStr = _configuration["Jwt:Key"] ?? "SuperSecretWellBeing360SigningKey2026!";
            var key = Encoding.ASCII.GetBytes(keyStr);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                    new Claim("EmployeeID", user.EmployeeID),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("GradeID", user.GradeID),
                    new Claim("DepartmentID", user.DepartmentID)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"] ?? "WellBeing360",
                Audience = _configuration["Jwt:Audience"] ?? "WellBeing360Client",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
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

        public async Task<(bool Success, string Message)> UpdateUserStatusAsync(int id, string status)
        {
            var user = await _repository.GetUserByIdAsync(id);
            if (user == null)
            {
                return (false, "User not found.");
            }

            if (status != "Active" && status != "Inactive")
            {
                return (false, "Invalid status specified. Status must be Active or Inactive.");
            }

            var oldStatus = user.Status;
            user.Status = status;
            await _repository.SaveChangesAsync();

            // Log security audit log event
            await LogAuditAsync(user.UserID.ToString(), $"Updated user status from {oldStatus} to {status}", "Identity");

            return (true, $"User status updated to {status} successfully.");
        }
    }
}
