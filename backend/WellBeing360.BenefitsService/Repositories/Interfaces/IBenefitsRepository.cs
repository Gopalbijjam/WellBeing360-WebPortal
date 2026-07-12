using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.BenefitsService.Entities;

namespace WellBeing360.BenefitsService.Repositories.Interfaces
{
    public interface IBenefitsRepository
    {
        // Plans
        Task<List<BenefitPlan>> GetPlansAsync();
        Task<BenefitPlan?> GetPlanByIdAsync(int id);
        Task AddPlanAsync(BenefitPlan plan);
        Task UpdatePlanAsync(BenefitPlan plan);
        Task<bool> PlanExistsAsync(int id);

        // Buckets
        Task<List<FlexBenefitBucket>> GetBucketsAsync();
        Task AddBucketAsync(FlexBenefitBucket bucket);

        // Windows
        Task<List<EnrolmentWindow>> GetWindowsAsync();
        Task<EnrolmentWindow?> GetWindowByIdAsync(int id);
        Task AddWindowAsync(EnrolmentWindow window);

        // Enrolments
        Task<List<BenefitEnrolment>> GetEnrolmentsAsync();
        Task<List<BenefitEnrolment>> GetEnrolmentsByEmployeeIdAsync(string employeeId);
        Task<List<BenefitEnrolment>> GetActiveOrSubmittedEnrolmentsAsync();
        Task<BenefitEnrolment?> GetEnrolmentByIdAsync(int id);
        Task<BenefitEnrolment?> GetExistingEnrolmentAsync(string employeeId, int planId, int windowId);
        Task AddEnrolmentAsync(BenefitEnrolment enrolment);

        // Dependents
        Task<List<Dependent>> GetActiveDependentsByEmployeeIdAsync(string employeeId);
        Task<Dependent?> GetDependentByIdAsync(int id);
        Task AddDependentAsync(Dependent dependent);

        // Common
        Task SaveChangesAsync();
    }
}
