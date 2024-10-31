using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interface;
using Google.Apis.Drive.v3;
using Microsoft.AspNetCore.Mvc;

namespace FreelanceMarketplace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImgController : ControllerBase
    {
        private readonly IImgService _imgService;
        private readonly GoogleDriveService _googleDriveService;
        private const string FolderId = "192Dg2_GakCpgOg_gxdGqstnU2ki6pkql";

        public ImgController(IImgService imgService, GoogleDriveService googleDriveService)
        {
            _imgService = imgService;
            _googleDriveService = googleDriveService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllImages()
        {
            var images = await _imgService.GetAllImagesAsync();
            return Ok(images);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImageById(int id)
        {
            try
            {
                var img = await _imgService.GetImageByIdAsync(id);
                return Ok(img);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadProductImage(IFormFile file, [FromForm] int userId, [FromForm] int projectId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            Console.WriteLine(file);

            string imageUrl = await _googleDriveService.UploadFileToDrive(file.OpenReadStream(), file.FileName, FolderId);
            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, "Failed to upload image.");
            }

            Task<Img> image = _imgService.CreateImageAsync(file, projectId, userId, imageUrl);
            if (image == null)
            {
                return StatusCode(401, "Faied to stored image");
            }

            return Ok(new { ImageUrl = imageUrl });
        }
    }
}
