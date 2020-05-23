using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ISTP_Lab2.Models;
using Newtonsoft.Json.Linq;
using System.Net.Http;

namespace ISTP_Lab2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClubsController : ControllerBase
    {
        private readonly Lab2FifaContext _context;

        public ClubsController(Lab2FifaContext context)
        {
            _context = context;
        }

        public class UserClub : Club
        {
            public string LeagueName { get; set; }
            public UserClub(Club club, string LeagueName)
            {
                this.LeagueName = LeagueName;
                ID = club.ID;
                ImageUrl = club.ImageUrl;
                LeagueID = club.LeagueID;
                Name = club.Name;
            }
        }

        // GET: api/Clubs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserClub>>> GetClubs(string leagueName)
        {
            var list = _context.Clubs.Select(c => new UserClub(c, c.League.Name));
            if (leagueName != null)
            {
                var list2 = _context.Clubs.Where(c => c.League.Name == leagueName)
                    .Select(c => new UserClub(c, c.League.Name));
                return await list2.ToListAsync();
            }
            return await list.ToListAsync();
        }

        // GET: api/Clubs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Club>> GetClub(int id)
        {
            var club = await _context.Clubs.FindAsync(id);

            if (club == null)
            {
                return NotFound();
            }

            return club;
        }

        // PUT: api/Clubs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClub(int id, Club club, string leagueName)
        {

            //club = userClub;
            var league = _context.Leagues.Where(l => l.Name == leagueName).FirstOrDefault();
            club.LeagueID = league.ID;
            if (id != club.ID)
            {
                return BadRequest();
            }

            _context.Entry(club).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClubExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Clubs
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Club>> PostClub(string[] data)
        {
            Club check = _context.Clubs.Where(c => c.Name == data[0]).FirstOrDefault();
            if (check == null)
            {
                League league = _context.Leagues.Where(l => l.Name == data[2]).Include(l => l.Clubs).FirstOrDefault();
                Club club = new Club
                {
                    Name = data[0],
                    ImageUrl = data[1],
                    LeagueID = league.ID
                };
                club.League = league;
                league.Clubs.Add(club);
                if (ModelState.IsValid)
                {
                    _context.Add(club);
                    await _context.SaveChangesAsync();
                }
                return CreatedAtAction("GetClub", new { id = club.ID }, club);
            }
            return BadRequest();
            
        }

        // DELETE: api/Leagues/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Club>> DeleteClub(int id)
        {
            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
            {
                return NotFound();
            }

            _context.Clubs.Remove(club);
            await _context.SaveChangesAsync();

            return club;
        }

        private bool ClubExists(int id)
        {
            return _context.Clubs.Any(e => e.ID == id);
        }

    }

}
