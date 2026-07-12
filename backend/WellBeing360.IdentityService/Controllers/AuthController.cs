using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using WellBeing360.IdentityService.DTOs;
using WellBeing360.IdentityService.Services.Interfaces;

namespace WellBeing360.IdentityService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IIdentityService _identityService;

        public AuthController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _identityService.RegisterAsync(request);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(new { Message = result.Message, EmployeeID = result.EmployeeID });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _identityService.LoginAsync(request);
            if (!result.Success || result.User == null)
            {
                return Unauthorized(result.Message);
            }

            return Ok(new
            {
                Token = result.Token,
                User = new
                {
                    result.User.UserID,
                    result.User.EmployeeID,
                    result.User.Name,
                    result.User.Role,
                    result.User.Email,
                    result.User.GradeID,
                    result.User.DepartmentID
                }
            });
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin,HRBenefitsAdmin,HRAdmin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _identityService.GetAllUsersAsync();
            var projectedUsers = users.Select(u => new
            {
                u.UserID,
                u.EmployeeID,
                u.Name,
                u.Role,
                u.Email,
                u.Phone,
                u.GradeID,
                u.DepartmentID,
                u.Status
            });

            return Ok(projectedUsers);
        }

        [HttpGet("users/{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be positive.");
            }

            var user = await _identityService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Authorize: Self, Admin, HRBenefitsAdmin
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (currentUserId != id.ToString() && currentUserRole != "Admin" && currentUserRole != "HRBenefitsAdmin" && currentUserRole != "HRAdmin")
            {
                return Forbid("You do not have access to view this user profile.");
            }

            return Ok(new
            {
                user.UserID,
                user.EmployeeID,
                user.Name,
                user.Role,
                user.Email,
                user.Phone,
                user.GradeID,
                user.DepartmentID,
                user.Status
            });
        }

        [HttpGet("audit-logs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var logs = await _identityService.GetAuditLogsAsync();
            return Ok(logs);
        }
    }
}
