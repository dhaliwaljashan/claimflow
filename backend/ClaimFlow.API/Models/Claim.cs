namespace ClaimFlow.API.Models
{
    public class Claim
    {
        public int ClaimId { get; set; }
        public string MemberId { get; set; } = string.Empty;
        public string ProviderId { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ClaimType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubmissionDate { get; set; }
        public bool IsInternal { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        // Navigation property
        public User? CreatedByUser { get; set; }
        public ICollection<ClaimError> ClaimErrors { get; set; } = new List<ClaimError>();
        public ICollection<ClaimNote> ClaimNotes { get; set; } = new List<ClaimNote>();
    }
}
