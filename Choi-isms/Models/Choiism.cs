using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Choi_isms.Models
{
	public class Choiism
	{
		public int ChoiismID { get; set; }
		public string ChoiismType { get; set; }
		public string ChoiismValue { get; set; }
		public string ChoiismCaption { get; set; }
		public string Submitter { get; set; }
	}
}