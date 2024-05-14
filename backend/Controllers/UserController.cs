using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using backend.Helpers;
using backend.Interfaces;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller 
    {
        private IRepository<User> _userRepository;
        private UserAccessor _userAccessor;

        public UserController(IRepository<User> userRepository, UserAccessor userAccessor)
        {
            _userRepository = userRepository;
            _userAccessor = userAccessor;
        }

        [HttpGet, Authorize]
        public ActionResult<UserData> GetUser() 
        {
            User? user = _userAccessor.GetUser(User);

            if (user == null) { return Unauthorized(); }

            return Ok(new UserData() {
                Id = user.UserId,
                Name = user.Name,
                Surname = user.Surname,
                EmailAddress = user.EmailAddress,
                Username = user.Username,
                Role = user.Role
            });
        }

        [HttpGet("GetAllUsers"), Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<IEnumerable<UserData>>> GetAllUser()
        {
            return await _userRepository.GetAll().Select(results => new UserData
            {
                Id = results.UserId,
                Name = results.Name,
                Surname = results.Surname,
                Username = results.Username,
                EmailAddress = results.EmailAddress,
                Role = results.Role
            }).ToListAsync();
        }

        [HttpPost("ChangeName"), Authorize]
        public ActionResult ChangeName([FromBody] UserNameChange requestDto)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            User? user = _userAccessor.GetUser(User);
            if (user == null) { return Unauthorized(); }


            user.Name = requestDto.Name;
            user.Surname = requestDto.Surname;
            _userRepository.Save();

            return Ok("Changes saved");
        }

        [HttpPost("ChangeUsername"), Authorize]
        public ActionResult ChangeUsername([FromBody] UserUsernameChange requestDto)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            User? user = _userAccessor.GetUser(User);
            if (user == null) { return Unauthorized(); }
            if (_userRepository.Get(u => u.Username == requestDto.Username).Any()) { return BadRequest(new { Error = "User with this username already exists" }); }

            user.Username = requestDto.Username;
            _userRepository.Save();

            return Ok("Changes saved");
        }

        [HttpPost("ChangeEmail"), Authorize]
        public ActionResult ChangeEmail([FromBody] UserEmailChange requestDto)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            User? user = _userAccessor.GetUser(User);
            if (user == null) { return Unauthorized(); }

            if (!new EmailAddressAttribute().IsValid(requestDto.Email)) { return BadRequest(new { Error = "Invalid email" }); }
            if (_userRepository.Get(u => u.EmailAddress == requestDto.Email).Any()) { return BadRequest(new { Error = "User with this email already exists" }); }

            user.EmailAddress = requestDto.Email;
            _userRepository.Save();

            return Ok("Changes saved");
        }

        [HttpPost("ChangePassword"), Authorize]
        public ActionResult ChangePassword([FromBody] UserPasswordChange requestDto) 
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            User? user = _userAccessor.GetUser(User);

            if (user == null) { return Unauthorized(); }

            if (!BCrypt.Net.BCrypt.Verify(requestDto.CurrentPassword, user.PasswordHash)) { return BadRequest(new { Error = "Incorrect current password" }); };
            if (requestDto.NewPassword.Length < 6) { return BadRequest(new { Error = "New password must be at least 6 characters" }); }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(requestDto.NewPassword);
            _userRepository.Save();

            return Ok("Changes saved");
        }

        [HttpPost("ChangeRole/{id}"), Authorize(Roles = Roles.Admin)]
        public ActionResult ChangeRole(int id, [FromBody] int role)
        {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState);
            }

            User? user = _userAccessor.GetUser(User);
            if (user is null) 
            { 
                return Unauthorized();
            }

            if (user.Role == 1)
            {
                User? changeUser = _userRepository.Get(p => p.UserId == id).FirstOrDefault();
                if (changeUser is null) { return BadRequest(); }
                changeUser.Role = role;
                _userRepository.Save();

                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete("DeleteUser"), Authorize]
        public ActionResult DeleteUser() 
        {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState);
            }

            User? user = _userAccessor.GetUser(User);
            if (user is null) 
            { 
                return Unauthorized(); 
            }

            _userRepository.Delete(user);
            _userRepository.Save();

            return Ok();
        }

        [HttpDelete("DeleteUser/{id}"), Authorize]
        public ActionResult DeleteUser(int id) {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState);
            }

            User? user = _userAccessor.GetUser(User);
            if (user is null) 
            { 
                return Unauthorized();
            }

            if (user.Role == 1) 
            {
                User? deleteUser = _userRepository.Get(p => p.UserId == id).FirstOrDefault();
                if (deleteUser is null) { return BadRequest(); }

                _userRepository.Delete(deleteUser);
                _userRepository.Save();

                return Ok();
            }
            else 
            {
                return BadRequest();
            }
        }
    }
}
