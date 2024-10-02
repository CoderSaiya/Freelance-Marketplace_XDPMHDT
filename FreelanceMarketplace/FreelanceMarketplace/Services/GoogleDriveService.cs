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
    private static string[] Scopes = { DriveService.Scope.DriveFile };
    private const string ApplicationName = "FreelanceMarketplace";
    private const string ServiceAccountKeyPath = "./drive.json";

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

    public async Task<string> UploadFileToDrive(Stream fileStream, string fileName, string folderId)
    {
        try
        {
            var driveService = CreateDriveService();

            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = fileName,
                Parents = new List<string> { folderId }
            };

            var request = driveService.Files.Create(
                fileMetadata,
                fileStream,
                "image/jpeg");

            request.Fields = "id";
            var file = await request.UploadAsync();

            if (file.Status == UploadStatus.Completed)
            {
                var uploadedFile = request.ResponseBody;
                return $"https://drive.google.com/thumbnail?id={uploadedFile.Id}&s=4000";
            }
            else
            {
                throw new Exception("Failed to upload the file.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
            return null;
        }
    }
}
