using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.WellnessService.Entities;
using WellBeing360.WellnessService.DTOs;

namespace WellBeing360.WellnessService.Services.Interfaces
{
    public interface IWellnessService
    {
        // Programs
        Task<List<WellnessProgram>> GetProgramsAsync();
        Task<WellnessProgram> CreateProgramAsync(WellnessProgram program);

        // Challenges
        Task<List<WellnessChallenge>> GetChallengesAsync();
        Task<WellnessChallenge> CreateChallengeAsync(WellnessChallenge challenge);

        // Activity Logs
        Task<(bool Success, string Message, ActivityLog? Log)> SubmitActivityLogAsync(string employeeId, ActivityLogRequest request);
        Task<List<ActivityLog>> GetMyLogsAsync(string employeeId);
        Task<List<ActivityLog>> GetPendingLogsAsync();
        Task<(bool Success, string Message, ActivityLog? Log)> VerifyActivityLogAsync(int id, bool approve);
        Task<List<LeaderboardEntry>> GetLeaderboardAsync();

        // EAP Services
        Task<List<EAPService>> GetActiveEapServicesAsync();
        Task<EAPService> CreateEapServiceAsync(EAPService service);

        // EAP Sessions
        Task<(bool Success, string Message, EAPSession? Session)> BookEapSessionAsync(string employeeId, BookSessionRequest request);
        Task<List<EAPSession>> GetMyEapSessionsAsync(string employeeId);
        Task<List<EAPSession>> GetAllEapSessionsAsync();
        Task<(bool Success, string Message, EAPSession? Session)> UpdateEapSessionStatusAsync(int id, string status, string counsellorRef);

        // Stats
        Task<object> GetInternalStatsAsync();
    }
}
