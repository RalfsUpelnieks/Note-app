using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

        [HttpGet]
        [Authorize]
        public ActionResult<UserData> GetUser() {
            User? user = GetCurrentUser();
            if (user == null) { return Unauthorized();}
            return Ok(new UserData() {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                EmailAddress = user.EmailAddress,
                Role = user.Role
            });

        }
    }
}
