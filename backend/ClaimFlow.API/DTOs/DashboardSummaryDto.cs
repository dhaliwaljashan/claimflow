namespace ClaimFlow.API.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalClaims { get; set; }
        public int ApprovedClaims { get; set; }
        public int RejectedClaims { get; set; }
        public int PendingClaims { get; set; }
        public int InternalClaims { get; set; }
        public int ExternalClaims { get; set; }
        public List<StateClaimCountDto> ClaimsByState { get; set; } = new();
    }
}
