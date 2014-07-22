using Choiisms.DAL;
using Choiisms.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Web;
using System.Web.Http;

namespace Choiisms.Controllers
{
	public class ChoiismController : ApiController
	{
		private ChoiismContext db = new ChoiismContext();

		public IHttpActionResult GetChoiism(int id, string retrievalType)
		{
			try
			{
				Choiism c;
				switch (retrievalType)
				{
					case "exact":
						c = db.Choiisms.FirstOrDefault(r => r.ChoiismID == id);
						if (c == null)
							c = db.Choiisms.OrderBy(r => Guid.NewGuid()).Take(1).FirstOrDefault(); //If ID doesn't exist, just pull a random one
						break;
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
						if (c != null && c.ChoiismID == id && citems.Count() > 1) //Not null and is the same as what is already displayed as well as being more than one total, then get the next one
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

				this.SendNotifications(c);

				return Ok(c);
			}
			catch (Exception)
			{
				return StatusCode(HttpStatusCode.InternalServerError);
			}
		}

		private void SendNotifications(Choiism c)
		{
			var smtpClient = new SmtpClient();
			var from = new MailAddress(ConfigurationManager.AppSettings["EmailFromAddress"], ConfigurationManager.AppSettings["EmailDisplayAddress"]);
			var req = HttpContext.Current.Request;
			var unsubscribeLinkFormat = req.Url.GetLeftPart(UriPartial.Authority) + "/unsubscribe/{0}";

			//Build the email body
			var emailBody = new StringBuilder();
			emailBody.Append("<html><head><style>body{{font-family: sans-serif;font-size: 14px;line-height: 1.428;padding-left: 15px;padding-right: 15px;}}p{{margin-bottom: 10px;}}h3{{font-size: 24px;font-weight: 500;line-height: 1.1;margin-top: 20px;margin-bottom: 10px;}}</style></head><body>"); //Escape curly braces as this will be used in a format string when building the email
			emailBody.AppendFormat("<p>A new Choi-ism has been added by {0}!", c.Submitter);
			switch (c.ChoiismType)
			{
				case "string":
					emailBody.AppendFormat("<h3>{0}</h3>", c.ChoiismValue);
					break;
				case "image":
					emailBody.AppendFormat("<img src='{0}' /><br/>", c.ChoiismValue);
					emailBody.AppendFormat("<h3>{0}</h3>", c.ChoiismCaption);
					break;
				case "link":
					emailBody.AppendFormat("<a href='{0}'>{1}</a>", c.ChoiismValue, String.IsNullOrWhiteSpace(c.ChoiismCaption) ? c.ChoiismValue : c.ChoiismCaption);
					break;
			}
			emailBody.AppendFormat("<p>Tired of getting these emails? If you wish to unsubscribe to these notifications, <a href='{0}'>click here to unsubscribe.</a><br>If you can't click that link, copy and paste the following URL in your browser: {0}</p></body></html>", unsubscribeLinkFormat);

			//Get all the subscribers and loop through them to send an email
			foreach (var email in db.Subscribers)
			{
				var mm = new MailMessage();
				mm.IsBodyHtml = true;
				mm.From = from;
				mm.To.Add(new MailAddress(email.EmailAddress, email.Name));
				mm.Subject = "A New Choi-ism has been submitted!";
				mm.Body = String.Format(emailBody.ToString(), email.EmailHash);
				smtpClient.Send(mm);
			}
		}
	}
}
