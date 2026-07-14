using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.IdentityService.Entities;

namespace WellBeing360.IdentityService.Repositories.Interfaces
{
    public interface IIdentityRepository
    {
        Task<List<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByEmployeeIdAsync(string employeeId);
        Task<bool> UserExistsByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task AddAuditLogAsync(AuditLog log);
        Task<List<AuditLog>> GetAuditLogsAsync();
        Task SaveChangesAsync();
    }
}
