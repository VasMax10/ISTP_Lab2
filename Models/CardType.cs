using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        [Required(ErrorMessage = "This field is required")]
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public virtual ICollection<Card> Cards { get; set; }
    }
}
