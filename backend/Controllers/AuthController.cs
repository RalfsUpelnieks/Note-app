using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        private readonly IConfiguration _configuration;
        private DataContext _context;
        public AuthController(IConfiguration configuration, DataContext dataContext) {
            _configuration = configuration;
            _context = dataContext;
            SeedData();
        }

        private void SeedData() {
            if (!_context.users.Where(u => u.Role == 1).Any()) {
                var user = new User {
                    Name = "admin",
                    Surname = "admin",
                    Username = "admin",
                    EmailAddress = "example@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                    Role = 1
                };

                _context.Add(user);
                _context.SaveChanges();
            }
        }
        
        [HttpPost("register")]
        public ActionResult<User> Register([FromBody] UserRegistration requestDto) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!new EmailAddressAttribute().IsValid(requestDto.Email)) { return BadRequest(new { Error = "Invalid email" }); }

            if (_context.users.Any(u => u.Username == requestDto.Username)) { return BadRequest(new { Error = "User with this username already exists" }); }
            
            if (_context.users.Any(u => u.EmailAddress == requestDto.Email)) { return BadRequest(new { Error = "User with this email already exists" }); }

            if (requestDto.Password.Length < 6) { return BadRequest(new { Error = "Password must be at least 6 characters" }); }

            var user = new User {
                Name = requestDto.Name,
                Surname = requestDto.Surname,
                Username = requestDto.Username,
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
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var user = _context.users.FirstOrDefault(u => u.Username == request.Username);
            if (user == null) {
                user = _context.users.FirstOrDefault(u => u.EmailAddress == request.Username);
            }

            if (user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Ok(new {
                    Token = CreateToken(user),
                    Role = user.Role,
                    Username = user.Username,
                    EmailAddress = user.EmailAddress,
                    Name = user.Name,
                    Surname = user.Surname
                });
            }
            else
            {
                return BadRequest(new { Error = "Invalid username or password" });
            }
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
