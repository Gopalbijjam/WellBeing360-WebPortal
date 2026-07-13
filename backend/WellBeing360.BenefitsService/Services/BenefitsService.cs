using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.BenefitsService.DTOs;
using WellBeing360.BenefitsService.Entities;
using WellBeing360.BenefitsService.Repositories.Interfaces;
using WellBeing360.BenefitsService.Services.Interfaces;

namespace WellBeing360.BenefitsService.Services
{
    public class BenefitsService : IBenefitsService
    {
        private readonly IBenefitsRepository _repository;

        public BenefitsService(IBenefitsRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<BenefitPlan>> GetPlansAsync()
        {
            return await _repository.GetPlansAsync();
        }

        public async Task<BenefitPlan?> GetPlanByIdAsync(int id)
        {
            return await _repository.GetPlanByIdAsync(id);
        }

        public async Task<BenefitPlan> CreatePlanAsync(BenefitPlan plan)
        {
            plan.Status = "PendingApproval";
            await _repository.AddPlanAsync(plan);
            await _repository.SaveChangesAsync();
            return plan;
        }

        public async Task UpdatePlanAsync(BenefitPlan plan)
        {
            await _repository.UpdatePlanAsync(plan);
            await _repository.SaveChangesAsync();
        }

        public async Task<bool> PlanExistsAsync(int id)
        {
            return await _repository.PlanExistsAsync(id);
        }

        public async Task<List<FlexBenefitBucket>> GetBucketsAsync()
        {
            return await _repository.GetBucketsAsync();
        }

        public async Task<FlexBenefitBucket> CreateBucketAsync(FlexBenefitBucket bucket)
        {
            await _repository.AddBucketAsync(bucket);
            await _repository.SaveChangesAsync();
            return bucket;
        }

        public async Task<List<EnrolmentWindow>> GetWindowsAsync()
        {
            return await _repository.GetWindowsAsync();
        }

        public async Task<EnrolmentWindow> CreateWindowAsync(EnrolmentWindow window)
        {
            await _repository.AddWindowAsync(window);
            await _repository.SaveChangesAsync();
            return window;
        }

        public async Task<List<BenefitEnrolment>> GetEnrolmentsAsync()
        {
            return await _repository.GetEnrolmentsAsync();
        }

        public async Task<List<BenefitEnrolment>> GetMyEnrolmentsAsync(string employeeId)
        {
            return await _repository.GetEnrolmentsByEmployeeIdAsync(employeeId);
        }

        public async Task<(bool Success, string Message, BenefitEnrolment? Enrolment)> EnrolAsync(string employeeId, string gradeId, EnrolmentRequest request)
        {
            // Verify window exists and is open
            var window = await _repository.GetWindowByIdAsync(request.WindowID);
            if (window == null)
            {
                return (false, "Enrolment window not found.", null);
            }

            if (window.Status != "Open" || DateTime.UtcNow < window.OpenDate || DateTime.UtcNow > window.CloseDate)
            {
                return (false, "Enrolment window is closed.", null);
            }

            // Verify plan exists
            var plan = await _repository.GetPlanByIdAsync(request.PlanID);
            if (plan == null)
            {
                return (false, "Benefit plan not found.", null);
            }

            // Verify grade eligibility
            var eligibleGrades = plan.EligibilityGrade.Split(',').Select(g => g.Trim());
            if (!eligibleGrades.Contains(gradeId))
            {
                return (false, $"Your employee grade ({gradeId}) is not eligible for this benefit plan.", null);
            }

            // Check if already enrolled in this plan in this window
            var existing = await _repository.GetExistingEnrolmentAsync(employeeId, request.PlanID, request.WindowID);
            if (existing != null)
            {
                return (false, "You have already submitted an enrolment for this plan in this window.", null);
            }

            // Create the enrolment
            var enrolment = new BenefitEnrolment
            {
                EmployeeID = employeeId,
                PlanID = request.PlanID,
                WindowID = request.WindowID,
                CoverageOption = request.CoverageOption,
                DependentsIncluded = request.DependentsIncluded,
                EmployeeContributionAmount = plan.EmployeeContribution,
                EffectiveDate = plan.EffectiveDate,
                Status = "Submitted"
            };

            await _repository.AddEnrolmentAsync(enrolment);
            await _repository.SaveChangesAsync();

            // Process Dependents
            if (request.DependentsIncluded && request.Dependents.Any())
            {
                foreach (var depReq in request.Dependents)
                {
                    var dependent = new Dependent
                    {
                        EmployeeID = employeeId,
                        Name = depReq.Name,
                        Relationship = depReq.Relationship,
                        DateOfBirth = depReq.DateOfBirth,
                        Status = "Active"
                    };
                    await _repository.AddDependentAsync(dependent);
                }
                await _repository.SaveChangesAsync();
            }

            return (true, "Enrolment submitted successfully.", enrolment);
        }

        public async Task<BenefitEnrolment?> VerifyEnrolmentAsync(int id, string status)
        {
            var enrolment = await _repository.GetEnrolmentByIdAsync(id);
            if (enrolment == null)
            {
                return null;
            }

            enrolment.Status = status;
            await _repository.SaveChangesAsync();
            return enrolment;
        }

        public async Task<List<Dependent>> GetMyDependentsAsync(string employeeId)
        {
            return await _repository.GetActiveDependentsByEmployeeIdAsync(employeeId);
        }

        public async Task<Dependent> AddDependentAsync(string employeeId, DependentRequest request)
        {
            var dependent = new Dependent
            {
                EmployeeID = employeeId,
                Name = request.Name,
                Relationship = request.Relationship,
                DateOfBirth = request.DateOfBirth,
                Status = "Active"
            };

            await _repository.AddDependentAsync(dependent);
            await _repository.SaveChangesAsync();
            return dependent;
        }

        public async Task<(bool Success, string Message)> RemoveDependentAsync(int id, string employeeId, string userRole)
        {
            var dependent = await _repository.GetDependentByIdAsync(id);
            if (dependent == null)
            {
                return (false, "Dependent not found.");
            }

            if (dependent.EmployeeID != employeeId && userRole != "Admin")
            {
                return (false, "You do not have access to remove this dependent.");
            }

            dependent.Status = "Removed";
            await _repository.SaveChangesAsync();
            return (true, "Dependent removed.");
        }

        public async Task<object> GetInternalStatsAsync()
        {
            var activeEnrolments = await _repository.GetActiveOrSubmittedEnrolmentsAsync();
            var enrolmentCount = activeEnrolments.Count;

            decimal totalPremiumCost = 0;
            foreach (var enrolment in activeEnrolments)
            {
                var plan = await _repository.GetPlanByIdAsync(enrolment.PlanID);
                if (plan != null)
                {
                    totalPremiumCost += (plan.EmployeeContribution + plan.EmployerContribution);
                }
            }

            return new
            {
                EnrolmentCount = enrolmentCount,
                TotalPremiumCost = totalPremiumCost
            };
        }
    }
}
