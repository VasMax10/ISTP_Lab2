using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ISTP_Lab2.Models
{
    public class Card
    {
        public int ID { get; set; }
        public int PlayerID { get; set; }
        public int TypeID { get; set; }

        [Display(Name = "PAC")]
        public string Pace { get; set; }
        [Display(Name = "SHO")]
        public string Shooting { get; set; }
        [Display(Name = "PAS")]
        public string Passing { get; set; }
        [Display(Name = "DRI")]
        public string Dribling { get; set; }
        [Display(Name = "DEF")]
        public string Defense { get; set; }
        [Display(Name = "PHY")]
        public string Physical { get; set; }
        public virtual Player Player { get; set; }
    }
}
