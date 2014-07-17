using Choi_isms.DAL;
using Choi_isms.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Choi_isms.Controllers
{
	public class ChoiismController : ApiController
	{
		private ChoiismContext db = new ChoiismContext();
		public IHttpActionResult GetChoiism()
		{
			try
			{
				return Ok(db.Choiisms.OrderBy(r => Guid.NewGuid()).Take(1).FirstOrDefault());
			}
			catch (Exception)
			{
				return NotFound();
			}
		}

		public IHttpActionResult GetChoiism(int id, string retrievalType)
		{
			try
			{
				Choiism c;
				switch (retrievalType)
				{
					case "previous":
						c = db.Choiisms.FirstOrDefault(r => r.ChoiismID == id - 1);
						if (c == null) //Loop to the last one
							c = db.Choiisms.OrderByDescending(r => r.ChoiismID).FirstOrDefault(); //LastOrDefault not supported by EF, order by desc then get the first one.
						break;
					case "next":
						c = db.Choiisms.FirstOrDefault(r => r.ChoiismID == id + 1);
						if (c == null) //Loop to the first one
							c = db.Choiisms.FirstOrDefault();
						break;
					default: //Get Random by default
						var citems = db.Choiisms.OrderBy(r => Guid.NewGuid()).Take(2);
						c = citems.FirstOrDefault();
						if (c != null && c.ChoiismID == id) //Not null and is the same as what is already displayed, get the next one
							c = citems.FirstOrDefault(r => r.ChoiismID != id); //Attempt to get the other item if it's there, otherwise just return null.
						break;
				}

				return Ok(c);				
			}
			catch (Exception)
			{
				return NotFound();
			}
		}

		public IHttpActionResult PostChoiism(JObject jsonChoiism)
		{
			try
			{
				//Create a Choiism from the JSON object
				var c = new Choiism();

				c.ChoiismType = jsonChoiism.GetValue("selectedChoiismType").ToString();
				switch (c.ChoiismType)
				{
					case "string":
						c.ChoiismValue = jsonChoiism.GetValue("submitStringChoiismValue").ToString();
						break;
					case "image":
						c.ChoiismValue = jsonChoiism.GetValue("submitImageUrl").ToString();
						c.ChoiismCaption = jsonChoiism.GetValue("submitImageCaption").ToString();
						break;
					case "link":
						c.ChoiismValue = jsonChoiism.GetValue("submitLinkUrl").ToString();
						c.ChoiismCaption = jsonChoiism.GetValue("submitLinkCaption").ToString();
						break;
				}
				c.Submitter = jsonChoiism.GetValue("submitName").ToString();
				db.Choiisms.Add(c);
				db.SaveChanges();
				return Ok(c);
			}
			catch (Exception)
			{
				return StatusCode(HttpStatusCode.InternalServerError);
			}
		}
	}
}
