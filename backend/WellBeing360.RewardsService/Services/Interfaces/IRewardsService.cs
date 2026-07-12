using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.RewardsService.Entities;
using WellBeing360.RewardsService.DTOs;

namespace WellBeing360.RewardsService.Services.Interfaces
{
    public interface IRewardsService
    {
        // Awards
        Task<(bool Success, string Message, RecognitionAward? Award)> NominatePeerAsync(string nominatorId, string nominatorName, SendAwardRequest request);
        Task<List<RecognitionAward>> GetAwardsAsync();

        // Points
        Task<RewardPoints> GetOrCreateMyPointsAsync(string employeeId);
        Task<List<RewardPoints>> GetAllPointsAsync();

        // Catalog
        Task<List<RedemptionCatalog>> GetCatalogAsync();
        Task<RedemptionCatalog> CreateCatalogItemAsync(RedemptionCatalog item);
        Task<(bool Success, string Message, int RemainingBalance)> RedeemItemAsync(string employeeId, RedeemRequest request);

        // Notifications
        Task<List<Notification>> GetMyNotificationsAsync(string employeeId);
        Task<(bool Success, string Message, Notification? Notification)> MarkNotificationAsReadAsync(int id, string employeeId, string userRole);

        // Internal Points (Wellness Service integration)
        Task<bool> InternalAddPointsAsync(InternalAddPointsRequest request);

        // Reports
        Task<(bool Success, string Message, object? ReportDetails)> GenerateReportAsync(string scope, string authorizationToken);
        Task<IEnumerable<object>> GetReportsHistoryAsync();
    }
}
