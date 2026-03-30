using ClaimFlow.API.Data;
using ClaimFlow.API.DTOs;
using ClaimFlow.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClaimFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimErrorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClaimErrorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("by-claim/{claimId}")]
        public async Task<ActionResult<IEnumerable<ClaimErrorResponseDto>>> GetErrorsByClaimId(int claimId)
        {
            var claimExists = await _context.Claims.AnyAsync(c => c.ClaimId == claimId);

            if (!claimExists)
            {
                return NotFound(new { Message = $"Claim with ID {claimId} not found." });
            }

            var errors = await _context.ClaimErrors
                .Where(e => e.ClaimId == claimId)
                .Select(e => new ClaimErrorResponseDto
                {
                    ClaimErrorId = e.ClaimErrorId,
                    ClaimId = e.ClaimId,
                    ErrorCode = e.ErrorCode,
                    ErrorType = e.ErrorType,
                    Description = e.Description,
                    ResolutionStatus = e.ResolutionStatus,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();

            return Ok(errors);
        }

        [HttpPost]
        public async Task<ActionResult<ClaimErrorResponseDto>> CreateClaimError(CreateClaimErrorDto createDto)
        {
            var claimExists = await _context.Claims.AnyAsync(c => c.ClaimId == createDto.ClaimId);

            if (!claimExists)
            {
                return BadRequest(new { Message = $"Claim with ID {createDto.ClaimId} not found." });
            }

            var claimError = new ClaimError
            {
                ClaimId = createDto.ClaimId,
                ErrorCode = createDto.ErrorCode,
                ErrorType = createDto.ErrorType,
                Description = createDto.Description,
                ResolutionStatus = createDto.ResolutionStatus,
                CreatedAt = DateTime.UtcNow
            };

            _context.ClaimErrors.Add(claimError);
            await _context.SaveChangesAsync();

            var response = new ClaimErrorResponseDto
            {
                ClaimErrorId = claimError.ClaimErrorId,
                ClaimId = claimError.ClaimId,
                ErrorCode = claimError.ErrorCode,
                ErrorType = claimError.ErrorType,
                Description = claimError.Description,
                ResolutionStatus = claimError.ResolutionStatus,
                CreatedAt = claimError.CreatedAt
            };
            return CreatedAtAction(nameof(GetErrorsByClaimId), new { claimId = claimError.ClaimId }, response);
        }

        [HttpPut("{id}/resolution-status")]
        public async Task<ActionResult<ClaimErrorResponseDto>> UpdateResolutionStatus(int id, UpdateResolutionStatusDto updateDto)
        {
            var claimError = await _context.ClaimErrors.FindAsync(id);

            if (claimError == null)
            {
                return NotFound(new { Message = $"Claim error with ID {id} not found." });
            }

            claimError.ResolutionStatus = updateDto.ResolutionStatus;
            await _context.SaveChangesAsync();

            var response = new ClaimErrorResponseDto
            {
                ClaimErrorId = claimError.ClaimErrorId,
                ClaimId = claimError.ClaimId,
                ErrorCode = claimError.ErrorCode,
                ErrorType = claimError.ErrorType,
                Description = claimError.Description,
                ResolutionStatus = claimError.ResolutionStatus,
                CreatedAt = claimError.CreatedAt
            };

            return Ok(response);
        }
    }
}
