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
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Web;

namespace ISTP_Lab2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaguesController : ControllerBase
    {
        private readonly Lab2FifaContext _context;

        public LeaguesController(Lab2FifaContext context)
        {
            _context = context;
        }

        public class UserLeague : League
        {
            public int CountClubs { get; set; }
            public UserLeague(League league, int countClubs)
            {
                CountClubs = countClubs;
                ID = league.ID;
                ImageUrl = league.ImageUrl;
                Name = league.Name;
            }
        }
        // GET: api/Leagues
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserLeague>>> GetLeagues()
        {
            var list = _context.Leagues.Select(c => new UserLeague(c, c.Clubs.Count));
            return await list.ToListAsync();
        }

        // GET: api/Leagues/5
        [HttpGet("{id}")]
        public async Task<ActionResult<League>> GetLeague(int id)
        {
            var league = await _context.Leagues.FindAsync(id);

            if (league == null)
            {
                return NotFound();
            }

            return league;
        }

        // PUT: api/Leagues/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeague(int id, League league)
        {
            if (id != league.ID)
            {
                return BadRequest();
            }

            _context.Entry(league).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeagueExists(id))
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

        // POST: api/Leagues
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<League>> PostLeague(League league)
        {
            _context.Leagues.Add(league);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLeague", new { id = league.ID }, league);
        }

        // DELETE: api/Leagues/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<League>> DeleteLeague(int id)
        {
            var league = await _context.Leagues.FindAsync(id);
            if (league == null)
            {
                return NotFound();
            }

            _context.Leagues.Remove(league);
            await _context.SaveChangesAsync();

            return league;
        }

        private bool LeagueExists(int id)
        {
            return _context.Leagues.Any(e => e.ID == id);
        }
        /*[HttpPost]
        public async Task<ActionResult<IEnumerable<League>>> UploadFiles(IFormFile file)
        {
            if (ModelState.IsValid)
            {
                if (file != null)
                {
                    using (var stream = new FileStream(file.FileName, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                        using (XLWorkbook workBook = new XLWorkbook(stream, XLEventTracking.Disabled))
                        {
                            // перегляд листів (в даному випадку версій)
                            foreach (IXLWorksheet worksheet in workBook.Worksheets)
                            {

                                // перегляд рядків
                                foreach (IXLRow row in worksheet.RowsUsed().Skip(1))
                                {
                                    try
                                    {
                                        League league = new League();
                                        league.Name = row.Cell(1).Value.ToString();
                                        league.ImageUrl = row.Cell(2).Value.ToString();
                                        _context.Leagues.Add(league);
                                    }
                                    catch { }
                                }
                            }
                        }
                    }
                }
                await _context.SaveChangesAsync();
            }
            return CreatedAtAction("GetLeague", _context.Leagues.FirstOrDefault());
        }
        */
    }
}
