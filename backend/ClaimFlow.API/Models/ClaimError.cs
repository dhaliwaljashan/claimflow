namespace ClaimFlow.API.Models
{
    public class ClaimError
    {
        public int ClaimErrorId { get; set; }
        public int ClaimId { get; set; }
        public string ErrorCode { get; set; } = string.Empty;
        public string ErrorType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ResolutionStatus { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // Navigation property
        public Claim? Claim { get; set; }
    }
}
