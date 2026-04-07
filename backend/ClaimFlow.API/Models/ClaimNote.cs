namespace ClaimFlow.API.Models
{
    public class ClaimNote
    {
        public int ClaimNoteId { get; set; }
        public int ClaimId { get; set; }
        public int UserId { get; set; }
        public string NoteText { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Claim? Claim { get; set; }
        public User? User { get; set; }

    }
}
