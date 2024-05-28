using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using backend.Helpers;
using backend.Interfaces;
using backend.Services;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller 
    {
        private IRepository<User> _userRepository;
        private IRepository<Book> _bookRepository;
        private UserAccessor _userAccessor;

        public UserController(IRepository<User> userRepository,  UserAccessor userAccessor, IRepository<Book> bookRepository)
        {
            _userRepository = userRepository;
            _userAccessor = userAccessor;
            _bookRepository = bookRepository;
        }

        [HttpGet, Authorize]
        public ActionResult<UserData> GetUser() 
        {
            User? user = _userAccessor.GetUser(User);

            if (user == null)
            { 
                return Unauthorized();
            }

            return Ok(new UserData() {
                Id = user.UserId,
                Name = user.Name,
                Surname = user.Surname,
                EmailAddress = user.EmailAddress,
                Username = user.Username,
                LastLoginAt = user.LogedInAt,
                RegisteredAt = user.RegisteredAt,
                Role = user.Role
            });
        }

        [HttpGet("GetAllUsers"), Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<IEnumerable<UserData>>> GetAllUser()
        {
            return await _userRepository.GetAll().Include(u => u.Books).Select(user => new UserData
            {
                Id = user.UserId,
                Name = user.Name,
                Surname = user.Surname,
                Username = user.Username,
                EmailAddress = user.EmailAddress,
                LastLoginAt = user.LogedInAt,
                RegisteredAt = user.RegisteredAt,
                Role = user.Role
            }).ToListAsync();
        }

        [HttpPost("ChangeName"), Authorize]
        public ActionResult ChangeName([FromBody] UserNameChange requestDto)
        {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState); 
            }

            User? user = _userAccessor.GetUser(User);
            if (user == null) 
            { 
                return Unauthorized();
            }


            user.Name = requestDto.Name;
            user.Surname = requestDto.Surname;
            _userRepository.Save();

            return Ok("Changes saved");
        }

        [HttpPost("ChangeUsername"), Authorize]
        public ActionResult ChangeUsername([FromBody] UserUsernameChange requestDto)
        {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState);
            }

            User? user = _userAccessor.GetUser(User);
            if (user == null)
            { 
                return Unauthorized();
            }

            if (_userRepository.Get(u => u.Username == requestDto.Username).Any()) 
            {
                return BadRequest(new { Error = "User with this username already exists" });
            }

            user.Username = requestDto.Username;
            _userRepository.Save();

            return Ok("Changes saved");
        }

        [HttpPost("ChangeEmail"), Authorize]
        public ActionResult ChangeEmail([FromBody] UserEmailChange requestDto)
        {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState);
            }

            User? user = _userAccessor.GetUser(User);
            if (user == null) 
            {
                return Unauthorized();
            }

            if (!new EmailAddressAttribute().IsValid(requestDto.Email)) 
            {
                return BadRequest(new { Error = "Invalid email" });
            }

            if (_userRepository.Get(u => u.EmailAddress == requestDto.Email).Any()) 
            {
                return BadRequest(new { Error = "User with this email already exists" });
            }

            user.EmailAddress = requestDto.Email;
            _userRepository.Save();

            return Ok("Changes saved");
        }

        [HttpPost("ChangePassword"), Authorize]
        public ActionResult ChangePassword([FromBody] UserPasswordChange requestDto) 
        {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState); 
            }

            User? user = _userAccessor.GetUser(User);
            if (user == null) 
            {
                return Unauthorized(); 
            }

            if (!BCrypt.Net.BCrypt.Verify(requestDto.CurrentPassword, user.PasswordHash)) 
            { 
                return BadRequest(new { Error = "Incorrect current password" });
            };

            if (requestDto.NewPassword.Length < 6)
            { 
                return BadRequest(new { Error = "New password must be at least 6 characters" }); 
            }

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

            User? user;
            if (role == 1)
            {
                user = _userRepository.Get(p => p.UserId == id)
                    .Include(u => u.Books)
                    .ThenInclude(b => b.Pages)
                    .ThenInclude(p => p.Blocks)
                    .ThenInclude(b => b.File)
                    .FirstOrDefault();

                if (user is null)
                {
                    return BadRequest();
                }

                // Delete all files stored in the upload folder
                var userFiles = user.Books
                    .SelectMany(b => b.Pages)
                    .SelectMany(p => p.Blocks)
                    .Select(b => b.File)
                    .ToList();

                DeleteFiles(userFiles);

                foreach (var book in user.Books)
                {
                    _bookRepository.Delete(book);
                    _bookRepository.Save();
                }
            }
            else
            {
                user = _userRepository.Get(p => p.UserId == id).Include(u => u.Books).FirstOrDefault();

                if (user is null)
                {
                    return BadRequest();
                }
            }

            user.Role = role;
            _userRepository.Save();

            return Ok();
        }

        [HttpDelete("DeleteUserNotes/{id}"), Authorize(Roles = Roles.Admin)]
        public ActionResult DeleteUserNotes(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User? user = _userRepository.Get(p => p.UserId == id)
                .Include(u => u.Books)
                .ThenInclude(b => b.Pages)
                .ThenInclude(p => p.Blocks)
                .ThenInclude(b => b.File)
                .FirstOrDefault();

            if (user is null)
            {
                return BadRequest();
            }

            // Delete all files stored in the upload folder
            var userFiles = user.Books
                .SelectMany(b => b.Pages)
                .SelectMany(p => p.Blocks)
                .Select(b => b.File)
                .ToList();

            DeleteFiles(userFiles);

            // Delete user note data
            foreach (var book in user.Books)
            {
                _bookRepository.Delete(book);
                _bookRepository.Save();
            }

            return Ok();
        }

        [HttpDelete("DeleteUser"), Authorize]
        public async Task<ActionResult> DeleteUser() 
        {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            User? user = _userRepository.Get(p => p.UserId.ToString() == userId)
                .Include(u => u.Books)
                .ThenInclude(b => b.Pages)
                .ThenInclude(p => p.Blocks)
                .ThenInclude(b => b.File)
                .FirstOrDefault();

            if (user is null) 
            { 
                return Unauthorized(); 
            }

            // Delete all files stored in the upload folder
            var userFiles = user.Books
                .SelectMany(b => b.Pages)
                .SelectMany(p => p.Blocks)
                .Select(b => b.File)
                .ToList();

            DeleteFiles(userFiles);

            _userRepository.Delete(user);
            _userRepository.Save();

            return Ok();
        }

        [HttpDelete("DeleteUser/{id}"), Authorize(Roles = Roles.Admin)]
        public ActionResult DeleteUser(int id) {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(ModelState);
            }

            User? user = _userRepository.Get(p => p.UserId == id)
                .Include(u => u.Books)
                .ThenInclude(b => b.Pages)
                .ThenInclude(p => p.Blocks)
                .ThenInclude(b => b.File)
                .FirstOrDefault();

            if (user is null)
            {
                return BadRequest();
            }

            // Delete all files stored in the upload folder
            var userFiles = user.Books
                .SelectMany(b => b.Pages)
                .SelectMany(p => p.Blocks)
                .Select(b => b.File)
                .ToList();

            DeleteFiles(userFiles);

            _userRepository.Delete(user);
            _userRepository.Save();

            return Ok();
        }

        private void DeleteFiles(List<StoredFile> files)
        {
            foreach (var file in files)
            {
                if(file != null)
                {
                    var extension = "." + file.Filename.Split('.')[file.Filename.Split('.').Length - 1];
                    string filename = file.BlockId + extension;

                    var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", filename);

                    if (System.IO.File.Exists(filepath))
                    {
                        System.IO.File.Delete(filepath);
                    }
                }
            }
        }
    }
}
