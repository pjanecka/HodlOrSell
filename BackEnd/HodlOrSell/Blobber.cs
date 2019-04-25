using System;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace HodlOrSell
{
    public class Blobber
    {
        private CloudBlockBlob _blob;

        public Blobber()
        {
            SetupBlobStorage();
        }

        private void SetupBlobStorage()
        {
            // Create Reference to Azure Storage Account
            string connection = Environment.GetEnvironmentVariable("StorageConnection");
            var storagAacc = CloudStorageAccount.Parse(connection);
            var blobClient = storagAacc.CreateCloudBlobClient();
            var container = blobClient.GetContainerReference("cryptocurrencies");
            container.CreateIfNotExists();
            _blob = container.GetBlockBlobReference("data.json");
        }

        public void StoreData(string data) => _blob.UploadText(data);

        public string ReadData() => _blob.DownloadText();
    }
}
