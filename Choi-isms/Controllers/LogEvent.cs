using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Management;

namespace Choiisms.Controllers
{
	public class LogEvent : WebRequestErrorEvent
	{
		public LogEvent(int errorEventCode, Exception ex) : base(null, null, errorEventCode, ex)
		{
		}
	}
}