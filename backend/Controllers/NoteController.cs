using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class NoteController : Controller
    {
        private readonly DataContext _context;

        public NoteController(DataContext context) {
            _context = context;
        }

        private User? GetCurrentUser() {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId != null) {
                var user = _context.users.FirstOrDefault(u => u.Id.ToString() == userId);
                if (user != null) return user;
            }

            return null;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PageData>>> GetNotes() {
            User? user = GetCurrentUser();
            if (user == null) return Unauthorized();

            //return list of pages
            return await _context.pages.Where(p => p.userId == user.Id).Select(results => new PageData { pageId = results.pageId, title = results.title }).ToListAsync();
        }

        [HttpPost("AddPage")]
        [Authorize]
        public async Task<ActionResult<User>> AddPage([FromBody] PageSubmit data) {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            User? user = GetCurrentUser();
            if (user is null) return Unauthorized();
            if (_context is null) return BadRequest();

            var page = new Page {
                pageId = data.pageId,
                title = data.title,
                userId = user.Id
            };
            _context.pages.Add(page);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("UpdatePage")]
        [Authorize]
        public async Task<ActionResult<User>> UpdatePage([FromBody] PageSubmit data) {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            User? user = GetCurrentUser();
            if (user is null) return Unauthorized();
            if (_context is null) return BadRequest();

            Page? pages = _context.pages.FirstOrDefault(p => p.pageId == data.pageId);
            if (pages is null) return BadRequest();

            pages.title = data.title;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("Remove/{id}")]
        [Authorize]
        public async Task<ActionResult> RemovePage(string id) {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            User? user = GetCurrentUser();
            if (user is null) return Unauthorized();
            if (_context.pages is null) return BadRequest();

            Page? pages = _context.pages.FirstOrDefault(p => p.pageId == id);
            if (pages is null) return BadRequest();
            if(pages.userId == user.Id) {
                _context.pages.Remove(pages);
                await _context.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
