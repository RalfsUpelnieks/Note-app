using backend.Data;
using backend.Interfaces;
using System.Security.Claims;

namespace backend.Services
{
    public sealed class UserAccessor
    {
        private readonly IRepository<User> _userRepository;

        public UserAccessor(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public User? GetUser(ClaimsPrincipal userPrinciple)
        {
            var userId = userPrinciple.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId != null)
            {
                var user = _userRepository.Get(u => u.UserId.ToString() == userId).FirstOrDefault();
                if (user != null)
                {
                    return user;
                }
            }

            return null;
        }
    }
}
