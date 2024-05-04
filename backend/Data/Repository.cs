using backend.Interfaces;
using System.Linq.Expressions;

namespace backend.Data
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private DataContext _context;
        private DbSet<T> table;

        public Repository(DataContext context)
        {
            _context = context;
            table = _context.Set<T>();
        }

        public IQueryable<T> GetAll()
        {
            return table;
        }

        public IQueryable<T> Get(Expression<Func<T, bool>> filter)
        {
            return table.Where(filter);
        }

        public void Add(T entity)
        {
            try
            {
                if (entity == null)
                {
                    throw new ArgumentNullException("entity");
                }

                table.Add(entity);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while processing the request", ex);
            }
        }

        public void Update(T entity)
        {
            try
            {
                if (entity == null)
                {
                    throw new ArgumentNullException("entity");
                }

                table.Update(entity);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while processing the request", ex);
            }
        }

        public void Delete(T entity)
        {
            try
            {
                if (entity == null)
                {
                    throw new ArgumentNullException("entity");
                }

                table.Remove(entity);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while processing the request", ex);
            }
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
