using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.WellnessService.Entities;
using WellBeing360.WellnessService.DTOs;

namespace WellBeing360.WellnessService.Repositories.Interfaces
{
    public interface IWellnessRepository
    {
        // Programs
        Task<List<WellnessProgram>> GetProgramsAsync();
        Task AddProgramAsync(WellnessProgram program);

        // Challenges
        Task<List<WellnessChallenge>> GetChallengesAsync();
        Task<WellnessChallenge?> GetChallengeByIdAsync(int id);
        Task AddChallengeAsync(WellnessChallenge challenge);

        // Activity Logs
        Task AddActivityLogAsync(ActivityLog log);
        Task<List<ActivityLog>> GetLogsByEmployeeIdAsync(string employeeId);
        Task<List<ActivityLog>> GetPendingLogsAsync();
        Task<ActivityLog?> GetActivityLogByIdAsync(int id);
        Task<List<LeaderboardEntry>> GetLeaderboardAsync();

        // EAP Services
        Task<List<EAPService>> GetActiveEapServicesAsync();
        Task<EAPService?> GetEapServiceByIdAsync(int id);
        Task AddEapServiceAsync(EAPService service);

        // EAP Sessions
        Task<int> GetEapSessionCountInYearAsync(string employeeId, int serviceId, int year);
        Task AddEapSessionAsync(EAPSession session);
        Task<List<EAPSession>> GetSessionsByEmployeeIdAsync(string employeeId);
        Task<List<EAPSession>> GetAllEapSessionsAsync();
        Task<EAPSession?> GetEapSessionByIdAsync(int id);

        // Stats
        Task<int> GetWellnessParticipationCountAsync();
        Task<int> GetEapUtilisationCountAsync();

        // Common
        Task SaveChangesAsync();
    }
}
