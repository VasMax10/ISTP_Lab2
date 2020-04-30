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
    public class CardTypesController : ControllerBase
    {
        private readonly Lab2FifaContext _context;

        public CardTypesController(Lab2FifaContext context)
        {
            _context = context;
        }

        // GET: api/CardTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CardType>>> GetCardTypes()
        {
            return await _context.CardTypes.ToListAsync();
        }

        // GET: api/CardTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CardType>> GetCardType(int id)
        {
            var cardType = await _context.CardTypes.FindAsync(id);

            if (cardType == null)
            {
                return NotFound();
            }

            return cardType;
        }

        // PUT: api/CardTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCardType(int id, CardType cardType)
        {
            if (id != cardType.ID)
            {
                return BadRequest();
            }

            _context.Entry(cardType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardTypeExists(id))
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

        // POST: api/CardTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<CardType>> PostCardType(CardType cardType)
        {
            _context.CardTypes.Add(cardType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCardType", new { id = cardType.ID }, cardType);
        }

        // DELETE: api/CardTypes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CardType>> DeleteCardType(int id)
        {
            var cardType = await _context.CardTypes.FindAsync(id);
            if (cardType == null)
            {
                return NotFound();
            }

            _context.CardTypes.Remove(cardType);
            await _context.SaveChangesAsync();

            return cardType;
        }

        private bool CardTypeExists(int id)
        {
            return _context.CardTypes.Any(e => e.ID == id);
        }
    }
}
