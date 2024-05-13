using backend.Data;
using backend.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Services
{
    public sealed class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreateJWTToken(User user)
        {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.EmailAddress),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Jwt:Key").Value!));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            int validMinutes = int.Parse(_configuration["Jwt:ValidMinutes"]);
            
            var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims, expires: DateTime.Now.AddMinutes(validMinutes), signingCredentials: cred);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateResetToken(int length = 112)
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var tokenData = new byte[length];
            rngCryptoServiceProvider.GetBytes(tokenData);
            return Convert.ToBase64String(tokenData);
        }
    }
}
