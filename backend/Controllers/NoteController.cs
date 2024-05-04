using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Interfaces;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NoteController : Controller
    {
        private IRepository<Book> _bookRepository;
        private IRepository<Page> _pageRepository;
        private IRepository<Block> _blockRepository;
        private UserAccessor _userAccessor;

        public NoteController(IRepository<Book> bookRepository, IRepository<Page> pageRepository, IRepository<Block> blockRepository, UserAccessor userAccessor)
        {
            _bookRepository = bookRepository;
            _pageRepository = pageRepository;
            _blockRepository = blockRepository;
            _userAccessor = userAccessor;
        }

        private int PositionCheck(int position, int minAllowed, int maxAllowed)
        {
            if (position < minAllowed)
            {
                return minAllowed;
            }

            if (position > maxAllowed)
            {
                return maxAllowed;
            }

            return position;
        }

        [HttpGet("GetBookData"), Authorize]
        public async Task<ActionResult<IEnumerable<GetBookData>>> GetBookData() 
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

            return await _bookRepository.Get(p => p.UserId == user.UserId)
                .OrderBy(b => b.Position)
                .Include(b => b.Pages)
                .Select(book => new GetBookData
                {
                    BookId = book.BookId,
                    Title = book.Title,
                    Description = book.Description,
                    Color = book.Color,
                    Pages = book.Pages.OrderBy(p => p.Position)
                        .Select(page => new GetPageData { 
                            PageId = page.PageId,
                            Title = page.Title,
                            CreatedAt = page.CreatedAt,
                            LastUpdatedAt = page.LastUpdatedAt
                        }).ToList(),
                    CreatedAt = book.CreatedAt,
                    LastUpdatedAt = book.LastUpdatedAt
                })
                .ToListAsync();
        }

        [HttpGet("GetPageData/{id}"), Authorize]
        public async Task<ActionResult<IEnumerable<GetBlockData>>> GetPageData(string id)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            User? user = _userAccessor.GetUser(User);
            if (user is null) {
                return Unauthorized();
            }

            Page? page = _pageRepository.Get(p => p.PageId == id).Include(p => p.Book).FirstOrDefault();
            if (page is null) 
            { 
                return BadRequest();
            }

            if (page.Book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            return await _blockRepository.Get(p => p.PageId == id)
                .OrderBy(b => b.Position)
                .Select(results => new GetBlockData
                {
                    BlockId = results.BlockId,
                    Type = results.Type,
                    Properties = results.Properties,
                })
                .ToListAsync();
        }

        [HttpPost("AddBook"), Authorize]
        public ActionResult AddBook([FromBody] UpdateBookData data)
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

            IQueryable<Book> Books = _bookRepository.Get(b => b.UserId == user.UserId);

            int minPositionAllowed = 1;
            int maxPositionAllowed = Books.Count() + 1;
            int position = PositionCheck(data.Position, minPositionAllowed, maxPositionAllowed);

            Books.Where(b => b.Position >= position)
                .ToList()
                .ForEach(a => a.Position += 1);

            var book = new Book
            {
                BookId = data.BookId,
                Title = data.Title,
                Description = data.Description,
                Position = position,
                Color = data.Color,
                UserId = user.UserId,
                CreatedAt = DateTime.UtcNow,
                LastUpdatedAt = DateTime.UtcNow
            };

            _bookRepository.Add(book);
            _bookRepository.Save();

            return Ok();
        }

        [HttpPost("AddPage"), Authorize]
        public ActionResult AddPage([FromBody] PageData data)
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

            Book? book = _bookRepository.Get(b => b.BookId == data.BookId).Include(b => b.Pages).FirstOrDefault();
            if (book is null)
            {
                return BadRequest();
            }

            if (book.UserId != user.UserId) 
            { 
                return Unauthorized();
            }

            int minPositionAllowed = 1;
            int maxPositionAllowed = book.Pages.Count + 1;
            int position = PositionCheck(data.Position, minPositionAllowed, maxPositionAllowed);

            book.Pages.Where(b => b.Position >= position)
                .ToList()
                .ForEach(a => a.Position += 1);

            var page = new Page
            {
                PageId = data.PageId,
                Title = data.Title,
                Position = position,
                BookId = data.BookId,
                CreatedAt = DateTime.UtcNow,
                LastUpdatedAt = DateTime.UtcNow
            };

            book.LastUpdatedAt = DateTime.UtcNow;

            _pageRepository.Add(page);
            _pageRepository.Save();

            return Ok();
        }

        [HttpPost("AddBlock"), Authorize]
        public ActionResult AddBlock([FromBody] BlockData data)
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

            Page? page = _pageRepository.Get(p => p.PageId == data.PageId).Include(p => p.Book).Include(p => p.Blocks).FirstOrDefault();
            if (page is null)
            {
                return BadRequest();
            }

            if (page.Book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            int minPositionAllowed = 1;
            int maxPositionAllowed = page.Blocks.Count + 1;
            int position = PositionCheck(data.Position, minPositionAllowed, maxPositionAllowed);

            page.Blocks.Where(b => b.Position >= position)
                .ToList()
                .ForEach(a => a.Position += 1);

            var block = new Block
            {
                BlockId = data.BlockId,
                Type = data.Type,
                Properties = data.Properties,
                Position = position,
                PageId = data.PageId
            };

            page.Book.LastUpdatedAt = DateTime.UtcNow;
            page.LastUpdatedAt = DateTime.UtcNow;

            _blockRepository.Add(block);
            _blockRepository.Save();

            return Ok();
        }

        [HttpPut("UpdateBook"), Authorize]
        public ActionResult UpdateBook([FromBody] UpdateBookData data)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            User? user = _userAccessor.GetUser(User);
            if (user is null) 
            { 
                return Unauthorized();
            }

            IQueryable<Book> userBooks = _bookRepository.Get(b => b.UserId == user.UserId);

            Book? book = userBooks.Where(p => p.BookId == data.BookId).FirstOrDefault();
            if (book is null) 
            {
                return BadRequest();
            }

            if (book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            if (data.Position != -1)
            {
                int minPositionAllowed = 1;
                int maxPositionAllowed = userBooks.Count() + 1;

                int position = PositionCheck(data.Position, minPositionAllowed, maxPositionAllowed);

                if (book.Position > position)
                {
                    userBooks.Where(c => c.Position >= position && c.Position < book.Position)
                        .ToList()
                        .ForEach(a => a.Position += 1);
                }
                else if (book.Position < position)
                {
                    userBooks.Where(c => c.Position > book.Position && c.Position <= position)
                        .ToList()
                        .ForEach(a => a.Position -= 1);
                }

                book.Position = position;
            }

            book.Title = data.Title;
            book.Description = data.Description;
            book.Color = data.Color;
            book.LastUpdatedAt = DateTime.UtcNow;

            _bookRepository.Update(book);
            _bookRepository.Save();

            return Ok();
        }
        
        [HttpPut("UpdatePage"), Authorize]
        public ActionResult UpdatePage([FromBody] PageData data)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            User? user = _userAccessor.GetUser(User);
            if (user is null)
            {
                return Unauthorized();
            }

            Page? page = _pageRepository.Get(c => c.PageId == data.PageId).Include(p => p.Book).ThenInclude(b => b.Pages).FirstOrDefault();
            if (page is null)
            {
                return BadRequest();
            }

            if (page.Book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            if (page.BookId != data.BookId)
            {
                Book? newBook = _bookRepository.Get(b => b.BookId == data.BookId).Include(b => b.Pages).FirstOrDefault();

                if (newBook is null)
                {
                    return BadRequest();
                }

                //Changes positions for old books pages
                _pageRepository.Get(c => c.BookId == page.BookId && c.Position > page.Position)
                .ToList()
                .ForEach(a => a.Position -= 1);

                //Changes positions for new books pages
                int minPositionAllowed = 1;
                int maxPositionAllowed = newBook.Pages.Count + 1;
                int position = PositionCheck(data.Position, minPositionAllowed, maxPositionAllowed);

                newBook.Pages.Where(b => b.Position >= position)
                    .ToList()
                    .ForEach(a => a.Position += 1);

                page.BookId = data.BookId;
                page.Position = position;
            }
            else if(data.Position != -1)
            {
                int minPositionAllowed = 1;
                int maxPositionAllowed = page.Book.Pages.Count + 1;

                int position = PositionCheck(data.Position, minPositionAllowed, maxPositionAllowed);

                if (page.Position > position)
                {
                    page.Book.Pages.Where(p => p.Position >= position && p.Position < page.Position)
                        .ToList()
                        .ForEach(a => a.Position += 1);
                }
                else if (page.Position < position)
                {
                    page.Book.Pages.Where(p => p.Position > page.Position && p.Position <= position)
                        .ToList()
                        .ForEach(a => a.Position -= 1);
                }

                page.Position = position;
            }
            
            page.Title = data.Title;
            page.LastUpdatedAt = DateTime.UtcNow;
            page.Book.LastUpdatedAt = DateTime.UtcNow;

            _pageRepository.Save();

            return Ok();
        }


        [HttpPut("UpdateBlock"), Authorize]
        public ActionResult UpdateBlock([FromBody] BlockData data)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            User? user = _userAccessor.GetUser(User);
            if (user is null) 
            {
                return Unauthorized();
            }

            Block? block = _blockRepository.Get(c => c.BlockId == data.BlockId).Include(b => b.Page).ThenInclude(p => p.Blocks).Include(b => b.Page).ThenInclude(p => p.Book).FirstOrDefault();
            if (block is null)
            {
                return BadRequest();
            }

            if (block.Page.Book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            if (data.Position != -1)
            {
                int minPositionAllowed = 1;
                int maxPositionAllowed = block.Page.Blocks.Count + 1;
                int position = PositionCheck(data.Position, minPositionAllowed, maxPositionAllowed);

                if (block.Position > position)
                {
                    block.Page.Blocks.Where(b => b.Position >= position && b.Position < block.Position)
                        .ToList()
                        .ForEach(a => a.Position += 1);
                }
                else if (block.Position < position)
                {
                    block.Page.Blocks.Where(b => b.Position > block.Position && b.Position <= position)
                        .ToList()
                        .ForEach(a => a.Position -= 1);
                }

                block.Position = position;
            }

            block.Type = data.Type;
            block.Properties = data.Properties;

            block.Page.Book.LastUpdatedAt = DateTime.UtcNow;
            block.Page.LastUpdatedAt = DateTime.UtcNow;

            _blockRepository.Save();
            return Ok();
        }

        [HttpDelete("RemoveBook/{id}"), Authorize]
        public ActionResult RemoveBook(string id)
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

            Book? book = _bookRepository.Get(p => p.BookId == id).FirstOrDefault();
            if (book is null)
            {
                return BadRequest();
            }

            if (book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            _bookRepository.Get(b => b.UserId == book.UserId && b.Position > book.Position)
                .ToList()
                .ForEach(a => a.Position -= 1);

            _bookRepository.Delete(book);
            _bookRepository.Save();

            return Ok();
        }

        [HttpDelete("RemovePage/{id}"), Authorize]
        public ActionResult RemovePage(string id)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            User? user = _userAccessor.GetUser(User);
            if (user is null) 
            {  
                return Unauthorized();
            }

            Page? pageToRemove = _pageRepository.Get(p => p.PageId == id).Include(p => p.Book).FirstOrDefault();
            if (pageToRemove is null) 
            { 
                return BadRequest();
            }

            if (pageToRemove.Book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            _pageRepository.Get(c => c.BookId == pageToRemove.BookId && c.Position > pageToRemove.Position)
                .ToList()
                .ForEach(a => a.Position -= 1);

            pageToRemove.Book.LastUpdatedAt = DateTime.UtcNow;

            _pageRepository.Delete(pageToRemove);
            _pageRepository.Save();

            return Ok();
        }

        [HttpDelete("RemoveBlock/{id}"), Authorize]
        public ActionResult RemoveBlock(string id)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            User? user = _userAccessor.GetUser(User);
            if (user is null) 
            {
                return Unauthorized();
            }

            Block? blockToRemove = _blockRepository.Get(c => c.BlockId == id).Include(b => b.Page).ThenInclude(p => p.Book).FirstOrDefault();
            if (blockToRemove is null) {
                return BadRequest();
            }

            if (blockToRemove.Page.Book.UserId != user.UserId)
            {
                return Unauthorized();
            }

            _blockRepository.Get(c => c.PageId == blockToRemove.PageId && c.Position > blockToRemove.Position)
                .ToList()
                .ForEach(a => a.Position -= 1);

            blockToRemove.Page.Book.LastUpdatedAt = DateTime.UtcNow;
            blockToRemove.Page.LastUpdatedAt = DateTime.UtcNow;

            _blockRepository.Delete(blockToRemove);
            _blockRepository.Save();

            return Ok();
        }
    }
}
