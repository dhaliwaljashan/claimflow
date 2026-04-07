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
    public class ClaimNotesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClaimNotesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("by-claim/{claimId}")]
        public async Task<ActionResult<IEnumerable<ClaimNoteResponseDto>>> GetNotesByClaimId(int claimId)
        {
            var claimExists = await _context.Claims.AnyAsync(c => c.ClaimId == claimId);

            if (!claimExists)
            {
                return NotFound(new { message = $"Claim with ID {claimId} not found." });
            }

            var notes = await _context.ClaimNotes
                 .Where(n => n.ClaimId == claimId)
                 .Include(n => n.User)
                 .OrderByDescending(n => n.CreatedAt)
                 .Select(n => new ClaimNoteResponseDto
                 {
                     ClaimNoteId = n.ClaimNoteId,
                     ClaimId = n.ClaimId,
                     UserId = n.UserId,
                     UserName = n.User != null ? n.User.FullName : "Unknown User",
                     NoteText = n.NoteText,
                     CreatedAt = n.CreatedAt
                 })
                 .ToListAsync();

            return Ok(notes);
        }

        [HttpPost]
        public async Task<ActionResult<ClaimNoteResponseDto>> CreateClaimNote(CreateClaimNoteDto createClaimNoteDto)
        {
            var claimExists = await _context.Claims.AnyAsync(c => c.ClaimId == createClaimNoteDto.ClaimId);
            if (!claimExists)
            {
                return BadRequest(new { message = "Invalid ClaimId. Claim does not exist." });
            }

            var userExists = await _context.Users.AnyAsync(u => u.UserId == createClaimNoteDto.UserId);
            if (!userExists)
            {
                return BadRequest(new { message = "Invalid UserId. User does not exist." });
            }

            var note = new ClaimNote
            {
                ClaimId = createClaimNoteDto.ClaimId,
                UserId = createClaimNoteDto.UserId,
                NoteText = createClaimNoteDto.NoteText,
                CreatedAt = DateTime.UtcNow
            };

            _context.ClaimNotes.Add(note);
            await _context.SaveChangesAsync();

            var savedNote = await _context.ClaimNotes
                .Include(n => n.User)
                .FirstAsync(n => n.ClaimNoteId == note.ClaimNoteId);

            var response = new ClaimNoteResponseDto
            {
                ClaimNoteId = savedNote.ClaimNoteId,
                ClaimId = savedNote.ClaimId,
                UserId = savedNote.UserId,
                UserName = savedNote.User?.FullName ?? "Unknown User",
                NoteText = savedNote.NoteText,
                CreatedAt = savedNote.CreatedAt
            };

            return Ok(response);
        }
    }
}
