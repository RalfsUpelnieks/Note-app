using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace backend.Controllers
{
    public class UserController : Controller
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        private User? GetCurrentUser() {
            var userIdentity = User.Identity;


            if (userIdentity != null){
                var user = _context.users.FirstOrDefault(u => u.EmailAddress == userIdentity.Name);

                if(user != null){
                    return user;
                }
            }

            return null;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<UserData> GetUser()
        {
            User? user = GetCurrentUser();
            if (user == null) return Unauthorized();
            return new UserData()
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                EmailAddress = user.EmailAddress,
                Role = user.Role
            };

        }
    }
}
