namespace ClaimFlow.API.Models
{
    public class StateRule
    {
        public int StateRuleId { get; set; }
        public string StateCode { get; set; } = string.Empty;
        public string RuleName { get; set; } = string.Empty;
        public string RuleDescription { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
