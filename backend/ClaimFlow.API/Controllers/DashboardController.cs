using ClaimFlow.API.Data;
using ClaimFlow.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClaimFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            var totalClaims = await _context.Claims.CountAsync();
            var pendingClaims = await _context.Claims.CountAsync(c => c.Status == "Pending");
            var approvedClaims = await _context.Claims.CountAsync(c => c.Status == "Approved");
            var rejectedClaims = await _context.Claims.CountAsync(c => c.Status == "Rejected");
            var internalClaims = await _context.Claims.CountAsync(c => c.IsInternal);
            var externalClaims = await _context.Claims.CountAsync(c => !c.IsInternal);

            var claimsByState = await _context.Claims
                .GroupBy(c => c.State)
                .Select(g => new StateClaimCountDto
                {
                    State = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.State)
                .ToListAsync();

            var response = new DashboardSummaryDto
            {
                TotalClaims = totalClaims,
                ApprovedClaims = approvedClaims,
                RejectedClaims = rejectedClaims,
                PendingClaims = pendingClaims,
                InternalClaims = internalClaims,
                ExternalClaims = externalClaims,
                ClaimsByState = claimsByState
            };

            return Ok(response);
        }
    }
}
