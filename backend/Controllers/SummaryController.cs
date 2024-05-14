using backend.Data;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    public class SummaryController
    {
        private IRepository<User> _userRepository;
        private IRepository<Book> _bookRepository;
        private IRepository<Page> _pageRepository;
        private IRepository<Block> _blockRepository;
        private IRepository<StoredFile> _fileRepository;

        public SummaryController(IRepository<User> userRepository, IRepository<Book> bookRepository, IRepository<Page> pageRepository, IRepository<Block> blockRepository, IRepository<StoredFile> fileRepository)
        {
            _userRepository = userRepository;
            _bookRepository = bookRepository;
            _pageRepository = pageRepository;
            _blockRepository = blockRepository;
            _fileRepository = fileRepository;
        }

        [HttpGet("Get"), Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<Summary>> GetSummary()
        {
            int userCount = await _userRepository.GetAll().CountAsync();
            int bookCount = await _bookRepository.GetAll().CountAsync();
            int pageCount = await _pageRepository.GetAll().CountAsync();
            int blockCount = await _blockRepository.GetAll().CountAsync();
            int fileCount = await _fileRepository.GetAll().CountAsync();

            var startDate = DateTime.Now;
            var endDate = startDate.AddDays(-6);

            var userCountsByDay = Enumerable.Range(0, 7)
                .Select(offset => startDate.AddDays(-offset))
                .GroupJoin(
                    _userRepository.Get(u => u.RegisteredAt >= endDate && u.RegisteredAt <= startDate),
                    c => c.Date,
                    u => u.RegisteredAt.Date,
                    (date, users) => new UsersCreatedInDay
                    {
                        Day = startDate.Subtract(date).Days,
                        Users = users.Count()
                    })
                .OrderByDescending(x => x.Day)
                .ToList();

            endDate = startDate.AddDays(-30);

            var entityCountByDay = Enumerable.Range(0, 31)
                .Select(offset => startDate.AddDays(-offset))
                .GroupJoin(
                    _userRepository.Get(u => u.RegisteredAt >= endDate && u.RegisteredAt <= startDate),
                    date => date.Date,
                    user => user.RegisteredAt.Date,
                    (date, users) => new
                    {
                        date = date.Date,
                        userCount = users.Count()
                    })
                .GroupJoin(
                    _bookRepository.Get(u => u.CreatedAt >= endDate && u.CreatedAt <= startDate),
                    quary => quary.date,
                    book => book.CreatedAt.Date,
                    (quary, books) => new
                    {
                        date = quary.date,
                        userCount = quary.userCount,
                        bookCount = books.Count()
                    })
                .GroupJoin(
                    _pageRepository.Get(u => u.CreatedAt >= endDate && u.CreatedAt <= startDate),
                    quary => quary.date,
                    page => page.CreatedAt.Date,
                    (quary, pages) => new
                    {
                        date = quary.date,
                        userCount = quary.userCount,
                        bookCount = quary.bookCount,
                        pageCount = pages.Count()
                    }
                )
                .GroupJoin(
                    _blockRepository.Get(u => u.CreatedAt >= endDate && u.CreatedAt <= startDate),
                    quary => quary.date,
                    block => block.CreatedAt.Date,
                    (quary, blocks) => new
                    {
                        date = quary.date,
                        userCount = quary.userCount,
                        bookCount = quary.bookCount,
                        pageCount = quary.pageCount,
                        blockCount = blocks.Count()
                    }
                )
                .GroupJoin(
                    _fileRepository.Get(u => u.CreatedAt >= endDate && u.CreatedAt <= startDate),
                    quary => quary.date,
                    page => page.CreatedAt.Date,
                    (quary, files) => new EntitiesCreatedInDay
                    {
                        Day = startDate.Subtract(quary.date).Days,
                        Users = quary.userCount,
                        Books = quary.bookCount,
                        Pages = quary.pageCount,
                        Blocks = quary.blockCount,
                        Files = files.Count()
                    }
                )
                .OrderByDescending(x => x.Day)
                .ToList();

            return new Summary()
            {
                Users = userCount,
                Books = bookCount,
                Pages = pageCount,
                Blocks = blockCount,
                Files = fileCount,
                newUsersPastWeek = userCountsByDay,
                entitiesCreatedPastMonth = entityCountByDay,
            };
        }
    }
}
