using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using System.Web.Optimization;
using System.Data.Entity;
using Choi_isms.DAL;

namespace Choi_isms
{
	public class Global : HttpApplication
	{
		void Application_Start(object sender, EventArgs e)
		{
			Database.SetInitializer(new DropCreateDatabaseIfModelChanges<ChoiismContext>());
			// Code that runs on application startup
			AreaRegistration.RegisterAllAreas();
			BundleConfig.RegisterBundles(BundleTable.Bundles);
			GlobalConfiguration.Configure(WebApiConfig.Register);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			
		}
	}
}