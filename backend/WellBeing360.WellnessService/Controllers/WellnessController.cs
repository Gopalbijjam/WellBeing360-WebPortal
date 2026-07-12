using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using WellBeing360.WellnessService.DTOs;
using WellBeing360.WellnessService.Entities;
using WellBeing360.WellnessService.Services.Interfaces;

namespace WellBeing360.WellnessService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WellnessController : ControllerBase
    {
        private readonly IWellnessService _wellnessService;

        public WellnessController(IWellnessService wellnessService)
        {
            _wellnessService = wellnessService;
        }

        // --- Programs & Challenges ---

        [HttpGet("programs")]
        public async Task<IActionResult> GetPrograms()
        {
            var programs = await _wellnessService.GetProgramsAsync();
            return Ok(programs);
        }

        [HttpPost("programs")]
        [Authorize(Roles = "Admin,WellnessCoordinator")]
        public async Task<IActionResult> CreateProgram([FromBody] WellnessProgram program)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _wellnessService.CreateProgramAsync(program);
            return Ok(created);
        }

        [HttpGet("challenges")]
        public async Task<IActionResult> GetChallenges()
        {
            var challenges = await _wellnessService.GetChallengesAsync();
            return Ok(challenges);
        }

        [HttpPost("challenges")]
        [Authorize(Roles = "Admin,WellnessCoordinator")]
        public async Task<IActionResult> CreateChallenge([FromBody] WellnessChallenge challenge)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _wellnessService.CreateChallengeAsync(challenge);
            return Ok(created);
        }

        // --- Activity Logs ---

        [HttpPost("logs")]
        public async Task<IActionResult> SubmitActivityLog([FromBody] ActivityLogRequest request)
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

            var result = await _wellnessService.SubmitActivityLogAsync(employeeId, request);
            if (!result.Success)
            {
                return NotFound(result.Message);
            }

            return Ok(result.Log);
        }

        [HttpGet("logs/my")]
        public async Task<IActionResult> GetMyLogs()
        {
            var employeeId = User.FindFirst("EmployeeID")?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var logs = await _wellnessService.GetMyLogsAsync(employeeId);
            return Ok(logs);
        }

        [HttpGet("logs/pending")]
        [Authorize(Roles = "Admin,WellnessCoordinator")]
        public async Task<IActionResult> GetPendingLogs()
        {
            var logs = await _wellnessService.GetPendingLogsAsync();
            return Ok(logs);
        }

        [HttpPost("logs/{id}/verify")]
        [Authorize(Roles = "Admin,WellnessCoordinator")]
        public async Task<IActionResult> VerifyActivityLog(int id, [FromQuery] bool approve)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be positive.");
            }

            var result = await _wellnessService.VerifyActivityLogAsync(id, approve);
            if (!result.Success)
            {
                if (result.Message.Contains("not found"))
                {
                    return NotFound(result.Message);
                }
                return BadRequest(result.Message);
            }

            return Ok(result.Log);
        }

        // --- Leaderboard ---

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard()
        {
            var leaderboard = await _wellnessService.GetLeaderboardAsync();
            return Ok(leaderboard);
        }

        // --- Employee Assistance Program (EAP) ---

        [HttpGet("eap/services")]
        public async Task<IActionResult> GetEapServices()
        {
            var services = await _wellnessService.GetActiveEapServicesAsync();
            return Ok(services);
        }

        [HttpPost("eap/services")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEapService([FromBody] EAPService service)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _wellnessService.CreateEapServiceAsync(service);
            return Ok(created);
        }

        [HttpPost("eap/book")]
        public async Task<IActionResult> BookEapSession([FromBody] BookSessionRequest request)
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

            var result = await _wellnessService.BookEapSessionAsync(employeeId, request);
            if (!result.Success)
            {
                if (result.Message.Contains("not found"))
                {
                    return NotFound(result.Message);
                }
                return BadRequest(result.Message);
            }

            return Ok(result.Session);
        }

        [HttpGet("eap/my-sessions")]
        public async Task<IActionResult> GetMyEapSessions()
        {
            var employeeId = User.FindFirst("EmployeeID")?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var sessions = await _wellnessService.GetMyEapSessionsAsync(employeeId);
            return Ok(sessions);
        }

        [HttpGet("eap/sessions")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        public async Task<IActionResult> GetAllEapSessions()
        {
            var sessions = await _wellnessService.GetAllEapSessionsAsync();
            return Ok(sessions);
        }

        [HttpPost("eap/sessions/{id}/status")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        public async Task<IActionResult> UpdateEapSessionStatus(int id, [FromQuery] string status, [FromQuery] string counsellorRef)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be positive.");
            }

            var allowedStatuses = new[] { "Scheduled", "Completed", "Cancelled" };
            if (!System.Linq.Enumerable.Contains(allowedStatuses, status))
            {
                return BadRequest("Invalid status. Allowed values: Scheduled, Completed, Cancelled.");
            }

            var result = await _wellnessService.UpdateEapSessionStatusAsync(id, status, counsellorRef);
            if (!result.Success)
            {
                return NotFound(result.Message);
            }

            return Ok(result.Session);
        }

        // --- Internal Stats Endpoint ---

        [HttpGet("internal/stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetInternalStats()
        {
            var stats = await _wellnessService.GetInternalStatsAsync();
            return Ok(stats);
        }
    }
}
