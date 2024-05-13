using backend.Data;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Web;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        private readonly IRepository<User> _userRepository;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        private const string WEB_CLIENT_KEY = "WebClient";

        public AuthController(IRepository<User> userRepository, ITokenService tokenService, IEmailService emailService, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _emailService = emailService;
            SeedData();
            _configuration = configuration;
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
                Role = int.Parse(Roles.User),
                LastLoginAt = DateTime.UtcNow,
                RegisteredAt = DateTime.UtcNow
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
                Role = int.Parse(requestDto.IsAdmin ? Roles.Admin : Roles.User),
                LastLoginAt = DateTime.UtcNow,
                RegisteredAt = DateTime.UtcNow
            };

            _userRepository.Add(user);
            _userRepository.Save();

            return Ok(user);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public ActionResult<User> Login([FromBody] UserLogin request) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var user = _userRepository.Get(u => u.Username == request.Username).FirstOrDefault();
            if (user == null) {
                user = _userRepository.Get(u => u.EmailAddress == request.Username).FirstOrDefault();
            }

            if (user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                user.LastLoginAt = DateTime.UtcNow;
                _userRepository.Save();

                return Ok(new {
                    Token = _tokenService.CreateJWTToken(user),
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

        [HttpPost("forgetPassword")]
        [AllowAnonymous]
        public ActionResult ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _userRepository.Get(u => u.EmailAddress == model.Email).FirstOrDefault();
                if (user != null)
                {
                    if(user.StampExpiresAt != null)
                    {
                        // Checks if token is less then 20 secounds old, if it is then ignores the request.
                        TimeSpan timeSpan = (DateTime)user.StampExpiresAt - DateTime.UtcNow;
                        if (timeSpan.TotalSeconds > 580)
                        {
                            return Ok();
                        }
                    } 
                    
                    var token = GenerateResetToken();
                    user.StampExpiresAt = DateTime.UtcNow.AddMinutes(10);
                    user.SecurityStamp = token;
                    _userRepository.Save();

                    string resetLink = $"{_configuration[WEB_CLIENT_KEY]}/resetpassword/{HttpUtility.UrlEncode(model.Email)}/{HttpUtility.UrlEncode(token)}";
                    _emailService.SendEmailAsync("Reset Password", "Please reset your password by clicking here: <a href=\"" + resetLink + "\">link</a>. The link is valid for 10 minutes.", model.Email);
                }
            }

            return Ok();
        }

        [HttpPost("validateToken")]
        [AllowAnonymous]
        public ActionResult ValidateToken([FromBody] ValidateTokenModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _userRepository.Get(u => u.EmailAddress == model.Email).FirstOrDefault();
                if (IsTokenValid(user, model.Token))
                {
                    return Ok(true);
                }
            }

            return Ok(false);
        }

        [HttpPost("resetPassword")]
        [AllowAnonymous]
        public ActionResult ResetPassword(ResetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.Password.Length < 6)
            { 
                return BadRequest(new { Error = "Password must be at least 6 characters" });
            }

            var user = _userRepository.Get(u => u.EmailAddress == model.Email).FirstOrDefault();
            if (user == null) {
                return Unauthorized();
            }

            if (!IsTokenValid(user, model.Token))
            {
                return Unauthorized(new { Error = "Invalid password reset token." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            user.SecurityStamp = null;
            user.StampExpiresAt = null;
            _userRepository.Save();

            return Ok("Password changed");
        }

        private bool IsTokenValid(User user, string token)
        {
            if (user != null)
            {
                var savedToken = user.SecurityStamp;
                var tokenExpiresAt = user.StampExpiresAt;

                //If valid token returns ok
                if (savedToken != null && tokenExpiresAt != null && tokenExpiresAt > DateTime.UtcNow && savedToken == token)
                {
                    return true;
                }
            }

            return false;
        }

        private string GenerateResetToken(int length = 112)
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var tokenData = new byte[length];
            rngCryptoServiceProvider.GetBytes(tokenData);
            return Convert.ToBase64String(tokenData);
        }
    }
}
