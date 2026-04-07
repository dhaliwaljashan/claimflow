using System.ComponentModel.DataAnnotations;

namespace ClaimFlow.API.DTOs
{
    public class CreateClaimNoteDto
    {
        [Required]
        public int ClaimId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string NoteText { get; set; } = string.Empty;
    }
}
