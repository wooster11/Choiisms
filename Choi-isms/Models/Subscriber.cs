using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Choiisms.Models
{
	public class Subscriber
	{
		public int SubscriberID { get; set; }
		public string Name { get; set; }
		public string EmailAddress { get; set; }
		public string EmailHash { get; set; }
	}
}