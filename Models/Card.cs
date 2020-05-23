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
        [Required(ErrorMessage = "This field is required")]
        public int Rating { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public string Position { get; set; }

        [Display(Name = "PAC")]
        [Required(ErrorMessage = "This field is required")]
        public string Pace { get; set; }
        [Display(Name = "SHO")]
        [Required(ErrorMessage = "This field is required")]
        public string Shooting { get; set; }
        [Display(Name = "PAS")]
        [Required(ErrorMessage = "This field is required")]
        public string Passing { get; set; }
        [Display(Name = "DRI")]
        [Required(ErrorMessage = "This field is required")]
        public string Dribling { get; set; }
        [Display(Name = "DEF")]
        [Required(ErrorMessage = "This field is required")]
        public string Defense { get; set; }
        [Display(Name = "PHY")]
        [Required(ErrorMessage = "This field is required")]
        public string Physical { get; set; }
        public string SpecialImageUrl { get; set; }
        public virtual Player Player { get; set; }
        public virtual CardType Type { get; set; }
    }
}
