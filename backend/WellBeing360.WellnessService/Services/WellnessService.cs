using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using WellBeing360.WellnessService.DTOs;
using WellBeing360.WellnessService.Entities;
using WellBeing360.WellnessService.Repositories.Interfaces;
using WellBeing360.WellnessService.Services.Interfaces;

namespace WellBeing360.WellnessService.Services
{
    public class WellnessService : IWellnessService
    {
        private readonly IWellnessRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public WellnessService(IWellnessRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        public async Task<List<WellnessProgram>> GetProgramsAsync()
        {
            return await _repository.GetProgramsAsync();
        }

        public async Task<WellnessProgram> CreateProgramAsync(WellnessProgram program)
        {
            await _repository.AddProgramAsync(program);
            await _repository.SaveChangesAsync();
            return program;
        }

        public async Task<List<WellnessChallenge>> GetChallengesAsync()
        {
            return await _repository.GetChallengesAsync();
        }

        public async Task<WellnessChallenge> CreateChallengeAsync(WellnessChallenge challenge)
        {
            await _repository.AddChallengeAsync(challenge);
            await _repository.SaveChangesAsync();
            return challenge;
        }

        public async Task<(bool Success, string Message, ActivityLog? Log)> SubmitActivityLogAsync(string employeeId, ActivityLogRequest request)
        {
            var challenge = await _repository.GetChallengeByIdAsync(request.ChallengeID);
            if (challenge == null)
            {
                return (false, "Wellness challenge not found.", null);
            }

            var log = new ActivityLog
            {
                ChallengeID = request.ChallengeID,
                EmployeeID = employeeId,
                LogDate = DateTime.UtcNow.Date,
                ActivityValue = request.ActivityValue,
                PointsEarned = (request.ActivityValue >= challenge.DailyTarget) ? challenge.PointsPerCompletion : 0,
                Status = "Submitted"
            };

            await _repository.AddActivityLogAsync(log);
            await _repository.SaveChangesAsync();

            return (true, "Activity log submitted.", log);
        }

        public async Task<List<ActivityLog>> GetMyLogsAsync(string employeeId)
        {
            return await _repository.GetLogsByEmployeeIdAsync(employeeId);
        }

        public async Task<List<ActivityLog>> GetPendingLogsAsync()
        {
            return await _repository.GetPendingLogsAsync();
        }

        public async Task<(bool Success, string Message, ActivityLog? Log)> VerifyActivityLogAsync(int id, bool approve)
        {
            var log = await _repository.GetActivityLogByIdAsync(id);
            if (log == null)
            {
                return (false, "Activity log not found.", null);
            }

            if (log.Status == "Verified")
            {
                return (false, "Activity log is already verified.", null);
            }

            if (approve)
            {
                log.Status = "Verified";

                var challenge = await _repository.GetChallengeByIdAsync(log.ChallengeID);
                if (challenge != null)
                {
                    log.PointsEarned = (log.ActivityValue >= challenge.DailyTarget) ? challenge.PointsPerCompletion : 0;
                }

                await _repository.SaveChangesAsync();

                if (log.PointsEarned > 0)
                {
                    await AddRewardPointsAsync(log.EmployeeID, log.PointsEarned, $"Completed Challenge: {challenge?.ChallengeName ?? "Wellness Challenge"}");
                }
            }
            else
            {
                log.Status = "Rejected";
                log.PointsEarned = 0;
                await _repository.SaveChangesAsync();
            }

            return (true, "Activity log verification completed.", log);
        }

        public async Task<List<LeaderboardEntry>> GetLeaderboardAsync()
        {
            return await _repository.GetLeaderboardAsync();
        }

        public async Task<List<EAPService>> GetActiveEapServicesAsync()
        {
            return await _repository.GetActiveEapServicesAsync();
        }

        public async Task<EAPService> CreateEapServiceAsync(EAPService service)
        {
            await _repository.AddEapServiceAsync(service);
            await _repository.SaveChangesAsync();
            return service;
        }

        public async Task<(bool Success, string Message, EAPSession? Session)> BookEapSessionAsync(string employeeId, BookSessionRequest request)
        {
            var service = await _repository.GetEapServiceByIdAsync(request.ServiceID);
            if (service == null)
            {
                return (false, "EAP service not found.", null);
            }

            if (service.Status != "Active")
            {
                return (false, "EAP service is currently inactive.", null);
            }

            var currentYear = DateTime.UtcNow.Year;
            var sessionCount = await _repository.GetEapSessionCountInYearAsync(employeeId, request.ServiceID, currentYear);

            if (sessionCount >= service.SessionsAllowedPerEmployee)
            {
                return (false, $"You have exceeded the maximum of {service.SessionsAllowedPerEmployee} allowed sessions for this service in the current year.", null);
            }

            var session = new EAPSession
            {
                EmployeeID = employeeId,
                ServiceID = request.ServiceID,
                SessionDate = request.SessionDate,
                RequestedDate = DateTime.UtcNow,
                CounsellorRef = "Unassigned",
                Status = "Requested"
            };

            await _repository.AddEapSessionAsync(session);
            await _repository.SaveChangesAsync();

            return (true, "EAP Session booked successfully.", session);
        }

        public async Task<List<EAPSession>> GetMyEapSessionsAsync(string employeeId)
        {
            return await _repository.GetSessionsByEmployeeIdAsync(employeeId);
        }

        public async Task<List<EAPSession>> GetAllEapSessionsAsync()
        {
            return await _repository.GetAllEapSessionsAsync();
        }

        public async Task<(bool Success, string Message, EAPSession? Session)> UpdateEapSessionStatusAsync(int id, string status, string counsellorRef)
        {
            var session = await _repository.GetEapSessionByIdAsync(id);
            if (session == null)
            {
                return (false, "EAP Session not found.", null);
            }

            session.Status = status;
            if (!string.IsNullOrEmpty(counsellorRef))
            {
                session.CounsellorRef = counsellorRef;
            }

            await _repository.SaveChangesAsync();
            return (true, "EAP Session status updated.", session);
        }

        public async Task<object> GetInternalStatsAsync()
        {
            var participationCount = await _repository.GetWellnessParticipationCountAsync();
            var eapCount = await _repository.GetEapUtilisationCountAsync();

            return new
            {
                WellnessParticipation = participationCount,
                EAPUtilisation = eapCount
            };
        }

        private async Task AddRewardPointsAsync(string employeeId, int points, string reason)
        {
            try
            {
                var rewardsUrl = _configuration["Services:RewardsUrl"] ?? "http://localhost:5008";
                var payload = new { EmployeeID = employeeId, Points = points, Reason = reason };

                var response = await _httpClient.PostAsJsonAsync($"{rewardsUrl}/api/rewards/internal/add-points", payload);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calling RewardsService: {ex.Message}");
            }
        }
    }
}
