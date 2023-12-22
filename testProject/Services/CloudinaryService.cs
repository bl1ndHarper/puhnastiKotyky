using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using testProject.Helpers;
using testProject.Models;

namespace testProject.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IOptions<CloudinarySettings> cloudinarySettings)
        {
            var account = new Account(
                cloudinarySettings.Value.CloudName,
                cloudinarySettings.Value.ApiKey,
                cloudinarySettings.Value.ApiSecret);

            _cloudinary = new Cloudinary(account);
        }

        public string UploadImage(IFormFile file, string folder, string fileName)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, stream),
                Folder = folder,
                Transformation = new Transformation().Height(512).Width(512).Crop("fill").Gravity("face"),
                FilenameOverride = fileName,
                UseFilenameAsDisplayName = true,
                PublicId = fileName
            };

            var uploadResult = _cloudinary.Upload(uploadParams);
            return uploadResult.Url.ToString();
        }
        public void DeleteImage(string publicId)
        {
            var deletionParams = new DeletionParams(publicId);
            _cloudinary.Destroy(deletionParams);
        }
    }
}