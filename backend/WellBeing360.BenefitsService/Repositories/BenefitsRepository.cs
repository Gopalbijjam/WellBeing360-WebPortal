using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.BenefitsService.Data;
using WellBeing360.BenefitsService.Entities;
using WellBeing360.BenefitsService.Repositories.Interfaces;

namespace WellBeing360.BenefitsService.Repositories
{
    public class BenefitsRepository : IBenefitsRepository
    {
        private readonly BenefitsDbContext _context;

        public BenefitsRepository(BenefitsDbContext context)
        {
            _context = context;
        }

        public async Task<List<BenefitPlan>> GetPlansAsync()
        {
            return await _context.BenefitPlans.ToListAsync();
        }

        public async Task<BenefitPlan?> GetPlanByIdAsync(int id)
        {
            return await _context.BenefitPlans.FindAsync(id);
        }

        public async Task AddPlanAsync(BenefitPlan plan)
        {
            await _context.BenefitPlans.AddAsync(plan);
        }

        public async Task UpdatePlanAsync(BenefitPlan plan)
        {
            _context.Entry(plan).State = EntityState.Modified;
            await Task.CompletedTask;
        }

        public async Task<bool> PlanExistsAsync(int id)
        {
            return await _context.BenefitPlans.AnyAsync(p => p.PlanID == id);
        }

        public async Task<List<FlexBenefitBucket>> GetBucketsAsync()
        {
            return await _context.FlexBenefitBuckets.ToListAsync();
        }

        public async Task AddBucketAsync(FlexBenefitBucket bucket)
        {
            await _context.FlexBenefitBuckets.AddAsync(bucket);
        }

        public async Task<List<EnrolmentWindow>> GetWindowsAsync()
        {
            return await _context.EnrolmentWindows.ToListAsync();
        }

        public async Task<EnrolmentWindow?> GetWindowByIdAsync(int id)
        {
            return await _context.EnrolmentWindows.FindAsync(id);
        }

        public async Task AddWindowAsync(EnrolmentWindow window)
        {
            await _context.EnrolmentWindows.AddAsync(window);
        }

        public async Task<List<BenefitEnrolment>> GetEnrolmentsAsync()
        {
            return await _context.BenefitEnrolments.ToListAsync();
        }

        public async Task<List<BenefitEnrolment>> GetEnrolmentsByEmployeeIdAsync(string employeeId)
        {
            return await _context.BenefitEnrolments
                .Where(e => e.EmployeeID == employeeId)
                .ToListAsync();
        }

        public async Task<List<BenefitEnrolment>> GetActiveOrSubmittedEnrolmentsAsync()
        {
            return await _context.BenefitEnrolments
                .Where(e => e.Status == "Active" || e.Status == "Submitted")
                .ToListAsync();
        }

        public async Task<BenefitEnrolment?> GetEnrolmentByIdAsync(int id)
        {
            return await _context.BenefitEnrolments.FindAsync(id);
        }

        public async Task<BenefitEnrolment?> GetExistingEnrolmentAsync(string employeeId, int planId, int windowId)
        {
            return await _context.BenefitEnrolments.FirstOrDefaultAsync(e =>
                e.EmployeeID == employeeId && e.PlanID == planId && e.WindowID == windowId);
        }

        public async Task AddEnrolmentAsync(BenefitEnrolment enrolment)
        {
            await _context.BenefitEnrolments.AddAsync(enrolment);
        }

        public async Task<List<Dependent>> GetActiveDependentsByEmployeeIdAsync(string employeeId)
        {
            return await _context.Dependents
                .Where(d => d.EmployeeID == employeeId && d.Status == "Active")
                .ToListAsync();
        }

        public async Task<Dependent?> GetDependentByIdAsync(int id)
        {
            return await _context.Dependents.FindAsync(id);
        }

        public async Task AddDependentAsync(Dependent dependent)
        {
            await _context.Dependents.AddAsync(dependent);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
