namespace Choiisms.Migrations
{
	using Choiisms.Models;
	using System;
	using System.Data.Entity;
	using System.Data.Entity.Migrations;
	using System.Linq;

	internal sealed class Configuration : DbMigrationsConfiguration<Choiisms.DAL.ChoiismContext>
	{
		public Configuration()
		{
			AutomaticMigrationsEnabled = true;
			AutomaticMigrationDataLossAllowed = true;
			ContextKey = "Choiisms.DAL.ChoiismContext";
		}

		protected override void Seed(Choiisms.DAL.ChoiismContext context)
		{
			context.Choiisms.AddOrUpdate(
				c => c.ChoiismValue,
				new Choiism() { ChoiismValue = "You can never have enough ketchup.", ChoiismType = "string", Submitter = "Derek Woo" },
				new Choiism() { ChoiismValue = "Check your door to make sure it's closed at least six times.", ChoiismType = "string", Submitter = "Derek Woo" },
				new Choiism() { ChoiismValue = "Unlock the locked door and lock it again to make sure.", ChoiismType = "string", Submitter = "Derek Woo" },
				new Choiism() { ChoiismValue = "https://farm3.staticflickr.com/2912/14484666159_0500a86bb0_z.jpg", ChoiismType = "image", Submitter = "Derek Woo" },
				new Choiism() { ChoiismValue = "I gave it to your sister.", ChoiismType = "string", Submitter = "Derek Woo" },
				new Choiism() { ChoiismValue = "I'm always late. People can wait for me.", ChoiismType = "string", Submitter = "Derek Woo" },
				new Choiism() { ChoiismValue = "It's ok officer... I'm a 4.0 GPA student.", ChoiismType = "string", Submitter = "Ruben Munoz" },
				new Choiism() { ChoiismValue = "You can never shoot a basketball off the backboard hard enough.", ChoiismType = "string", Submitter = "Derek Woo" },
				new Choiism() { ChoiismValue = "You can never have enough ranch.", ChoiismType = "string", Submitter = "Ruben Munoz" }
				);

			context.Subscribers.AddOrUpdate(
				s => s.EmailAddress,
				new Subscriber() { EmailAddress = "derek.c.woo@gmail.com", Name = "Derek Woo", EmailHash = "F109A467CCF574D1E8EEE25949A9CA2BEEE88F61" }
				);

			base.Seed(context);
			context.SaveChanges();
		}
	}
}
