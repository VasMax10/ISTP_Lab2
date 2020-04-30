using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ISTP_Lab2.Models
{
    public class CardType
    {
        public CardType()
        {
            Cards = new List<Card>();
        }
        public int ID { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public virtual ICollection<Card> Cards { get; set; }
    }
}
