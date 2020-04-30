using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ISTP_Lab2.Models
{
    public class Lab2FifaContext : DbContext
    {
        public virtual DbSet<Nation> Nations { get; set; }
        public virtual DbSet<League> Leagues { get; set; }
        public virtual DbSet<Club> Clubs { get; set; }
        public virtual DbSet<CardType> CardTypes { get; set; }
        public virtual DbSet<Card> Cards { get; set; }
        public virtual DbSet<Player> Players { get; set; }
        public Lab2FifaContext(DbContextOptions<Lab2FifaContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
