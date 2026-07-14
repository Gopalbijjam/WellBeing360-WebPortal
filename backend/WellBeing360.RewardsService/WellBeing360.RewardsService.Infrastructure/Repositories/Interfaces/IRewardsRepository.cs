using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.RewardsService.Entities;

namespace WellBeing360.RewardsService.Repositories.Interfaces
{
    public interface IRewardsRepository
    {
        // Awards
        Task AddAwardAsync(RecognitionAward award);
        Task<List<RecognitionAward>> GetAwardsAsync();
        Task<int> GetAwardCountAsync();

        // Points
        Task<RewardPoints?> GetPointsByEmployeeIdAsync(string employeeId);
        Task<List<RewardPoints>> GetAllPointsAsync();
        Task AddPointsAsync(RewardPoints points);
        Task<int> GetTotalRedeemedPointsAsync();

        // Catalog
        Task<List<RedemptionCatalog>> GetCatalogAsync();
        Task<RedemptionCatalog?> GetCatalogItemByIdAsync(int id);
        Task AddCatalogItemAsync(RedemptionCatalog item);

        // Notifications
        Task<List<Notification>> GetNotificationsByEmployeeIdAsync(string employeeId);
        Task<Notification?> GetNotificationByIdAsync(int id);
        Task AddNotificationAsync(Notification notification);

        // Reports
        Task AddReportAsync(BenefitsReport report);
        Task<List<BenefitsReport>> GetReportsAsync();

        // Common
        Task SaveChangesAsync();
    }
}
