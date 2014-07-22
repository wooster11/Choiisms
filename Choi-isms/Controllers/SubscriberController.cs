﻿using Choiisms.DAL;
using Choiisms.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace Choiisms.Controllers
{
	public class SubscriberController : ApiController
	{
		private ChoiismContext db = new ChoiismContext();

		public IHttpActionResult PostSubscriber(JObject jsonSubscriber)
		{
			try
			{
				string emailHashString;

				using (var sha = new SHA1Managed())
				{
					emailHashString = BitConverter.ToString(sha.ComputeHash(this.GetBytes(jsonSubscriber.GetValue("subscriberEmail").ToString()))).Replace("-", "");
				}

				//Check to see if this subscriber already exists
				var sub = db.Subscribers.FirstOrDefault(s => s.EmailHash == emailHashString);
				if (sub == null)
				{
					sub = new Subscriber();
					sub.Name = jsonSubscriber.GetValue("subscriberName").ToString();
					sub.EmailAddress = jsonSubscriber.GetValue("subscriberEmail").ToString();
					sub.EmailHash = emailHashString;
					db.Subscribers.Add(sub);
					db.SaveChanges();
				}

				//always clear out the hash for the return as it's unnecessary
				sub.EmailHash = String.Empty;
		
				return Ok(sub);
			}
			catch (Exception)
			{
				return NotFound();
			}
		}

		public IHttpActionResult GetSubscriber(string id)
		{
			try
			{
				var subscriber = db.Subscribers.FirstOrDefault(s => s.EmailHash == id);
				return Ok(subscriber);
			}
			catch (Exception)
			{
				return Ok();
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
			catch (Exception)
			{
				return Ok(false);
			}
		}

		private byte[] GetBytes(string val)
		{
			var bytes = new byte[val.Length * sizeof(char)];
			System.Buffer.BlockCopy(val.ToCharArray(), 0, bytes, 0, bytes.Length);
			return bytes;
		}

	}
}