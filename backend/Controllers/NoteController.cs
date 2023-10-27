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
                if (user != null) { return user; }
            }

            return null;
        }

        [HttpGet("GetTitles"), Authorize]
        public async Task<ActionResult<IEnumerable<PageData>>> GetNotes() {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }

            return await _context.pages.Where(p => p.userId == user.Id)
                                       .Select(results => new PageData {
                                           pageId = results.pageId,
                                           title = results.title
                                       })
                                       .ToListAsync();
        }

        [HttpGet("GetBlockData/{id}"), Authorize]
        public async Task<ActionResult<IEnumerable<BlockGetData>>> GetPageData(string id) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }

            Page? page = _context.pages.FirstOrDefault(p => p.pageId == id);
            if (page is null) { return BadRequest(); }

            if (page.userId == user.Id) {
                return await _context.blocks
                    .Where(p => p.pageId == id)
                    .OrderBy(p => p.position)
                    .Select(results => new BlockGetData {
                        blockId = results.blockId,
                        type = results.type,
                        properties = results.properties
                    })
                    .ToListAsync();
            } else {
                return BadRequest();
            }
        }

        [HttpPost("AddPage"), Authorize]
        public async Task<ActionResult<Page>> AddPage([FromBody] PageData data) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }
            
            var page = new Page {
                pageId = data.pageId,
                title = data.title,
                userId = user.Id
            };

            _context.pages.Add(page);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("AddBlock"), Authorize]
        public async Task<ActionResult> AddBlock([FromBody] BlockData data) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }

            Page? page = _context.pages.FirstOrDefault(p => p.pageId == data.pageId);
            if (page is null) { return BadRequest(); }

            if (page.userId == user.Id) {
                _context.blocks.Where(c => c.pageId == data.pageId && c.position >= data.position)
                    .ToList()
                    .ForEach(a => a.position += 1);

                var block = new Block {
                    blockId = data.blockId,
                    type = data.type,
                    properties = data.properties,
                    position = data.position,
                    pageId = data.pageId
                };
                _context.blocks.Add(block);

                await _context.SaveChangesAsync();
                return Ok();
            } else {
                return BadRequest();
            }
        }

        [HttpPut("UpdateTitle"), Authorize]
        public async Task<ActionResult<User>> UpdatePage([FromBody] PageData data) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }
            
            Page? pages = _context.pages.FirstOrDefault(p => p.pageId == data.pageId);
            if (pages is null) { return BadRequest(); }

            if (pages.userId != user.Id) { return BadRequest(); }

            pages.title = data.title;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("UpdateBlock"), Authorize]
        public async Task<ActionResult> UpdatePage([FromBody] BlockData data) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }

            Page? page = _context.pages.FirstOrDefault(p => p.pageId == data.pageId);
            if (page is null) { return BadRequest(); }

            if (page.userId == user.Id) {
                Block? block = _context.blocks.FirstOrDefault(b => b.blockId == data.blockId);
                if (block is null) { return BadRequest(); }

                if (block.position > data.position)  {
                    _context.blocks.Where(c => c.pageId == data.pageId && c.position >= data.position && c.position < block.position)
                        .ToList()
                        .ForEach(a => a.position += 1);

                    block.position = data.position;
                } else if (block.position < data.position) {
                    _context.blocks.Where(c => c.pageId == data.pageId && c.position > block.position && c.position <= data.position)
                        .ToList()
                        .ForEach(a => a.position -= 1);

                    block.position = data.position;
                }
                block.type = data.type;
                block.properties = data.properties;

                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete("RemovePage/{id}"), Authorize]
        public async Task<ActionResult> RemovePage(string id) {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { await Console.Out.WriteLineAsync("No user"); return Unauthorized(); }
            

            Page? pages = _context.pages.FirstOrDefault(p => p.pageId == id);
            if (pages is null) { return BadRequest(); }

            if(pages.userId == user.Id) {
                _context.pages.Remove(pages);
                await _context.SaveChangesAsync();
                return Ok();
            } else {
                return BadRequest();
            }
        }

        [HttpDelete("RemoveBlock/{id}"), Authorize]
        public async Task<ActionResult> RemoveBlock(string id)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }

            Block? blocksToRemove = _context.blocks.FirstOrDefault(c => c.blockId == id);
            if (blocksToRemove is null) { return BadRequest(); }

            Page? page = _context.pages.FirstOrDefault(p => p.pageId == blocksToRemove.pageId);
            if (page is null) { return BadRequest(); }

            if (page.userId == user.Id)
            {
                _context.blocks.Where(c => c.pageId == page.pageId && c.position > blocksToRemove.position)
                .ToList()
                .ForEach(a => a.position -= 1);

                _context.blocks.Remove(blocksToRemove);
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
