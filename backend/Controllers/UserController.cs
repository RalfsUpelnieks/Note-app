using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller {
        private readonly DataContext _context;

        public UserController(DataContext context) {
            _context = context;
        }

        private User? GetCurrentUser() {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId != null){
                var user = _context.users.FirstOrDefault(u => u.Id.ToString() == userId);
                if (user != null) return user;
            }

            return null;
        }

        [HttpGet, Authorize]
        public ActionResult<UserData> GetUser() {
            User? user = GetCurrentUser();

            if (user == null) { return Unauthorized(); }

            return Ok(new UserData() {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                EmailAddress = user.EmailAddress,
                Username = user.Username,
                Role = user.Role
            });

        }

        [HttpPost("ChangeName"), Authorize]
        public ActionResult<User> ChangeName([FromBody] UserNameChange requestDto) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            User? user = GetCurrentUser();
            if (user == null) { return Unauthorized(); }


            user.Name = requestDto.Name;
            user.Surname = requestDto.Surname;
            _context.SaveChanges();

            return Ok("Changes saved");
        }

        [HttpPost("ChangeUsername"), Authorize]
        public ActionResult<User> ChangeUsername([FromBody] UserUsernameChange requestDto) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            User? user = GetCurrentUser();
            if (user == null) { return Unauthorized(); }
            if (_context.users.Any(u => u.Username == requestDto.Username)) { return BadRequest(new { Error = "User with this username already exists" }); }

            user.Username = requestDto.Username;
            _context.SaveChanges();

            return Ok("Changes saved");
        }

        [HttpPost("ChangeEmail"), Authorize]
        public ActionResult<User> ChangeEmail([FromBody] UserEmailChange requestDto) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            User? user = GetCurrentUser();
            if (user == null) { return Unauthorized(); }

            if (!new EmailAddressAttribute().IsValid(requestDto.Email)) { return BadRequest(new { Error = "Invalid email" }); }
            if (_context.users.Any(u => u.EmailAddress == requestDto.Email)) { return BadRequest(new { Error = "User with this email already exists" }); }

            user.EmailAddress = requestDto.Email;
            _context.SaveChanges();

            return Ok("Changes saved");
        }

        [HttpPost("ChangePassword"), Authorize]
        public ActionResult<User> ChangePassword([FromBody] UserPasswordChange requestDto) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            User? user = GetCurrentUser();
            if (user == null) { return Unauthorized(); }

            if (!BCrypt.Net.BCrypt.Verify(requestDto.CurrentPassword, user.PasswordHash)) { return BadRequest(new { Error = "Incorrect current password" }); };
            if (requestDto.NewPassword.Length < 6) { return BadRequest(new { Error = "New password must be at least 6 characters" }); }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(requestDto.NewPassword);
            _context.SaveChanges();

            return Ok("Changes saved");
        }

        [HttpGet("GetAllUsers"), Authorize(Roles = "1")]
        public async Task<ActionResult<IEnumerable<UserData>>> GetAllUser() {
            return await _context.users.Select(results => new UserData {
                                           Id = results.Id,
                                           Name = results.Name,
                                           Surname = results.Surname,
                                           Username = results.Username,
                                           EmailAddress = results.EmailAddress,
                                           Role = results.Role 
                                       })
                                       .ToListAsync();
        }

        [HttpDelete("DeleteUser"), Authorize]
        public async Task<ActionResult> DeleteUser() {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }

            _context.users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteUser/{id}"), Authorize]
        public async Task<ActionResult> DeleteUser(int id) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }

            if (user.Role == 1) {
                User? deleteUser = _context.users.FirstOrDefault(p => p.Id == id);
                if (deleteUser is null) { return BadRequest(); }
                _context.users.Remove(deleteUser);
                await _context.SaveChangesAsync();
                return Ok();
            }
            else {
                return BadRequest();
            }
        }
    }
}
