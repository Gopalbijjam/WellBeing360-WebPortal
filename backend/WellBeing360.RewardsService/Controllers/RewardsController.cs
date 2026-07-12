using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using WellBeing360.RewardsService.DTOs;
using WellBeing360.RewardsService.Entities;
using WellBeing360.RewardsService.Services.Interfaces;

namespace WellBeing360.RewardsService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RewardsController : ControllerBase
    {
        private readonly IRewardsService _rewardsService;

        public RewardsController(IRewardsService rewardsService)
        {
            _rewardsService = rewardsService;
        }

        // --- Peer Recognition & Awards ---

        [HttpPost("awards")]
        public async Task<IActionResult> NominatePeer([FromBody] SendAwardRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nominatorId = User.FindFirst("EmployeeID")?.Value;
            var nominatorName = User.Identity?.Name ?? "Co-worker";
            if (string.IsNullOrEmpty(nominatorId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var result = await _rewardsService.NominatePeerAsync(nominatorId, nominatorName, request);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(result.Award);
        }

        [HttpGet("awards")]
        public async Task<IActionResult> GetAwards()
        {
            var awards = await _rewardsService.GetAwardsAsync();
            return Ok(awards);
        }

        // --- Reward Points ---

        [HttpGet("points/my")]
        public async Task<IActionResult> GetMyPoints()
        {
            var employeeId = User.FindFirst("EmployeeID")?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var points = await _rewardsService.GetOrCreateMyPointsAsync(employeeId);
            return Ok(points);
        }

        [HttpGet("points")]
        [Authorize(Roles = "Admin,RecognitionManager,HRBenefitsAdmin")]
        public async Task<IActionResult> GetAllPoints()
        {
            var pointsList = await _rewardsService.GetAllPointsAsync();
            return Ok(pointsList);
        }

        // --- Redemption Catalog ---

        [HttpGet("catalog")]
        public async Task<IActionResult> GetCatalog()
        {
            var catalog = await _rewardsService.GetCatalogAsync();
            return Ok(catalog);
        }

        [HttpPost("catalog")]
        [Authorize(Roles = "Admin,RecognitionManager")]
        public async Task<IActionResult> CreateCatalogItem([FromBody] RedemptionCatalog item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _rewardsService.CreateCatalogItemAsync(item);
            return Ok(created);
        }

        [HttpPost("redeem")]
        public async Task<IActionResult> RedeemItem([FromBody] RedeemRequest request)
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

            var result = await _rewardsService.RedeemItemAsync(employeeId, request);
            if (!result.Success)
            {
                if (result.Message.Contains("not found"))
                {
                    return NotFound(result.Message);
                }
                return BadRequest(result.Message);
            }

            return Ok(new { Message = result.Message, RemainingBalance = result.RemainingBalance });
        }

        // --- Notifications ---

        [HttpGet("notifications/my")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var employeeId = User.FindFirst("EmployeeID")?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return BadRequest("EmployeeID claim not found in token.");
            }

            var notifications = await _rewardsService.GetMyNotificationsAsync(employeeId);
            return Ok(notifications);
        }

        [HttpPost("notifications/{id}/read")]
        public async Task<IActionResult> MarkNotificationAsRead(int id)
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

            var result = await _rewardsService.MarkNotificationAsReadAsync(id, employeeId, userRole);
            if (!result.Success)
            {
                if (result.Message.Contains("not found"))
                {
                    return NotFound(result.Message);
                }
                return Forbid(result.Message);
            }

            return Ok(result.Notification);
        }

        // --- Internal Endpoint (Called by WellnessService) ---

        [HttpPost("internal/add-points")]
        [AllowAnonymous]
        public async Task<IActionResult> InternalAddPoints([FromBody] InternalAddPointsRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _rewardsService.InternalAddPointsAsync(request);
            return Ok(new { Message = "Points added successfully." });
        }
    }
}
