using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAtuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public AuthController(IAtuthRepository repo, IConfiguration config,IMapper mapper)
        {
            _config = config;
            _repo = repo;
            _mapper=mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult> register(UserForRegisterDto userForRegisterDto)
        {
            //validation

            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower();
            if (await _repo.UserExists(userForRegisterDto.UserName)) return BadRequest("هذا المستخدم مسجل من قبل");
            var userToCreate = new User
            {
                UserName = userForRegisterDto.UserName
            };
            var CreateUser = await _repo.Register(userToCreate, userForRegisterDto.Password);
            return StatusCode(201);
        }
        [HttpPost("login")]
        public async Task<IActionResult> login(UserForLoginDto userForLoginDto)
        {
           /*  try
            {*/
                //throw new Exception("Api Says nooooo");
                var userFromRepo = await _repo.Login(userForLoginDto.UserName, userForLoginDto.Password);
                if (userFromRepo == null) return Unauthorized();
                var claims = new[] 
                {
                new Claim (ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                new Claim (ClaimTypes.Name,userFromRepo.UserName)
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var user=_mapper.Map<UserForListDto>(userFromRepo);
                return Ok(new
                {
                    token = tokenHandler.WriteToken(token),
                    user
                });
          /*  }
            catch 
            {
                return StatusCode(500,"Api Is Vary Tired");
            } */


        }

    }
}