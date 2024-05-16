using backend.Data;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace FileUploadDownload.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private IRepository<Block> _blockRepository;
        private IRepository<StoredFile> _fileRepository;
        private UserAccessor _userAccessor;
        
        public FilesController(IRepository<Block> blockRepository, IRepository<StoredFile> fileRepository, UserAccessor userAccessor)
        {
            _blockRepository = blockRepository;
            _fileRepository = fileRepository;
            _userAccessor = userAccessor;
        }

        [HttpGet("GetAllFiles"), Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<IEnumerable<FileData>>> GetFiles()
        {
            return await _fileRepository.GetAll()
                .OrderBy(b => b.CreatedAt)
                .Include(f => f.Block)
                .ThenInclude(b => b.Page)
                .ThenInclude(p => p.Book)
                .ThenInclude(b => b.User)
                .Select(file => new FileData
                {
                    BlockId = file.BlockId,
                    OwnersUsername = file.Block.Page.Book.User.Username,
                    Filename = file.Filename,
                    Size = file.Size,
                    CreatedAt = file.CreatedAt
                })
                .ToListAsync();
        }


        [HttpPost("UploadFile"), Authorize]
        public async Task<IActionResult> WriteFile([FromForm] string id, IFormFile file)
        {
            try
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

                Block? block = _blockRepository.Get(b => b.BlockId == id)
                    .Include(b => b.Page)
                    .ThenInclude(p => p.Book)
                    .FirstOrDefault();

                if (block is null) 
                { 
                    return BadRequest();
                }

                if (block.Page.Book.UserId != user.UserId)
                {
                    return Unauthorized();
                }

                var fileData = new StoredFile
                {
                    BlockId = id,
                    Filename = file.FileName,
                    Location = "Upload\\Files",
                    Size = file.Length,
                    Block = block,
                    CreatedAt = DateTime.UtcNow,
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

                _fileRepository.Add(fileData);
                _fileRepository.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("DownloadFile/{id}")]
        [HttpGet("DownloadFile"), Authorize]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> DownloadFile(string id)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            User? user = _userAccessor.GetUser(User);
            if (user is null) { return Unauthorized(); }

            Block? block = _blockRepository.Get(b => b.BlockId == id)
                    .Include(b => b.File)
                    .Include(b => b.Page)
                    .ThenInclude(p => p.Book)
                    .FirstOrDefault();

            if (block is null || block.File is null)
            {
                return BadRequest();
            }

            if (block.Page.Book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            var extension = "." + block.File.Filename.Split('.')[block.File.Filename.Split('.').Length - 1];
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

        [HttpDelete("DeleteUsersFile/{id}"), Authorize]
        public IActionResult DeleteUsersFile(string id)
        {
            try
            {
                User? user = _userAccessor.GetUser(User);
                if (user is null) 
                { 
                    return Unauthorized();
                }

                Block? block = _blockRepository.Get(b => b.BlockId == id)
                    .Include(b => b.File)
                    .Include(b => b.Page)
                    .ThenInclude(p => p.Book)
                    .FirstOrDefault();

                if (block is null || block.File is null)
                {
                    return BadRequest();
                }

                if (block.Page.Book.UserId != user.UserId)
                {
                    return Unauthorized();
                }

                var extension = "." + block.File.Filename.Split('.')[block.File.Filename.Split('.').Length - 1];
                string filename = id + extension;

                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", filename);

                if (System.IO.File.Exists(filepath))
                {
                    System.IO.File.Delete(filepath);
                }
                else
                {
                    return NotFound();
                }

                block.Properties = "{\"text\":\"\"}";

                _fileRepository.Delete(block.File);
                _fileRepository.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteFile/{id}"), Authorize(Roles = Roles.Admin)]
        public IActionResult DeleteFile(string id)
        {
            try
            {
                User? user = _userAccessor.GetUser(User);
                if (user is null)
                {
                    return Unauthorized();
                }

                Block? block = _blockRepository.Get(b => b.BlockId == id)
                    .Include(b => b.File)
                    .Include(b => b.Page)
                    .ThenInclude(p => p.Book)
                    .FirstOrDefault();

                if (block is null || block.File is null)
                {
                    return BadRequest();
                }

                var extension = "." + block.File.Filename.Split('.')[block.File.Filename.Split('.').Length - 1];
                string filename = id + extension;

                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", filename);

                if (System.IO.File.Exists(filepath))
                {
                    System.IO.File.Delete(filepath);
                }
                else
                {
                    return NotFound();
                }

                block.Properties = "{\"text\":\"\"}";

                _fileRepository.Delete(block.File);
                _fileRepository.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
