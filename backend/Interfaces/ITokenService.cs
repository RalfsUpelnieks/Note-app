using backend.Data;

namespace backend.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
