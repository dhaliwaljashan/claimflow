namespace ClaimFlow.API.Models
{
    public class AuditLog
    {
        public int AuditLogId { get; set; }
        public int UserId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public int EntityId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        // Navigation property
        public User? User { get; set; }
    }
}
