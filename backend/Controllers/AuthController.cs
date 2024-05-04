using backend.Data;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using backend.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        private IRepository<User> _userRepository;
        private readonly ITokenService _tokenService;
       
        public AuthController(IRepository<User> userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            SeedData();
        }

        private void SeedData() {
            if (!_userRepository.Get(u => u.Role == 1).Any()) {
                var user = new User {
                    Name = "admin",
                    Surname = "admin",
                    Username = "admin",
                    EmailAddress = "example@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                    Role = int.Parse(Roles.Admin)
                };

                _userRepository.Add(user);
                _userRepository.Save();
            }
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public ActionResult<User> Register([FromBody] UserRegistration requestDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!new EmailAddressAttribute().IsValid(requestDto.Email)) { return BadRequest(new { Error = "Invalid email" }); }

            if (_userRepository.Get(u => u.Username == requestDto.Username).Any()) { return BadRequest(new { Error = "User with this username already exists" }); }

            if (_userRepository.Get(u => u.EmailAddress == requestDto.Email).Any()) { return BadRequest(new { Error = "User with this email already exists" }); }

            if (requestDto.Password.Length < 6) { return BadRequest(new { Error = "Password must be at least 6 characters" }); }

            var user = new User
            {
                Name = requestDto.Name,
                Surname = requestDto.Surname,
                Username = requestDto.Username,
                EmailAddress = requestDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(requestDto.Password),
                Role = int.Parse(Roles.User)
            };

            _userRepository.Add(user);
            _userRepository.Save();

            return Ok(user);
        }

        [HttpPost("addUser"), Authorize(Roles = Roles.Admin)]
        public ActionResult<User> AddUser([FromBody] AdminUserRegistration requestDto) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!new EmailAddressAttribute().IsValid(requestDto.Email)) { return BadRequest(new { Error = "Invalid email" }); }

            if (_userRepository.Get(u => u.Username == requestDto.Username).Any()) { return BadRequest(new { Error = "User with this username already exists" }); }
            
            if (_userRepository.Get(u => u.EmailAddress == requestDto.Email).Any()) { return BadRequest(new { Error = "User with this email already exists" }); }

            if (requestDto.Password.Length < 6) { return BadRequest(new { Error = "Password must be at least 6 characters" }); }

            var user = new User {
                Name = requestDto.Name,
                Surname = requestDto.Surname,
                Username = requestDto.Username,
                EmailAddress = requestDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(requestDto.Password),
                Role = int.Parse(requestDto.IsAdmin ? Roles.Admin : Roles.User)
            };

            _userRepository.Add(user);
            _userRepository.Save();

            return Ok(user);
        }

        [HttpPost("login")]
        public ActionResult<User> Login([FromBody] UserLogin request) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var user = _userRepository.Get(u => u.Username == request.Username).FirstOrDefault();
            if (user == null) {
                user = _userRepository.Get(u => u.EmailAddress == request.Username).FirstOrDefault();
            }

            if (user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Ok(new {
                    Token = _tokenService.CreateToken(user),
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
    }
}
