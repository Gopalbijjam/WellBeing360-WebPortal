using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.WellnessService.Data;
using WellBeing360.WellnessService.DTOs;
using WellBeing360.WellnessService.Entities;
using WellBeing360.WellnessService.Repositories.Interfaces;

namespace WellBeing360.WellnessService.Repositories
{
    public class WellnessRepository : IWellnessRepository
    {
        private readonly WellnessDbContext _context;

        public WellnessRepository(WellnessDbContext context)
        {
            _context = context;
        }

        public async Task<List<WellnessProgram>> GetProgramsAsync()
        {
            return await _context.WellnessPrograms.ToListAsync();
        }

        public async Task AddProgramAsync(WellnessProgram program)
        {
            await _context.WellnessPrograms.AddAsync(program);
        }

        public async Task<List<WellnessChallenge>> GetChallengesAsync()
        {
            return await _context.WellnessChallenges.ToListAsync();
        }

        public async Task<WellnessChallenge?> GetChallengeByIdAsync(int id)
        {
            return await _context.WellnessChallenges.FindAsync(id);
        }

        public async Task AddChallengeAsync(WellnessChallenge challenge)
        {
            await _context.WellnessChallenges.AddAsync(challenge);
        }

        public async Task AddActivityLogAsync(ActivityLog log)
        {
            await _context.ActivityLogs.AddAsync(log);
        }

        public async Task<List<ActivityLog>> GetLogsByEmployeeIdAsync(string employeeId)
        {
            return await _context.ActivityLogs
                .Where(l => l.EmployeeID == employeeId)
                .ToListAsync();
        }

        public async Task<List<ActivityLog>> GetPendingLogsAsync()
        {
            return await _context.ActivityLogs
                .Where(l => l.Status == "Submitted")
                .ToListAsync();
        }

        public async Task<ActivityLog?> GetActivityLogByIdAsync(int id)
        {
            return await _context.ActivityLogs.FindAsync(id);
        }

        public async Task<List<LeaderboardEntry>> GetLeaderboardAsync()
        {
            return await _context.ActivityLogs
                .Where(l => l.Status == "Verified")
                .GroupBy(l => l.EmployeeID)
                .Select(g => new LeaderboardEntry
                {
                    EmployeeID = g.Key,
                    TotalPoints = g.Sum(l => l.PointsEarned),
                    ActivitiesCompleted = g.Count()
                })
                .OrderByDescending(x => x.TotalPoints)
                .ToListAsync();
        }

        public async Task<List<EAPService>> GetActiveEapServicesAsync()
        {
            return await _context.EAPServices
                .Where(s => s.Status == "Active")
                .ToListAsync();
        }

        public async Task<EAPService?> GetEapServiceByIdAsync(int id)
        {
            return await _context.EAPServices.FindAsync(id);
        }

        public async Task AddEapServiceAsync(EAPService service)
        {
            await _context.EAPServices.AddAsync(service);
        }

        public async Task<int> GetEapSessionCountInYearAsync(string employeeId, int serviceId, int year)
        {
            return await _context.EAPSessions
                .CountAsync(s => s.EmployeeID == employeeId && s.ServiceID == serviceId && s.SessionDate.Year == year && s.Status != "Cancelled");
        }

        public async Task AddEapSessionAsync(EAPSession session)
        {
            await _context.EAPSessions.AddAsync(session);
        }

        public async Task<List<EAPSession>> GetSessionsByEmployeeIdAsync(string employeeId)
        {
            return await _context.EAPSessions
                .Where(s => s.EmployeeID == employeeId)
                .ToListAsync();
        }

        public async Task<List<EAPSession>> GetAllEapSessionsAsync()
        {
            return await _context.EAPSessions.ToListAsync();
        }

        public async Task<EAPSession?> GetEapSessionByIdAsync(int id)
        {
            return await _context.EAPSessions.FindAsync(id);
        }

        public async Task<int> GetWellnessParticipationCountAsync()
        {
            return await _context.ActivityLogs
                .Where(l => l.Status == "Verified")
                .Select(l => l.EmployeeID)
                .Distinct()
                .CountAsync();
        }

        public async Task<int> GetEapUtilisationCountAsync()
        {
            return await _context.EAPSessions
                .Where(s => s.Status == "Completed" || s.Status == "Scheduled")
                .CountAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
