namespace ClaimFlow.API.DTOs
{
    public class ClaimResponseDto
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
        public DateTime CreatedAt { get; set; }
    }
}
