using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Choi_isms.Models;

namespace Choi_isms.DAL
{
	public class ChoiismContext : DbContext
	{
		public ChoiismContext()
			: base("ChoiismsConn")
		{
		}

		public DbSet<Choiism> Choiisms { get; set; }
	}
}