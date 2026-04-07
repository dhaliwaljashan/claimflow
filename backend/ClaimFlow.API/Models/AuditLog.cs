namespace ClaimFlow.API.Models
{
    public class AuditLog
    {
        public int AuditLogId { get; set; }
        public int UserId { get; set; }
        public int? ClaimId {  get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public int EntityId { get; set; }
        public string Description {  get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        // Navigation property
        public User? User { get; set; }
    }
}
