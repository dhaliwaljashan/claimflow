using System.Security.Cryptography;
using System.Text;

namespace ClaimFlow.API.Auth
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }

        public static bool VerifyPassword(string password, string storedHash)
        {
            var hashedPassword = HashPassword(password);
            return hashedPassword == storedHash;
        }
    }
}
