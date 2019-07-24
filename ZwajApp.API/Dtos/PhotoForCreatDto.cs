using System;
using Microsoft.AspNetCore.Http;

namespace ZwajApp.API.Dtos
{
    public class PhotoForCreatDto
    {
        public string url { get; set; }
        public IFormFile File { get; set; }

        public string description { get; set; }

        public DateTime DateAdded { get; set; }

        public string publicId { get; set; }

        public PhotoForCreatDto()
        {
            DateAdded = DateTime.Now;
        }


    }
}