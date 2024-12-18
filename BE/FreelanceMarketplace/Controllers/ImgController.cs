using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interfaces;
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
        private const string File_FolderId = "1t0pnNoYeZhaJ4CSCWlD2wKFzTwBMey_u";

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
        public async Task<IActionResult> UploadProductImage(IFormFile file, [FromForm] int userId, [FromForm] int projectId, [FromForm] string mimeType = "image/jpeg")
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            string folderId = mimeType == "image/jpeg" ? FolderId : File_FolderId;
            string imageUrl = await _googleDriveService.UploadFileToDrive(file.OpenReadStream(), file.FileName, folderId, mimeType);

            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, "Failed to upload file to Google Drive.");
            }

            try
            {
                var image = await _imgService.CreateImageAsync(file, projectId, userId, imageUrl);

                if (image == null)
                {
                    return StatusCode(500, "Failed to store image in the database.");
                }

                return Ok(new { ImageUrl = imageUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, $"Error creating image record: {ex.Message}");
            }
        }

        [HttpGet("download/{fileId}")]
        public async Task<IActionResult> DownloadImage(string fileId)
        {
            try
            {
                Stream fileStream = await _googleDriveService.DownloadFileFromDrive(fileId);
                if (fileStream == null)
                {
                    return NotFound("File not found.");
                }

                return File(fileStream, "application/octet-stream", "downloaded_image.jpg");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error downloading file: {ex.Message}");
            }
        }
    }
}
