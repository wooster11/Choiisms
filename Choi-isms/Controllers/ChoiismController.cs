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
				//return NotFound();
				throw;
			}
		}

		public IHttpActionResult GetChoiism(int id)
		{
			try
			{
				Choiism c;
				do
				{
					c = db.Choiisms.OrderBy(r => Guid.NewGuid()).Take(1).FirstOrDefault();
				} while (c.ChoiismID == id);

				return Ok(c);				
			}
			catch (Exception)
			{
				//return NotFound();
				throw;
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
