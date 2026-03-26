using Microsoft.AspNetCore.Mvc;

namespace ClaimFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "ClaimFlow API is working" });
        }
    }
}
