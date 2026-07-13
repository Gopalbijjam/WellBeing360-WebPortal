using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using WellBeing360.RewardsService.DTOs;
using WellBeing360.RewardsService.Entities;
using WellBeing360.RewardsService.Repositories.Interfaces;
using WellBeing360.RewardsService.Services.Interfaces;

namespace WellBeing360.RewardsService.Services
{
    public class RewardsService : IRewardsService
    {
        private readonly IRewardsRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public RewardsService(IRewardsRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        // --- Peer Recognition & Awards ---

        public async Task<(bool Success, string Message, RecognitionAward? Award)> NominatePeerAsync(string nominatorId, string nominatorName, SendAwardRequest request)
        {
            if (nominatorId == request.RecipientID)
            {
                return (false, "You cannot nominate yourself.", null);
            }

            int points = request.Category switch
            {
                "PeerRecognition" => 50,
                "ManagerNomination" => 150,
                "MilestoneAward" => 200,
                "InnovationAward" => 250,
                _ => 50
            };

            var nominatorPoints = await GetOrCreateMyPointsAsync(nominatorId);
            if (nominatorPoints.Balance < points)
            {
                return (false, $"Insufficient points. You need {points} points to send this nomination, but only have {nominatorPoints.Balance} points.", null);
            }

            // Deduct points from nominator (donor)
            nominatorPoints.Balance -= points;
            nominatorPoints.LastUpdated = DateTime.UtcNow;

            var award = new RecognitionAward
            {
                NominatorID = nominatorId,
                RecipientID = request.RecipientID,
                Category = request.Category,
                BadgeName = request.BadgeName,
                PointsAwarded = points,
                Message = request.Message,
                AwardDate = DateTime.UtcNow,
                Status = "Awarded"
            };

            await _repository.AddAwardAsync(award);
            
            // Add points to recipient
            await AddPointsToEmployeeAsync(request.RecipientID, points);

            // Notify recipient
            var notification = new Notification
            {
                UserID = request.RecipientID,
                Message = $"Congratulations! You received a '{request.BadgeName}' badge from {nominatorName} (+{points} points).",
                Category = "Recognition",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _repository.AddNotificationAsync(notification);

            // Notify nominator (donor)
            var nominatorNotification = new Notification
            {
                UserID = nominatorId,
                Message = $"You sent a '{request.BadgeName}' badge to employee {request.RecipientID} (-{points} points).",
                Category = "Recognition",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _repository.AddNotificationAsync(nominatorNotification);

            await _repository.SaveChangesAsync();

            return (true, "Nomination successful.", award);
        }

        public async Task<List<RecognitionAward>> GetAwardsAsync()
        {
            return await _repository.GetAwardsAsync();
        }

        // --- Reward Points ---

        public async Task<RewardPoints> GetOrCreateMyPointsAsync(string employeeId)
        {
            var points = await _repository.GetPointsByEmployeeIdAsync(employeeId);
            if (points == null)
            {
                points = new RewardPoints
                {
                    EmployeeID = employeeId,
                    TotalEarned = 0,
                    TotalRedeemed = 0,
                    Balance = 0,
                    LastUpdated = DateTime.UtcNow
                };
                await _repository.AddPointsAsync(points);
                await _repository.SaveChangesAsync();
            }
            return points;
        }

        public async Task<List<RewardPoints>> GetAllPointsAsync()
        {
            return await _repository.GetAllPointsAsync();
        }

        // --- Redemption Catalog ---

        public async Task<List<RedemptionCatalog>> GetCatalogAsync()
        {
            return await _repository.GetCatalogAsync();
        }

        public async Task<RedemptionCatalog> CreateCatalogItemAsync(RedemptionCatalog item)
        {
            item.Status = "PendingApproval";
            await _repository.AddCatalogItemAsync(item);
            await _repository.SaveChangesAsync();
            return item;
        }

        public async Task<RedemptionCatalog?> GetCatalogItemByIdAsync(int id)
        {
            return await _repository.GetCatalogItemByIdAsync(id);
        }

        public async Task UpdateCatalogItemAsync(RedemptionCatalog item)
        {
            await _repository.SaveChangesAsync();
        }

        public async Task<(bool Success, string Message, int RemainingBalance)> RedeemItemAsync(string employeeId, RedeemRequest request)
        {
            var item = await _repository.GetCatalogItemByIdAsync(request.ItemID);
            if (item == null)
            {
                return (false, "Catalog item not found.", 0);
            }

            if (item.Status != "Available" || item.AvailableQuantity <= 0)
            {
                return (false, "Item is out of stock or unavailable.", 0);
            }

            var points = await GetOrCreateMyPointsAsync(employeeId);
            if (points.Balance < item.PointsRequired)
            {
                return (false, "Insufficient reward points balance.", points.Balance);
            }

            // Deduct points
            points.Balance -= item.PointsRequired;
            points.TotalRedeemed += item.PointsRequired;
            points.LastUpdated = DateTime.UtcNow;

            // Decrement item quantity
            item.AvailableQuantity -= 1;
            if (item.AvailableQuantity <= 0)
            {
                item.Status = "OutOfStock";
            }

            // Create notification
            var notification = new Notification
            {
                UserID = employeeId,
                Message = $"Successfully redeemed: '{item.ItemName}' (-{item.PointsRequired} points). Your remaining balance is {points.Balance} points.",
                Category = "Benefits",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _repository.AddNotificationAsync(notification);

            await _repository.SaveChangesAsync();

            return (true, "Item redeemed successfully.", points.Balance);
        }

        // --- Notifications ---

        public async Task<List<Notification>> GetMyNotificationsAsync(string employeeId)
        {
            return await _repository.GetNotificationsByEmployeeIdAsync(employeeId);
        }

        public async Task<(bool Success, string Message, Notification? Notification)> MarkNotificationAsReadAsync(int id, string employeeId, string userRole)
        {
            var notification = await _repository.GetNotificationByIdAsync(id);
            if (notification == null)
            {
                return (false, "Notification not found.", null);
            }

            if (notification.UserID != employeeId && userRole != "Admin")
            {
                return (false, "You do not have access to this notification.", null);
            }

            notification.Status = "Read";
            await _repository.SaveChangesAsync();

            return (true, "Notification marked as read.", notification);
        }

        // --- Internal Points (Wellness Service integration) ---

        public async Task<bool> InternalAddPointsAsync(InternalAddPointsRequest request)
        {
            await AddPointsToEmployeeAsync(request.EmployeeID, request.Points);

            var notification = new Notification
            {
                UserID = request.EmployeeID,
                Message = $"Points credited: {request.Reason} (+{request.Points} points).",
                Category = "Wellness",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _repository.AddNotificationAsync(notification);

            await _repository.SaveChangesAsync();
            return true;
        }

        // --- Reports Generation ---

        public async Task<(bool Success, string Message, object? ReportDetails)> GenerateReportAsync(string scope, string authorizationToken)
        {
            var identityUrl = _configuration["Services:IdentityUrl"] ?? "http://localhost:5001";
            var benefitsUrl = _configuration["Services:BenefitsUrl"] ?? "http://localhost:5002";
            var wellnessUrl = _configuration["Services:WellnessUrl"] ?? "http://localhost:5003";

            // 1. Get Total Users from Identity Service to calculate EnrolmentRate
            int totalEmployees = 1;
            try
            {
                var req = new HttpRequestMessage(HttpMethod.Get, $"{identityUrl}/api/auth/users");
                if (!string.IsNullOrEmpty(authorizationToken))
                {
                    req.Headers.Add("Authorization", authorizationToken);
                }
                var res = await _httpClient.SendAsync(req);
                if (res.IsSuccessStatusCode)
                {
                    var usersList = await res.Content.ReadFromJsonAsync<List<object>>();
                    if (usersList != null && usersList.Any())
                    {
                        totalEmployees = usersList.Count;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching user count from IdentityService: {ex.Message}");
            }

            // 2. Get Benefits stats (EnrolmentCount, TotalPremiumCost)
            int enrolledCount = 0;
            decimal premiumCost = 0;
            try
            {
                var res = await _httpClient.GetFromJsonAsync<BenefitsStatsDto>($"{benefitsUrl}/api/benefits/internal/stats");
                if (res != null)
                {
                    enrolledCount = res.EnrolmentCount;
                    premiumCost = res.TotalPremiumCost;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching stats from BenefitsService: {ex.Message}");
            }

            double enrolmentRate = (double)enrolledCount / totalEmployees * 100;

            // 3. Get Wellness stats (WellnessParticipation, EAPUtilisation)
            int wellnessParticipation = 0;
            int eapUtilisation = 0;
            try
            {
                var res = await _httpClient.GetFromJsonAsync<WellnessStatsDto>($"{wellnessUrl}/api/wellness/internal/stats");
                if (res != null)
                {
                    wellnessParticipation = res.WellnessParticipation;
                    eapUtilisation = res.EAPUtilisation;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching stats from WellnessService: {ex.Message}");
            }

            // 4. Query Rewards Service local database
            int recognitionCount = await _repository.GetAwardCountAsync();
            int pointsRedeemed = await _repository.GetTotalRedeemedPointsAsync();

            var metrics = new
            {
                EnrolmentRate = Math.Round(enrolmentRate, 2),
                PremiumCost = premiumCost,
                ClaimsSubmitted = enrolledCount * 1.5, // Mock claims ratio
                WellnessParticipation = wellnessParticipation,
                EAPUtilisation = eapUtilisation,
                RecognitionCount = recognitionCount,
                PointsRedeemed = pointsRedeemed
            };

            var report = new BenefitsReport
            {
                Scope = scope,
                Metrics = JsonSerializer.Serialize(metrics),
                GeneratedDate = DateTime.UtcNow
            };

            await _repository.AddReportAsync(report);
            await _repository.SaveChangesAsync();

            return (true, "Report generated successfully.", new
            {
                report.ReportID,
                report.Scope,
                report.GeneratedDate,
                Metrics = metrics
            });
        }

        public async Task<IEnumerable<object>> GetReportsHistoryAsync()
        {
            var reports = await _repository.GetReportsAsync();
            return reports.Select(r => new
            {
                r.ReportID,
                r.Scope,
                r.GeneratedDate,
                Metrics = JsonSerializer.Deserialize<object>(r.Metrics)
            });
        }

        // --- Helper Methods ---

        private async Task AddPointsToEmployeeAsync(string employeeId, int points)
        {
            var pointsRecord = await _repository.GetPointsByEmployeeIdAsync(employeeId);
            if (pointsRecord == null)
            {
                pointsRecord = new RewardPoints
                {
                    EmployeeID = employeeId,
                    TotalEarned = points,
                    TotalRedeemed = 0,
                    Balance = points,
                    LastUpdated = DateTime.UtcNow
                };
                await _repository.AddPointsAsync(pointsRecord);
            }
            else
            {
                pointsRecord.TotalEarned += points;
                pointsRecord.Balance += points;
                pointsRecord.LastUpdated = DateTime.UtcNow;
            }
        }
    }
}
