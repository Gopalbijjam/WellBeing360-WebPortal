using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WellBeing360.RewardsService.Services.Interfaces;

namespace WellBeing360.RewardsService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IRewardsService _rewardsService;

        public ReportsController(IRewardsService rewardsService)
        {
            _rewardsService = rewardsService;
        }

        [HttpGet("generate")]
        [Authorize(Roles = "Admin,Finance,HRBenefitsAdmin")]
        public async Task<IActionResult> GenerateReport([FromQuery] string scope = "Global")
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString();

            var result = await _rewardsService.GenerateReportAsync(scope, token);
            if (!result.Success)
            {
                return StatusCode(500, result.Message);
            }

            return Ok(result.ReportDetails);
        }

        [HttpGet("history")]
        [Authorize(Roles = "Admin,Finance,HRBenefitsAdmin")]
        public async Task<IActionResult> GetReportsHistory()
        {
            var history = await _rewardsService.GetReportsHistoryAsync();
            return Ok(history);
        }
    }
}
