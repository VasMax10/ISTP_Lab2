using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ISTP_Lab2.Models
{
    public class Player
    {
        public Player()
        {
            Cards = new List<Card>();
        }
        public int ID { get; set; }
        public int ClubID { get; set; }
        public int NationID { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public virtual Club Club { get; set; }
        public virtual Nation Nation { get; set; }
        public virtual ICollection<Card> Cards { get; set; }
    }
}
