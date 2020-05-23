﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ISTP_Lab2.Models;

namespace ISTP_Lab2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly Lab2FifaContext _context;

        public PlayersController(Lab2FifaContext context)
        {
            _context = context;
        }
        public class UserPlayer : Player
        {
            public string ClubName { get; set; }
            public string NationName { get; set; }
            public UserPlayer(Player player, string ClubName, string NationName)
            {
                ID = player.ID;
                ImageUrl = player.ImageUrl;
                Name = player.Name;
                this.ClubName = ClubName;
                this.NationName = NationName;
            }
        }
        // GET: api/Players
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserPlayer>>> GetPlayers(string clubName, string nationName)
        {
            //return await _context.Players.ToListAsync();
            var list = _context.Players.Select(c => new UserPlayer(c, c.Club.Name, c.Nation.Name));
            if (clubName != null)
            {
                //list = list.Where(l => l.ClubName == clubName);
                list = list.Where(l => l.Club.Name == clubName);
            }
            if (nationName != null)
            {
                list = list.Where(l => l.Nation.Name == nationName);

            }

            var list2 = _context.Players.Select(c => new UserPlayer(c, c.Club.Name, c.Nation.Name));
            
            /*if (leagueName != null)
            {
                var list2 = _context.Clubs.Where(c => c.League.Name == leagueName)
                    .Select(c => new UserClub(c, c.League.Name));
                return await list2.ToListAsync();
            }*/
            return await list.ToListAsync();
        }

        // GET: api/Players/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);

            if (player == null)
            {
                return NotFound();
            }

            return player;
        }

        // PUT: api/Players/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlayer(int id, Player player, string clubName, string nationName)
        {
            var club = _context.Clubs.Where(l => l.Name == clubName).FirstOrDefault();
            var nation = _context.Nations.Where(l => l.Name == nationName).FirstOrDefault();
            player.ClubID = club.ID;
            player.NationID = nation.ID;

            if (id != player.ID)
            {
                return BadRequest();
            }

            _context.Entry(player).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(id))
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

        // POST: api/Players
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Player>> PostPlayer(string[] data)
        {
            Club club = _context.Clubs.Where(c => c.Name == data[1]).FirstOrDefault();
            Nation nation = _context.Nations.Where(n => n.Name == data[2]).FirstOrDefault();
            Player player = new Player
            {
                Name = data[0],
                ClubID = club.ID,
                NationID = nation.ID,
                ImageUrl = data[3]
            };
            player.Nation = nation;
            player.Club = club;
            nation.Players.Add(player);
            club.Players.Add(player);
            if (ModelState.IsValid)
            {
                _context.Add(player);
                await _context.SaveChangesAsync();
            }
            return CreatedAtAction("GetPlayer", new { id = player.ID }, player);

            //_context.Players.Add(player);
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetPlayer", new { id = player.ID }, player);
        }

        // DELETE: api/Players/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Player>> DeletePlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null)
            {
                return NotFound();
            }

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();

            return player;
        }

        private bool PlayerExists(int id)
        {
            return _context.Players.Any(e => e.ID == id);
        }
    }
}
