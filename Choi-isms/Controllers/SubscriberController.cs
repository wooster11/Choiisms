using Choiisms.Core;
using Choiisms.DAL;
using Choiisms.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web.Http;

namespace Choiisms.Controllers
{
	public class SubscriberController : ApiController
	{
		private ChoiismContext db = new ChoiismContext();

		public IHttpActionResult PostSubscriber(JObject jsonSubscriber)
		{
			try
			{
				string subEmail = jsonSubscriber.GetValue("subscriberEmail").ToString();
				string emailHashString = this.HashString(subEmail);
				
				//Check to see if this subscriber already exists
				var sub = db.Subscribers.FirstOrDefault(s => s.EmailHash == emailHashString);
				if (sub == null)
				{
					sub = new Subscriber();
					sub.Name = jsonSubscriber.GetValue("subscriberName").ToString();
					sub.EmailAddress = subEmail;
					sub.EmailHash = emailHashString;
					db.Subscribers.Add(sub);
					db.SaveChanges();
				}

				//always clear out the hash for the return as it's unnecessary
				sub.EmailHash = String.Empty;
		
				return Ok(sub);
			}
			catch (Exception e)
			{
				return ErrorHandler.HandleError(200001, e, this);
			}
		}

		public IHttpActionResult GetSubscriber(string id)
		{
			try
			{
				var subscriber = db.Subscribers.FirstOrDefault(s => s.EmailHash == id);
				return Ok(subscriber);
			}
			catch (Exception e)
			{
				return ErrorHandler.HandleError(200002, e, this);
			}
		}

		public IHttpActionResult GetSubscriberList(int pageNum)
		{
			try
			{
				return Ok(new PagedList<Subscriber>(db.Subscribers.OrderBy(s => s.SubscriberID), pageNum));
			}
			catch (Exception e)
			{
				return ErrorHandler.HandleError(200003, e, this);
			}
		}

		public IHttpActionResult DeleteSubscriber(JObject jsonUnsubscribe)
		{
			try
			{
				var refID = jsonUnsubscribe.GetValue("refid").ToString();
				var subscriber = db.Subscribers.FirstOrDefault(s => s.EmailHash == refID);
				if (subscriber != null)
				{
					db.Subscribers.Remove(subscriber);
					db.SaveChanges();
				}
				return Ok(subscriber);
			}
			catch (Exception e)
			{
				return ErrorHandler.HandleError(200004, e, this);
			}
		}

		[Authorize]
		public IHttpActionResult DeleteSubscriber(int id)
		{
			try
			{
				var sub = db.Subscribers.Remove(db.Subscribers.First(s => s.SubscriberID == id));
				db.SaveChanges();

				return Ok(sub);
			}
			catch (Exception e)
			{
				return ErrorHandler.HandleError(200005, e, this);
			}
		}

		[Authorize]
		public IHttpActionResult PutSubscriber(JObject jsonChangedSubscribers)
		{
			try
			{
				foreach (JToken jt in jsonChangedSubscribers.GetValue("changedItems").AsEnumerable())
				{
					var id = Convert.ToInt32(jt["ID"]);
					var sub = db.Subscribers.First(s => s.SubscriberID == id);
					sub.Name = jt["name"].ToString();
					sub.EmailAddress = jt["email"].ToString();
					sub.EmailHash = this.HashString(jt["email"].ToString());
				}

				db.SaveChanges();

				return Ok();
			}
			catch (Exception e)
			{
				return ErrorHandler.HandleError(200006, e, this);
			}
		}
	
		private string HashString(string valueToHash)
		{
			var bytes = new byte[valueToHash.Length * sizeof(char)];
			System.Buffer.BlockCopy(valueToHash.ToCharArray(), 0, bytes, 0, bytes.Length);

			using (var sha = new SHA1Managed())
			{
				return BitConverter.ToString(sha.ComputeHash(bytes)).Replace("-", "");
			}
		}
	}	
}
