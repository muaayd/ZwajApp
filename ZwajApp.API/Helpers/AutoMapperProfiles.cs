using System.Linq;
using AutoMapper;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForDetailsDto>()
            .ForMember(dest => dest.PhotoURL, opt =>
            {
                opt.MapFrom
                (src => src.Photos.FirstOrDefault(p => p.isMain).url);
            })  
            .ForMember(dest => dest.Age, opt =>{
                opt.ResolveUsing (src => src.DateOfBirth.CalculatAge());
            });
            
            CreateMap<User, UserForListDto>()
            .ForMember(dest => dest.PhotoURL, opt =>
            {
                opt.MapFrom
                (src => src.Photos.FirstOrDefault(p => p.isMain).url);
            })
            .ForMember(dest => dest.Age, opt =>{
                opt.ResolveUsing (src => src.DateOfBirth.CalculatAge());
            });
            
            CreateMap<Photo, PhotoForDetailsDto>();
        }

    }
}