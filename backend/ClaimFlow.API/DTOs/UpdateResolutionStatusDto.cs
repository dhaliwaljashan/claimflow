using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ClaimFlow.API.DTOs
{
    public class UpdateResolutionStatusDto
    {
        [Required]
        public string ResolutionStatus { get; set; } = string.Empty;
    }
}
