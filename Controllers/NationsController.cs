using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ISTP_Lab2.Models;

using System.IO;
using ClosedXML.Excel;

namespace ISTP_Lab2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NationsController : ControllerBase
    {
        private readonly Lab2FifaContext _context;

        public NationsController(Lab2FifaContext context)
        {
            _context = context;
        }

        // GET: api/Nations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nation>>> GetNations()
        {
            return await _context.Nations.ToListAsync();
        }

        // GET: api/Nations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nation>> GetNation(int id)
        {
            var nation = await _context.Nations.FindAsync(id);

            if (nation == null)
            {
                return NotFound();
            }

            return nation;
        }

        // PUT: api/Nations/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNation(int id, Nation nation)
        {
            if (id != nation.ID)
            {
                return BadRequest();
            }

            _context.Entry(nation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NationExists(id))
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

        // POST: api/Nations
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Nation>> PostNation(Nation nation)
        {
            _context.Nations.Add(nation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNation", new { id = nation.ID }, nation);
        }

        // DELETE: api/Nations/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Nation>> DeleteNation(int id)
        {
            var nation = await _context.Nations.FindAsync(id);
            if (nation == null)
            {
                return NotFound();
            }

            _context.Nations.Remove(nation);
            await _context.SaveChangesAsync();

            return nation;
        }

        private bool NationExists(int id)
        {
            return _context.Nations.Any(e => e.ID == id);
        }
    }
}
