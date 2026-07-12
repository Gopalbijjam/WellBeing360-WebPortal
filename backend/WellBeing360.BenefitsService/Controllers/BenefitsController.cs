using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using WellBeing360.BenefitsService.DTOs;
using WellBeing360.BenefitsService.Entities;
using WellBeing360.BenefitsService.Services.Interfaces;

namespace WellBeing360.BenefitsService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BenefitsController : ControllerBase
    {
        private readonly IBenefitsService _benefitsService;

        public BenefitsController(IBenefitsService benefitsService)
        {
            _benefitsService = benefitsService;
        }

        // --- Benefit Plans ---

        [HttpGet("plans")]
        public async Task<IActionResult> GetPlans()
        {
            var plans = await _benefitsService.GetPlansAsync();
            return Ok(plans);
        }

        [HttpGet("plans/{id}")]
        public async Task<IActionResult> GetPlanById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be positive.");
            }

            var plan = await _benefitsService.GetPlanByIdAsync(id);
            if (plan == null)
            {
                return NotFound("Benefit plan not found.");
            }

            return Ok(plan);
        }

        [HttpPost("plans")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        public async Task<IActionResult> CreatePlan([FromBody] BenefitPlan plan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (plan.PlanID != 0 && plan.PlanID <= 0)
            {
                return BadRequest("ID must be positive.");
            }

            var created = await _benefitsService.CreatePlanAsync(plan);
            return CreatedAtAction(nameof(GetPlanById), new { id = created.PlanID }, created);
        }

        [HttpPut("plans/{id}")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] BenefitPlan plan)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be positive.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != plan.PlanID)
            {
                return BadRequest("ID mismatch.");
            }

            try
            {
                await _benefitsService.UpdatePlanAsync(plan);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _benefitsService.PlanExistsAsync(id))
                {
                    return NotFound("Benefit plan not found.");
                }
                throw;
            }

            return NoContent();
        }

        // --- Flex Benefit Buckets ---

        [HttpGet("buckets")]
        public async Task<IActionResult> GetBuckets()
        {
            var buckets = await _benefitsService.GetBucketsAsync();
            return Ok(buckets);
        }

        [HttpPost("buckets")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        public async Task<IActionResult> CreateBucket([FromBody] FlexBenefitBucket bucket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _benefitsService.CreateBucketAsync(bucket);
            return Ok(created);
        }

        // --- Enrolment Windows ---

        [HttpGet("windows")]
        public async Task<IActionResult> GetWindows()
        {
            var windows = await _benefitsService.GetWindowsAsync();
            return Ok(windows);
        }

        [HttpPost("windows")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        public async Task<IActionResult> CreateWindow([FromBody] EnrolmentWindow window)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _benefitsService.CreateWindowAsync(window);
            return Ok(created);
        }

        // --- Enrolments ---

        [HttpGet("enrolments")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin,Finance")]
        public async Task<IActionResult> GetEnrolments()
        {
            var enrolments = await _benefitsService.GetEnrolmentsAsync();
            return Ok(enrolments);
        }

        [HttpGet("my-enrolments")]
        public async Task<IActionResult> GetMyEnrolments()
        {
            var employeeId = User.FindFirst("EmployeeID")?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var enrolments = await _benefitsService.GetMyEnrolmentsAsync(employeeId);
            return Ok(enrolments);
        }

        [HttpPost("enrol")]
        public async Task<IActionResult> Enrol([FromBody] EnrolmentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var employeeId = User.FindFirst("EmployeeID")?.Value;
            var gradeId = User.FindFirst("GradeID")?.Value;

            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            if (string.IsNullOrEmpty(gradeId))
            {
                return BadRequest("GradeID claim not found in token.");
            }

            var result = await _benefitsService.EnrolAsync(employeeId, gradeId, request);
            if (!result.Success)
            {
                if (result.Message.Contains("not found"))
                {
                    return NotFound(result.Message);
                }
                return BadRequest(result.Message);
            }

            return Ok(result.Enrolment);
        }

        [HttpPost("enrolments/{id}/verify")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        public async Task<IActionResult> VerifyEnrolment(int id, [FromQuery] string status)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be positive.");
            }

            var validStatuses = new[] { "Active", "Cancelled", "Lapsed" };
            if (!System.Linq.Enumerable.Contains(validStatuses, status))
            {
                return BadRequest("Invalid status. Allowed values: Active, Cancelled, Lapsed.");
            }

            var enrolment = await _benefitsService.VerifyEnrolmentAsync(id, status);
            if (enrolment == null)
            {
                return NotFound("Enrolment not found.");
            }

            return Ok(enrolment);
        }

        // --- Dependents ---

        [HttpGet("my-dependents")]
        public async Task<IActionResult> GetMyDependents()
        {
            var employeeId = User.FindFirst("EmployeeID")?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var dependents = await _benefitsService.GetMyDependentsAsync(employeeId);
            return Ok(dependents);
        }

        [HttpPost("dependents")]
        public async Task<IActionResult> AddDependent([FromBody] DependentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var employeeId = User.FindFirst("EmployeeID")?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var dependent = await _benefitsService.AddDependentAsync(employeeId, request);
            return Ok(dependent);
        }

        [HttpDelete("dependents/{id}")]
        public async Task<IActionResult> RemoveDependent(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be positive.");
            }

            var employeeId = User.FindFirst("EmployeeID")?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var result = await _benefitsService.RemoveDependentAsync(id, employeeId, userRole);
            if (!result.Success)
            {
                if (result.Message.Contains("not found"))
                {
                    return NotFound(result.Message);
                }
                return Forbid(result.Message);
            }

            return NoContent();
        }

        // --- Internal Stats for Analytics ---

        [HttpGet("internal/stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetInternalStats()
        {
            var stats = await _benefitsService.GetInternalStatsAsync();
            return Ok(stats);
        }
    }
}
