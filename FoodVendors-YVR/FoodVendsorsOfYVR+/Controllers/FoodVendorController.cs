using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using FoodVendsorsOfYVR_.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FoodVendsorsOfYVR_.Controllers
{
    [Route("api/[controller]")]
    public class FoodVendorController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<FoodVendor> FoodVendors()
        {
            const string URL = "https://opendata.vancouver.ca/api/records/1.0/search?dataset=food-vendors&rows=1000";
            string json = CallRestMethod(new Uri(URL));
            Rootobject obj = JsonConvert.DeserializeObject<Rootobject>(json);

            return Enumerable.Range(0, obj.records.Length).Select(index => new FoodVendor
            {
                key = obj.records[index].fields.key,
                longitude = obj.records[index].fields.geom.coordinates[0],
                latitude = obj.records[index].fields.geom.coordinates[1],
                lastSynced = DateTime.Now,
                description = obj.records[index].fields.description,
                location = obj.records[index].fields.location,
                vendor_type = obj.records[index].fields.vendor_type,
                business_name = obj.records[index].fields.business_name
            });
        }

        static string CallRestMethod(Uri uri)
        {
            try
            {
                // Create a web request for the given uri
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
                // Get the web response from the api
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                // Get a stream to read the reponse
                StreamReader responseStream = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
                // Read the response and write it to the console
                string result = responseStream.ReadToEnd();
                // Close the connection to the api and the stream reader
                response.Close();
                responseStream.Close();
                return result;
            }
            catch (Exception e)
            {
                return $"{{'Error':'An error has occured. Could not get {uri.LocalPath}', 'Message': '{e.Message}'}}";
            }
        }
    }
}