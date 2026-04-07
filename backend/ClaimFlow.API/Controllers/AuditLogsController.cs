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
    public class AuditLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuditLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("by-claim/{claimId}")]
        public async Task<ActionResult<IEnumerable<AuditLogResponseDto>>> GetAuditLogsByClaimId(int claimId)
        {
            var claimExists = await _context.Claims.AnyAsync(c => c.ClaimId == claimId);

            if (!claimExists)
            {
                return NotFound(new { message = $"Claim with ID {claimId} not found." });
            }

            var logs = await _context.AuditLogs
               .Where(a => a.ClaimId == claimId)
               .Include(a => a.User)
               .OrderByDescending(a => a.Timestamp)
               .Select(a => new AuditLogResponseDto
               {
                   AuditLogId = a.AuditLogId,
                   UserId = a.UserId,
                   UserName = a.User != null ? a.User.FullName : "Unknown User",
                   ClaimId = a.ClaimId,
                   ActionType = a.ActionType,
                   EntityName = a.EntityName,
                   EntityId = a.EntityId,
                   Description = a.Description,
                   Timestamp = a.Timestamp
               })
               .ToListAsync();

            return Ok(logs);
        }
    }
}
