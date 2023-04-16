using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        private readonly IConfiguration _configuration;
        private DataContext _context;
        public AuthController(IConfiguration configuration, DataContext dataContext) {
            _configuration = configuration;
            _context = dataContext;
        }

        [HttpPost("register")]
        public ActionResult<User> Register([FromBody] UserRegistration requestDto) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (_context.users.Any(u => u.EmailAddress == requestDto.Email)) return BadRequest("User with this email already exists");

            if (!new EmailAddressAttribute().IsValid(requestDto.Email)) return BadRequest("Invalid email");

            if (requestDto.Password.Length < 8) return BadRequest("Password must be at least 8 characters");

            var user = new User {
                Name = requestDto.FirstName,
                Surname = requestDto.LastName,
                EmailAddress = requestDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(requestDto.Password),
                Role = requestDto.IsAdmin ? 1 : 0
            };

            _context.Add(user);
            _context.SaveChanges();

            return Ok(user);
        }

        [HttpPost("login")]
        public ActionResult<User> Login([FromBody] UserLogin request) {
            if (ModelState.IsValid) {
                var user = _context.users.FirstOrDefault(u => u.EmailAddress == request.Email);
                if (user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) {
                    return Ok(new {token = CreateToken(user)});
                } else {
                    return BadRequest(new { Error = "Invalid username or password"});
                }
            } 
            
            return BadRequest(ModelState);
        }

        private string CreateToken(User user) {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.EmailAddress),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Jwt:Key").Value!));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims, expires: DateTime.Now.AddMinutes(15), signingCredentials: cred);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
