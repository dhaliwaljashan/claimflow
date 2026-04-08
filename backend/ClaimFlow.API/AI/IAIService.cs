namespace ClaimFlow.API.AI
{
    public interface IAIService
    {
        Task<string> SummarizeClaimAsync(string claimContext);
    }
}
