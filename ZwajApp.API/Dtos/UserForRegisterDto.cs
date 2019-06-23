using System.ComponentModel.DataAnnotations;

namespace ZwajApp.API.Dtos
{
    public class UserForRegisterDto
    {[Required]
        public string UserName { get; set; }
        [StringLength(8,MinimumLength=4,ErrorMessage="يجب ان لا تزيد كلمة السر عن ابعة احرف و لا تقل عن ثمانية")]
        public string Password { get; set; }
    }
}