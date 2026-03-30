using ClaimFlow.API.Auth;
using ClaimFlow.API.Data;
using ClaimFlow.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClaimFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenHelper _jwtTokenHelper;

        public AuthController(ApplicationDbContext context, JwtTokenHelper jwtTokenHelper)
        {
            _context = context;
            _jwtTokenHelper = jwtTokenHelper;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto loginRequestDto)
        {
           var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == loginRequestDto.Email.ToLower());
            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            var isPasswordValid = PasswordHelper.VerifyPassword(loginRequestDto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            var token = _jwtTokenHelper.GenerateToken(user);

            var response = new LoginResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role
                }
            };
            return Ok(response);
        }
    }
}
