using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ISTP_Lab2.Models
{
    public class Club
    {
        public Club()
        {
            Players = new List<Player>();
        }
        public int ID { get; set; }
        public int LeagueID { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public virtual League League { get; set; }
        public virtual ICollection<Player> Players { get; set; }
    }
}
