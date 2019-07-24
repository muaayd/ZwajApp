using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class ZwajRepository : IZwajRepository
    {
        private readonly DataContext _context;
        public ZwajRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _context.Users.Include(u => u.Photos).ToListAsync();
            return users;

        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;

        }

        public async Task<bool> SaveAll()
        {
          return await _context.SaveChangesAsync()>0;
        }


        public async Task<Photo> GetPhoto(int id)
        {
            var Photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id==id );
            return Photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            var Photo = await _context.Photos.Where(u => u.UserId==userId).FirstOrDefaultAsync(p => p.isMain);
            return Photo;
        }
    }
}