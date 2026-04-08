using ClaimFlow.API.AI;
using ClaimFlow.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace ClaimFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAIService _aiService;

        public AIController(ApplicationDbContext context, IAIService aiService)
        {
            _context = context;
            _aiService = aiService;
        }

        [HttpPost("summarize-claim/{claimId}")]
        public async Task<ActionResult<object>> SummarizeClaim(int claimId)
        {
            var claim = await _context.Claims.FirstOrDefaultAsync(c => c.ClaimId == claimId);

            if (claim == null)
            {
                return NotFound(new { message = $"Claim with ID {claimId} not found." });
            }
            var notes = await _context.ClaimNotes
                .Where(n => n.ClaimId == claimId)
                .OrderByDescending(n => n.CreatedAt).
                ToListAsync();

            var errors = await _context.ClaimErrors
                .Where(e => e.ClaimId == claimId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            var contextBuilder = new StringBuilder();

            contextBuilder.AppendLine($"Claim ID: {claim.ClaimId}");
            contextBuilder.AppendLine($"Member ID: {claim.MemberId}");
            contextBuilder.AppendLine($"Provider ID: {claim.ProviderId}");
            contextBuilder.AppendLine($"State: {claim.State}");
            contextBuilder.AppendLine($"Claim Type: {claim.ClaimType}");
            contextBuilder.AppendLine($"Amount: {claim.Amount}");
            contextBuilder.AppendLine($"Status: {claim.Status}");
            contextBuilder.AppendLine($"Internal: {(claim.IsInternal ? "Yes" : "No")}");
            contextBuilder.AppendLine($"Submission Date: {claim.SubmissionDate}");
            contextBuilder.AppendLine();
            contextBuilder.AppendLine("Errors:");

            foreach (var error in errors)
            {
                contextBuilder.AppendLine($"- [{error.ErrorType}] {error.ErrorCode}: {error.Description} (Status: {error.ResolutionStatus})");
            }

            contextBuilder.AppendLine();
            contextBuilder.AppendLine("Notes:");

            foreach (var note in notes)
            {
                contextBuilder.AppendLine($"- {note.NoteText}");
            }

            var summary = await _aiService.SummarizeClaimAsync(contextBuilder.ToString());
            return Ok(new
            {
                claimId,
                summary
            });
        }
    }
}
