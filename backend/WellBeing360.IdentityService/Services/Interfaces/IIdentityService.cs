using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.IdentityService.Entities;
using WellBeing360.IdentityService.DTOs;

namespace WellBeing360.IdentityService.Services.Interfaces
{
    public interface IIdentityService
    {
        Task<(bool Success, string Message, string? EmployeeID)> RegisterAsync(RegisterRequest request);
        Task<(bool Success, string Message, string? Token, User? User)> LoginAsync(LoginRequest request);
        Task<List<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<List<AuditLog>> GetAuditLogsAsync();
        Task LogAuditAsync(string userId, string action, string module);
    }
}
