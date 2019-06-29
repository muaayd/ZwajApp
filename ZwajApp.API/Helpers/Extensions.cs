using Microsoft.AspNetCore.Http;

namespace ZwajApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string massage)
        {
            response.Headers.Add("Application-Error", massage);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
    }
}