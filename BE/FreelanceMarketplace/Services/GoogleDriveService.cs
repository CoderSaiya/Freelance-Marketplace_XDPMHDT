using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Google.Apis.Upload;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

public class GoogleDriveService
{
    private static readonly string[] Scopes = { DriveService.Scope.DriveFile };
    private const string ApplicationName = "FreelanceMarketplace";
    private const string ServiceAccountKeyPath = "./drive.json";
    private readonly DriveService _driveService;

    public GoogleDriveService()
    {
        _driveService = CreateDriveService();
    }

    private static DriveService CreateDriveService()
    {
        GoogleCredential credential;
        using (var stream = new FileStream(ServiceAccountKeyPath, FileMode.Open, FileAccess.Read))
        {
            credential = GoogleCredential.FromStream(stream).CreateScoped(Scopes);
        }

        return new DriveService(new BaseClientService.Initializer()
        {
            HttpClientInitializer = credential,
            ApplicationName = ApplicationName,
        });
    }

    public async Task<string> UploadFileToDrive(Stream fileStream, string fileName, string folderId, string mimeType = "image/jpeg")
    {
        try
        {
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = fileName,
                Parents = new List<string> { folderId }
            };

            var request = _driveService.Files.Create(fileMetadata, fileStream, mimeType);
            request.Fields = "id";
            var file = await request.UploadAsync();

            if (file.Status == UploadStatus.Completed)
            {
                var uploadedFile = request.ResponseBody;
                Console.WriteLine("Upload successful, File ID: " + uploadedFile.Id);
                if (mimeType == "image/jpeg") return $"https://drive.google.com/thumbnail?id={uploadedFile.Id}&s=4000";
                return $"https://drive.google.com/uc?id={uploadedFile.Id}";
            }
            else
            {
                Console.WriteLine($"Upload failed with status: {file.Status}");
                throw new Exception("File upload failed with status " + file.Status);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred during upload: {ex.Message}");
            return null;
        }
    }

    public async Task<Stream> DownloadFileFromDrive(string fileId)
    {
        try
        {
            var request = _driveService.Files.Get(fileId);
            var stream = new MemoryStream();
            await request.DownloadAsync(stream);
            stream.Position = 0;
            return stream;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred during download: {ex.Message}");
            return null;
        }
    }
}

