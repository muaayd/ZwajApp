using System;

namespace ZwajApp.API.Dtos
{
    public class photoForReturnDto
    {
           public int Id { get; set; }
           public string url { get; set; }
           public string description { get; set; }
           public DateTime DateAdded { get; set; }
           public bool isMain { get; set; }
           public string publicId { get; set; }
    }
}