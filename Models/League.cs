using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ISTP_Lab2.Models
{
    public class League
    {
        public League()
        {
            Clubs = new List<Club>();
        }
        public int ID { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public virtual ICollection<Club> Clubs { get; set; }
    }
}
