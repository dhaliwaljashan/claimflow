namespace ClaimFlow.API.DTOs
{
    public class ClaimNoteResponseDto
    {
        public int ClaimNoteId { get; set; }
        public int ClaimId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string NoteText { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
