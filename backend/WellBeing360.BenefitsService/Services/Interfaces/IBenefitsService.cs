using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.BenefitsService.Entities;
using WellBeing360.BenefitsService.DTOs;

namespace WellBeing360.BenefitsService.Services.Interfaces
{
    public interface IBenefitsService
    {
        // Plans
        Task<List<BenefitPlan>> GetPlansAsync();
        Task<BenefitPlan?> GetPlanByIdAsync(int id);
        Task<BenefitPlan> CreatePlanAsync(BenefitPlan plan);
        Task UpdatePlanAsync(BenefitPlan plan);
        Task<bool> PlanExistsAsync(int id);

        // Buckets
        Task<List<FlexBenefitBucket>> GetBucketsAsync();
        Task<FlexBenefitBucket> CreateBucketAsync(FlexBenefitBucket bucket);

        // Windows
        Task<List<EnrolmentWindow>> GetWindowsAsync();
        Task<EnrolmentWindow> CreateWindowAsync(EnrolmentWindow window);

        // Enrolments
        Task<List<BenefitEnrolment>> GetEnrolmentsAsync();
        Task<List<BenefitEnrolment>> GetMyEnrolmentsAsync(string employeeId);
        Task<(bool Success, string Message, BenefitEnrolment? Enrolment)> EnrolAsync(string employeeId, string gradeId, EnrolmentRequest request);
        Task<BenefitEnrolment?> VerifyEnrolmentAsync(int id, string status);

        // Dependents
        Task<List<Dependent>> GetMyDependentsAsync(string employeeId);
        Task<Dependent> AddDependentAsync(string employeeId, DependentRequest request);
        Task<(bool Success, string Message)> RemoveDependentAsync(int id, string employeeId, string userRole);

        // Stats
        Task<object> GetInternalStatsAsync();
    }
}
