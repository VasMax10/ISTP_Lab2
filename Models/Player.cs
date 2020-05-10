using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        [Required(ErrorMessage = "This field is required")]
        public int ClubID { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public int NationID { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public virtual Club Club { get; set; }
        public virtual Nation Nation { get; set; }
        public virtual ICollection<Card> Cards { get; set; }
    }
}
