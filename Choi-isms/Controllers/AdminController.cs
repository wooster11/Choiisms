using Choiisms.Models;
using System;
using System.Configuration;
using System.Web.Mvc;
using System.Web.Security;

namespace Choiisms.Controllers
{
	public class AdminController : Controller
	{
		// GET: Admin
		public ActionResult Index()
		{
			return View();
		}
		
		public ActionResult Manage(string username, string password)
		{
			var adminModel = new Admin() { Username = username, IsLoginFailed = true };

			//No username or password or they mismatch, just go back to the login screen and display failed message
			if (String.IsNullOrWhiteSpace(username) || String.IsNullOrWhiteSpace(password) || username != ConfigurationManager.AppSettings["adminUser"] || password != ConfigurationManager.AppSettings["adminPassword"])
				return View("Index", adminModel);

			//User login is successful, so set the cookie as needed
			FormsAuthentication.SetAuthCookie(username, false);
			adminModel.IsLoginFailed = false;
			return View();
		}
	}
}