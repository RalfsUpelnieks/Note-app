using backend.Data;

namespace backend.Interfaces
{
    public interface ITokenService
    {
        string CreateJWTToken(User user);
    }
}
