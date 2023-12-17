using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.Security.Claims;

namespace FileUploadDownload.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly DataContext _context;

        public FilesController(DataContext context)
        {
            _context = context;
        }

        private User? GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId != null)
            {
                var user = _context.users.FirstOrDefault(u => u.Id.ToString() == userId);
                if (user != null) { return user; }
            }

            return null;
        }


        [HttpPost("UploadFile"), Authorize]
        public async Task<IActionResult> WriteFile([FromForm] string id, IFormFile file)
        {
            try
            {
                if (!ModelState.IsValid) { return BadRequest(ModelState); }
                if (_context is null) { return BadRequest(); }

                User? user = GetCurrentUser();
                if (user is null) { return Unauthorized(); }

                Block? block = _context.blocks.FirstOrDefault(b => b.blockId == id);
                if (block is null) { return BadRequest(); }

                Page? page = _context.pages.FirstOrDefault(p => p.pageId == block.pageId);
                if (page is null) { return BadRequest(); }

                if (page.userId == user.Id)
                {
                    var fileData = new Files
                    {
                        blockId = id,
                        filename = file.FileName,
                        url = "Upload\\Files",
                        size = file.Length,
                        Block = block
                    };

                    var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                    string filename = id + extension;

                    var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files");

                    if (!Directory.Exists(filepath))
                    {
                        Directory.CreateDirectory(filepath);
                    }

                    var exactpath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", filename);
                    using (var stream = new FileStream(exactpath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    _context.files.Add(fileData);
                    _context.SaveChanges();

                    return Ok();
                } else { return Unauthorized(); }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [Route("DownloadFile/{id}")]
        [HttpPost("DownloadFile"), Authorize]
        public async Task<IActionResult> DownloadFile(string id)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            if (_context is null) { return BadRequest(); }

            User? user = GetCurrentUser();
            if (user is null) { return Unauthorized(); }

            Block? block = _context.blocks.FirstOrDefault(b => b.blockId == id);
            if (block is null) { return BadRequest(); }

            Page? page = _context.pages.FirstOrDefault(p => p.pageId == block.pageId);
            if (page is null) { return BadRequest(); }

            if (page.userId == user.Id)
            {

                Files? file = _context.files.FirstOrDefault(p => p.blockId == id);
                if (page is null) { return BadRequest(); }

                var extension = "." + file.filename.Split('.')[file.filename.Split('.').Length - 1];
                string filename = id + extension;

                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", filename);

                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(filepath, out var contenttype))
                {
                    contenttype = "application/octet-stream";
                }

                var bytes = await System.IO.File.ReadAllBytesAsync(filepath);
                return File(bytes, contenttype, Path.GetFileName(filepath));

            }
            return BadRequest();
        }

        [HttpPost("DeleteFile/{id}"), Authorize]
        public async Task<IActionResult> DeleteFile(string id)
        {
            try
            {
                if (!ModelState.IsValid) { return BadRequest(ModelState); }
                if (_context is null) { return BadRequest(); }

                User? user = GetCurrentUser();
                if (user is null) { return Unauthorized(); }

                Block? block = _context.blocks.FirstOrDefault(b => b.blockId == id);
                if (block is null) { return BadRequest(); }

                Page? page = _context.pages.FirstOrDefault(p => p.pageId == block.pageId);
                if (page is null) { return BadRequest(); }

                if (page.userId == user.Id)
                {
                    return Ok();
                }
                else { return Unauthorized(); }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
