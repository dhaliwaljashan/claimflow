using Microsoft.AspNetCore.Antiforgery;
using System.ComponentModel.DataAnnotations;

namespace ClaimFlow.API.DTOs
{
    public class CreateClaimDTO
    {
        [Required]
        public string MemberId { get; set; } = string.Empty;

        [Required]
        public string ProviderId { get; set; } = string.Empty;

        [Required]
        public string State { get; set; } = string.Empty;

        [Required]
        public string ClaimType { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;
        public DateTime SubmissionDate { get; set; }
        public bool IsInternal { get; set; }
        public int CreatedByUserId { get; set; }
    }
}
