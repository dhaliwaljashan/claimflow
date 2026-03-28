using ClaimFlow.API.Data;
using ClaimFlow.API.DTOs;
using ClaimFlow.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClaimFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ClaimsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClaimResponseDTO>>> GetClaims()
        {
            var claims = await _context.Claims
                .Select(c => new ClaimResponseDTO
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
        public async Task<ActionResult<ClaimResponseDTO>> GetClaimById(int id)
        {
            var claim = await _context.Claims
                .Where(c => c.ClaimId == id)
                .Select(c => new ClaimResponseDTO
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
                return NotFound(new { message = $"Claim  with ID {id} not found."});
            }
            return Ok(claim);
        }

        [HttpPost]
        public async Task<ActionResult<ClaimResponseDTO>> CreateClaim(CreateClaimDTO createClaimDto)
        {
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

            var response = new ClaimResponseDTO
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
    }
}
