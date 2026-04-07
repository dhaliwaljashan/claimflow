using ClaimFlow.API.Models;

namespace ClaimFlow.API.DTOs
{
    public class AuditLogResponseDto
    {
        public int AuditLogId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int? ClaimId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public int EntityId { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
