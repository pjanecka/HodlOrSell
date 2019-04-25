using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace HodlOrSell
{
    public static class DataDispenser
    {
        [FunctionName("DataDispenser")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");
            string data = "";
            try
            {
                var blobber = new Blobber();
                var rawData = blobber.ReadData();
                //var parsedData = JsonConvert.DeserializeObject<List<CurrencyInfo>>(rawData);
                data = rawData;
            }
            catch (Exception e)
            {
                log.Error($"Error fetching data: {e.ToString()}, {e.StackTrace}");
            }

            log.Info("Processed request");

            return string.IsNullOrWhiteSpace(data)
                ? req.CreateResponse(HttpStatusCode.InternalServerError, "Error Getting Data")
                : new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(data, Encoding.UTF8, "application/json")
                };

        }
    }
}
