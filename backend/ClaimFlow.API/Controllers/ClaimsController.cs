using ClaimFlow.API.Data;
using ClaimFlow.API.DTOs;
using ClaimFlow.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClaimFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClaimsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ClaimsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClaimResponseDto>>> GetClaims(
            [FromQuery] int? claimId,
            [FromQuery] string? memberId,
            [FromQuery] string? providerId,
            [FromQuery] string? state,
            [FromQuery] string? status)
        {
            var query = _context.Claims.AsQueryable();

            if (claimId.HasValue)
            {
                query = query.Where(c => c.ClaimId == claimId.Value);
            }

            if (!string.IsNullOrWhiteSpace(memberId))
            {
                query = query.Where(c => c.MemberId.Contains(memberId));
            }

            if (!string.IsNullOrWhiteSpace(providerId))
            {
                query = query.Where(c => c.ProviderId.Contains(providerId));
            }

            if (!string.IsNullOrWhiteSpace(state))
            {
                query = query.Where(c => c.State.ToLower() == state.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(c => c.Status.ToLower() == status.ToLower());
            }

            var claims = await query
                .Select(c => new ClaimResponseDto
                {
                    ClaimId = c.ClaimId,
                    MemberId = c.MemberId,
                    ProviderId = c.ProviderId,
                    State = c.State,
                    ClaimType = c.ClaimType,
                    Amount = c.Amount,
                    Status = c.Status,
                    SubmissionDate = c.SubmissionDate,
                    IsInternal = c.IsInternal,
                    CreatedByUserId = c.CreatedByUserId,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(claims);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClaimResponseDto>> GetClaimById(int id)
        {
            var claim = await _context.Claims
                .Where(c => c.ClaimId == id)
                .Select(c => new ClaimResponseDto
                {
                    ClaimId = c.ClaimId,
                    MemberId = c.MemberId,
                    ProviderId = c.ProviderId,
                    State = c.State,
                    ClaimType = c.ClaimType,
                    Amount = c.Amount,
                    Status = c.Status,
                    SubmissionDate = c.SubmissionDate,
                    IsInternal = c.IsInternal,
                    CreatedByUserId = c.CreatedByUserId,
                    CreatedAt = c.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (claim == null)
            {
                return NotFound(new { message = $"Claim  with ID {id} not found." });
            }
            return Ok(claim);
        }

        [HttpPost]
        public async Task<ActionResult<ClaimResponseDto>> CreateClaim(CreateClaimDto createClaimDto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == createClaimDto.CreatedByUserId);

            if (!userExists)
            {
                return BadRequest(new { message = $"User with ID {createClaimDto.CreatedByUserId} does not exist." });
            }

            var claim = new Claim
            {
                MemberId = createClaimDto.MemberId,
                ProviderId = createClaimDto.ProviderId,
                State = createClaimDto.State,
                ClaimType = createClaimDto.ClaimType,
                Amount = createClaimDto.Amount,
                Status = createClaimDto.Status,
                SubmissionDate = createClaimDto.SubmissionDate,
                IsInternal = createClaimDto.IsInternal,
                CreatedByUserId = createClaimDto.CreatedByUserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Claims.Add(claim);
            await _context.SaveChangesAsync();

            var response = new ClaimResponseDto
            {
                ClaimId = claim.ClaimId,
                MemberId = claim.MemberId,
                ProviderId = claim.ProviderId,
                State = claim.State,
                ClaimType = claim.ClaimType,
                Amount = claim.Amount,
                Status = claim.Status,
                SubmissionDate = claim.SubmissionDate,
                IsInternal = claim.IsInternal,
                CreatedByUserId = claim.CreatedByUserId,
                CreatedAt = claim.CreatedAt
            };

            return CreatedAtAction(nameof(GetClaimById), new { id = claim.ClaimId }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ClaimResponseDto>> UpdateClaim(int id, UpdateClaimDto updateClaimDto)
        {
            var claim = await _context.Claims.FindAsync(id);

            if (claim == null)
            {
                return NotFound(new { message = $"Claim with ID {id} not found." });
            }

            var userExists = await _context.Users.AnyAsync(u => u.UserId == updateClaimDto.CreatedByUserId);

            if (!userExists)
            {
                return BadRequest(new { message = $"User with ID {updateClaimDto.CreatedByUserId} does not exist." });
            }

            claim.MemberId = updateClaimDto.MemberId;
            claim.ProviderId = updateClaimDto.ProviderId;
            claim.State = updateClaimDto.State;
            claim.ClaimType = updateClaimDto.ClaimType;
            claim.Amount = updateClaimDto.Amount;
            claim.Status = updateClaimDto.Status;
            claim.SubmissionDate = updateClaimDto.SubmissionDate;
            claim.IsInternal = updateClaimDto.IsInternal;
            claim.CreatedByUserId = updateClaimDto.CreatedByUserId;
            claim.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            var response = new ClaimResponseDto
            {
                ClaimId = claim.ClaimId,
                MemberId = claim.MemberId,
                ProviderId = claim.ProviderId,
                State = claim.State,
                ClaimType = claim.ClaimType,
                Amount = claim.Amount,
                Status = claim.Status,
                SubmissionDate = claim.SubmissionDate,
                IsInternal = claim.IsInternal,
                CreatedByUserId = claim.CreatedByUserId,
                CreatedAt = claim.CreatedAt
            };
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteClaim(int id)
        {
            var claim = await _context.Claims.FindAsync(id);

            if (claim == null)
            {
                return NotFound(new { message = $"Claim with ID {id} not found." });
            }

            _context.Claims.Remove(claim);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Claim with ID {id} has been deleted." });
        }
    }
}
