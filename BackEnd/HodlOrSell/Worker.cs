using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Host;

namespace HodlOrSell
{
    public class Worker
    {
        private static List<string> ImportantCryptos = new List<string>() { "BTC", "ETH", "XMR", "EOS", "LTC" };
        private const string _keyName = "X-CMC_PRO_API_KEY";
        private const string _keyValue = "---";
        private const string _url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?sort=market_cap&start=1&limit=2500&cryptocurrency_type=all&convert=USD";
        private Blobber _blobber;
        private TraceWriter _logger;

        public Worker(Blobber blobber, TraceWriter log)
        {
            _blobber = blobber ?? throw new Exception("No blob");
            _logger = log;
        }

        private async Task<string> FetchRawData()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add(_keyName, _keyValue);
                var request = new HttpRequestMessage(HttpMethod.Get, new Uri(_url));
                var response = await httpClient.SendAsync(request);
                var output = await response.Content.ReadAsStringAsync();
                return output;
            }
        }

        private bool IsImportantCrypto(string coin)
        {
            return ImportantCryptos.Contains(coin);
        }

        private Hodl ResolveHodl(string coin, double data)
        {
            if (data > 10.0) return Hodl.Moon;
            else if (data > -0.5 || IsImportantCrypto(coin.ToUpper())) return Hodl.Hodl;
            else return Hodl.Sell;
        }

        private List<CurrencyInfo> RefineData(string rawData)
        {
            if (string.IsNullOrWhiteSpace(rawData)) return null;

            var json = JObject.Parse(rawData);
            var result = new List<CurrencyInfo>();

            foreach (var rawCurrency in json["data"])
            {
                try
                {
                    var symbol = rawCurrency["symbol"].Value<string>();
                    var currency = new CurrencyInfo
                    {
                        Name = rawCurrency["name"].Value<string>(),
                        Code = symbol,
                        Hodl = ResolveHodl(symbol, rawCurrency["quote"]["USD"]["percent_change_7d"].Value<double>())
                    };
                    result.Add(currency);
                }
                catch (Exception e)
                {
                    _logger.Warning($"Could not process currency - {rawCurrency.ToString()} - problem: {e.ToString()}");
                }
            }

            return result;
        }

        private void StoreData(List<CurrencyInfo> data)
        {
            if (data == null || data.Count == 0) return;
            var serializedData = JsonConvert.SerializeObject(data);
            _blobber.StoreData(serializedData);
        }

        public void UpdateData()
        {
            var rawData = FetchRawData().ConfigureAwait(false).GetAwaiter().GetResult();
            var refinedData = RefineData(rawData);
            StoreData(refinedData);
        }

    }
}
