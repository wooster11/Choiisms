using Choiisms.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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

			if (String.IsNullOrWhiteSpace(username) || String.IsNullOrWhiteSpace(password) ||
				username != ConfigurationManager.AppSettings["adminUser"] || password != ConfigurationManager.AppSettings["adminPassword"])
				return View("Index", adminModel);

			adminModel.IsLoginFailed = false;
			return View();
		}
	}
}