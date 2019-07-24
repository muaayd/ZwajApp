using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helpers;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]

    public class PhotoController : ControllerBase
    {

        private readonly IZwajRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotoController(IZwajRepository repo, IOptions<CloudinarySettings> cloudinaryConfig, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
             );

            _cloudinary = new Cloudinary(account);


        }
        [HttpGet("{id}", Name = "Getphotp")]
        public async Task<IActionResult> Getphotp(int id)
        {
            var photoFromRepository = await _repo.GetPhoto(id);
            var photo = _mapper.Map<photoForReturnDto>(photoFromRepository);
            return Ok(photo);


        }


        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreatDto photoForCreatDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _repo.GetUser(userId);
            var file = photoForCreatDto.File;
            var uploadResult = new ImageUploadResult();
            if (file != null && file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                      .Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }

            }
            photoForCreatDto.url = uploadResult.Uri.ToString();
            photoForCreatDto.publicId = uploadResult.PublicId;
            var photo = _mapper.Map<Photo>(photoForCreatDto);
            if (!userFromRepo.Photos.Any(p => p.isMain))
                photo.isMain = true;

            userFromRepo.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photpToReturn = _mapper.Map<photoForReturnDto>(photo);
                return CreatedAtRoute("Getphotp", new { id = photo.Id }, photpToReturn);
            }
            return BadRequest("خطاء في اضافة الصورة");


        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _repo.GetUser(userId);
            if (!userFromRepo.Photos.Any(p => p.Id == id))
                return Unauthorized();
            var DesiredMainPhoto = await _repo.GetPhoto(id);
            if (DesiredMainPhoto.isMain)
                return BadRequest("هذه هي الصورة الأساسية بالفعل");
            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            currentMainPhoto.isMain = false;
            DesiredMainPhoto.isMain = true;
            if (await _repo.SaveAll())
                return NoContent();
            return BadRequest("خطاء في تعديل الصورة الأساسية");



        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _repo.GetUser(userId);
            if (!userFromRepo.Photos.Any(p => p.Id == id))
                return Unauthorized();
            var Photo = await _repo.GetPhoto(id);
            if (Photo.isMain)
                return BadRequest("لا يمكن حذف الصورة الاساسية");
            if (Photo.PublicId != null)
            {
                var DeleteParams = new DeletionParams(Photo.PublicId);
                var result = this._cloudinary.Destroy(DeleteParams);
                if (result.Result == "ok")
                {
                    _repo.Delete(Photo);
                }

            }
            if (Photo.PublicId == null)
            {
                _repo.Delete(Photo);
            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("فشل حذف الصورة");


        }
    }

}
