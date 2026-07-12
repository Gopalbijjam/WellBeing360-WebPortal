using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.RewardsService.Data;
using WellBeing360.RewardsService.Entities;
using WellBeing360.RewardsService.Repositories.Interfaces;

namespace WellBeing360.RewardsService.Repositories
{
    public class RewardsRepository : IRewardsRepository
    {
        private readonly RewardsDbContext _context;

        public RewardsRepository(RewardsDbContext context)
        {
            _context = context;
        }

        public async Task AddAwardAsync(RecognitionAward award)
        {
            await _context.RecognitionAwards.AddAsync(award);
        }

        public async Task<List<RecognitionAward>> GetAwardsAsync()
        {
            return await _context.RecognitionAwards
                .OrderByDescending(a => a.AwardDate)
                .ToListAsync();
        }

        public async Task<int> GetAwardCountAsync()
        {
            return await _context.RecognitionAwards.CountAsync();
        }

        public async Task<RewardPoints?> GetPointsByEmployeeIdAsync(string employeeId)
        {
            return await _context.RewardPoints.FirstOrDefaultAsync(p => p.EmployeeID == employeeId);
        }

        public async Task<List<RewardPoints>> GetAllPointsAsync()
        {
            return await _context.RewardPoints.ToListAsync();
        }

        public async Task AddPointsAsync(RewardPoints points)
        {
            await _context.RewardPoints.AddAsync(points);
        }

        public async Task<int> GetTotalRedeemedPointsAsync()
        {
            return await _context.RewardPoints.SumAsync(p => p.TotalRedeemed);
        }

        public async Task<List<RedemptionCatalog>> GetCatalogAsync()
        {
            return await _context.RedemptionCatalogs.ToListAsync();
        }

        public async Task<RedemptionCatalog?> GetCatalogItemByIdAsync(int id)
        {
            return await _context.RedemptionCatalogs.FindAsync(id);
        }

        public async Task AddCatalogItemAsync(RedemptionCatalog item)
        {
            await _context.RedemptionCatalogs.AddAsync(item);
        }

        public async Task<List<Notification>> GetNotificationsByEmployeeIdAsync(string employeeId)
        {
            return await _context.Notifications
                .Where(n => n.UserID == employeeId)
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();
        }

        public async Task<Notification?> GetNotificationByIdAsync(int id)
        {
            return await _context.Notifications.FindAsync(id);
        }

        public async Task AddNotificationAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }

        public async Task AddReportAsync(BenefitsReport report)
        {
            await _context.BenefitsReports.AddAsync(report);
        }

        public async Task<List<BenefitsReport>> GetReportsAsync()
        {
            return await _context.BenefitsReports
                .OrderByDescending(r => r.GeneratedDate)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
