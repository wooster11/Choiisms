using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Choiisms.Core
{
	public class PagedList<T>
	{
		private const int PAGE_SIZE = 10;

		public List<T> Items { get; set; }
		public bool HasNext { get; set; }
		public bool HasPrevious { get; set; }
		public int TotalPages { get; set; }

		public PagedList(IQueryable<T> baseTableQuery, int pageNum)
		{
			this.Items = baseTableQuery.Skip(PAGE_SIZE * (pageNum - 1)).Take(PAGE_SIZE + 1).ToList(); //Take an extra item to see if we have a next page or not - extra item will be removed
			this.HasPrevious = pageNum > 1; //If on second page or later, we have previous items
			if (this.Items.Count > PAGE_SIZE)
			{
				//Mark has having a next page and drop the last item in the list
				this.HasNext = true;
				this.Items.RemoveAt(PAGE_SIZE); //Last item is the same as the page size or the index of the last item in the case when we have additional pages
			}

			this.TotalPages = Convert.ToInt32(Math.Ceiling(Convert.ToDouble(baseTableQuery.Count()) / Convert.ToDouble(PAGE_SIZE)));
		}
	}
}