﻿using Choiisms.DAL;
using System;
using System.Linq;
using System.Web.Mvc;

namespace Choiisms.Controllers
{
	public class HomeController : Controller
	{
		private ChoiismContext db = new ChoiismContext();

		// GET: Home
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult Unsubscribe(string id)
		{
			if (String.IsNullOrWhiteSpace(id))
				return RedirectToAction("Index");
			else
			{
				var sub = db.Subscribers.FirstOrDefault(s => s.EmailHash == id);
				//if (sub == null)
				//	return RedirectToAction("Index"); //No matching subscriber found, so just go back to the main index page

				return View(sub); //Matching subscriber found, present unsubscribe page
			}
				
		}

		public ActionResult Error()
		{
			return View();
		}

	}
}