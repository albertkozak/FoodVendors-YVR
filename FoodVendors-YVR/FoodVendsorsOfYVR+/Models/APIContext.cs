using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FoodVendsorsOfYVR_.Models
{
    public class FoodVendor
    {
        [Key]
        public string key { get; set; }
        public string status { get; set; }
        public string description { get; set; }
        public float longitude { get; set; }
        public float latitude { get; set; }
        public string location { get; set; }
        public DateTime lastSynced { get; set; }
        public string vendor_type { get; set; }
        public string geo_localarea { get; set; }
        public string business_name { get; set; }
    }
    public class Rootobject
    {
        public int nhits { get; set; }
        public Parameters parameters { get; set; }
        public Record[] records { get; set; }
        public Facet_Groups[] facet_groups { get; set; }
    }
    public class Parameters
    {
        public string dataset { get; set; }
        public string timezone { get; set; }
        public int rows { get; set; }
        public string format { get; set; }
        public string[] facet { get; set; }
    }
    public class Record
    {
        public string datasetid { get; set; }
        public string recordid { get; set; }
        public Fields fields { get; set; }
        public DateTime record_timestamp { get; set; }
    }
    public class Fields
    {
        public string status { get; set; }
        public string description { get; set; }
        public string geo_localarea { get; set; }
        public Geom geom { get; set; }
        public string location { get; set; }
        public string key { get; set; }
        public string vendor_type { get; set; }
        public string business_name { get; set; }
    }
    public class Geom
    {
        public string type { get; set; }
        public float[] coordinates { get; set; }
    }
    public class Facet_Groups
    {
        public Facet[] facets { get; set; }
        public string name { get; set; }
    }
    public class Facet
    {
        public int count { get; set; }
        public string path { get; set; }
        public string state { get; set; }
        public string name { get; set; }
    }
}
