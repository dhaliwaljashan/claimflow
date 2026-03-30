using System.ComponentModel.DataAnnotations;

namespace ClaimFlow.API.DTOs
{
    public class CreateClaimErrorDto
    {
        [Required]
        public int ClaimId { get; set; }

        [Required]
        public string ErrorCode { get; set; } = string.Empty;

        [Required]
        public string ErrorType { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string ResolutionStatus { get; set; } = string.Empty;
    }
}
