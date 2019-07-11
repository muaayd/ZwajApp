using System.Collections.Generic;
using Newtonsoft.Json;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class TrialData
    {
        private readonly DataContext _context;

        public TrialData(DataContext context)
        {
            _context = context;
        }

        public void Trialuser()
        {
            var UserData=System.IO.File.ReadAllText("Data/UsersTrialData.json");
        var users=JsonConvert.DeserializeObject<List<User>> (UserData);
        foreach (var user in users)
        {
            byte[] passwordHash,passwordSalt;
            CreatePasswordHash(user.UserName.ToLower(),out passwordHash,out passwordSalt);
            user.UserName=user.UserName.ToLower();
            user.PasswordHash=passwordHash;
            user.PasswordSalt=passwordSalt;
            _context.Add(user);
        }
        _context.SaveChanges();
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}