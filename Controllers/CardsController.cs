using System;
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
    public class CardsController : ControllerBase
    {
        private readonly Lab2FifaContext _context;

        public CardsController(Lab2FifaContext context)
        {
            _context = context;
        }
        public class UserCard : Card
        {
            public string PlayerName { get; set; }
            public string NationImage { get; set; }
            public string ClubImage { get; set; }
            public string TypeImage { get; set; }
            public string PlayerImage { get; set; }
            public int darkMode { get; set; }
            public UserCard(Card card, Lab2FifaContext context)
            {
                ID          = card.ID;
                Position    = card.Position;
                Rating      = card.Rating;
                Pace        = card.Pace;
                Dribling = card.Dribling;
                Passing = card.Passing;
                Physical = card.Physical;
                Shooting = card.Shooting;
                Defense = card.Defense;
                PlayerID = card.PlayerID;
                TypeID = card.TypeID;
                SpecialImageUrl = card.SpecialImageUrl;

                var pl = context.Players.Where(p => p.ID == PlayerID).FirstOrDefault();
                PlayerName = pl.Name;
                PlayerImage = pl.ImageUrl;

                ClubImage = context.Clubs.Where(p => p.ID == card.Player.ClubID).FirstOrDefault().ImageUrl;
                NationImage = context.Nations.Where(p => p.ID == card.Player.NationID).FirstOrDefault().ImageUrl;
                TypeImage = context.CardTypes.Where(p => p.ID == TypeID).FirstOrDefault().ImageUrl;
                darkMode = card.Type.darkStyle;
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserCard>>> GetCards(string clubName, string typeName)
        {
            if (clubName != null && typeName != null)
            {
                var sel_list = _context.Cards.Where(l => l.Player.Club.Name == clubName && l.Type.Name == typeName).Select(c => new UserCard(c, _context));
                return await sel_list.ToListAsync();
            }
            else if (typeName != null)
            {
                var sel_list = _context.Cards.Where(l => l.Type.Name == typeName).Select(c => new UserCard(c, _context));
                                       
                return await sel_list.ToListAsync();
            }
            else if (clubName != null)
            {
                var sel_list = _context.Cards.Where(l => l.Player.Club.Name == clubName).Select(c => new UserCard(c, _context));
                return await sel_list.ToListAsync();
            }
            return await _context.Cards.Select(c => new UserCard(c, _context)).ToListAsync();
        }


        // GET: api/Cards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Card>> GetCard(int id)
        {
            var card = _context.Cards.Where(c => c.ID == id).Select(c => new UserCard(c, _context));

            if (card == null)
            {
                return NotFound();
            }

            return await card.FirstOrDefaultAsync();
        }

        // PUT: api/Cards/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCard(int id, Card card)
        {
            if (id != card.ID)
            {
                return BadRequest();
            }

            _context.Entry(card).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardExists(id))
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

        // POST: api/Cards
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Card>> PostCard(string[] data)
        {
            Card card = new Card();
            card.Position = data[2];
            card.Rating = int.Parse(data[3]);
            card.Pace = data[4];
            card.Shooting = data[5];
            card.Passing = data[6];
            card.Dribling = data[7];
            card.Defense = data[8];
            card.Physical = data[9];
            card.SpecialImageUrl = data[10];

            Player player = _context.Players.Where(p => p.Name == data[0]).FirstOrDefault();
            card.PlayerID = player.ID;
            card.Player = player;
            CardType type = _context.CardTypes.Where(c => c.Name == data[1]).FirstOrDefault();
            card.TypeID = type.ID;
            card.Type = type;

            player.Cards.Add(card);
            type.Cards.Add(card);

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCard", new { id = card.ID }, card);
        }

        // DELETE: api/Cards/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Card>> DeleteCard(int id)
        {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
            {
                return NotFound();
            }

            _context.Cards.Remove(card);
            await _context.SaveChangesAsync();

            return card;
        }

        private bool CardExists(int id)
        {
            return _context.Cards.Any(e => e.ID == id);
        }
    }
}
