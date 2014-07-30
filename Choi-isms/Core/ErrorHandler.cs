using Choiisms.Controllers;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;

namespace Choiisms.Core
{
	public static class ErrorHandler
	{
		public static IHttpActionResult HandleError(int errorCode, Exception e, ApiController controller)
		{
			new LogEvent(errorCode, e).Raise();
			Trace.WriteLine(String.Format("{0}: {1}", errorCode, e.Message), "Error");
			return new StatusCodeResult(HttpStatusCode.InternalServerError, controller);
		}
	}
}