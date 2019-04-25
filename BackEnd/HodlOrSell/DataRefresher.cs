using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;

namespace HodlOrSell
{
    public static class DataRefresher
    {
        [FunctionName("DataRefresher")]
        public static void Run([TimerTrigger("0 0 */2 * * *")]TimerInfo myTimer, TraceWriter log)
        {
            log.Info($"C# Timer trigger function executed at: {DateTime.Now}");
            try
            {
                var blobber = new Blobber();
                var worker = new Worker(blobber, log);
                worker.UpdateData();
            }
            catch (Exception e)
            {
                log.Error($"Error has occurred: {e.ToString()}, {e.StackTrace}");
                throw;
            }
            log.Info($"Task completed at: {DateTime.Now}");
        }
    }
}
