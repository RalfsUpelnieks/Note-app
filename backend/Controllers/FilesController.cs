using backend.Data;
using backend.Interfaces;
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

        [HttpDelete("DeleteFile/{id}"), Authorize]
        public IActionResult DeleteFile(string id)
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
