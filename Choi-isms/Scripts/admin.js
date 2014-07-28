var adminViewModel = function () {
    var self = choiismBase();

    self.activeTab = ko.observable("choiisms");
    self.choiisms = ko.observableArray();
    self.subscribers = ko.observableArray();
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.pageLinks = ko.observableArray();

    self.tabClicked = function (data, event) {
        self.activeTab(event.currentTarget.id);
        if (self.activeTab() == 'choiisms')
            self.loadChoiisms(1);
        else
            self.loadSubscribers(1);
    }

    self.pageLinkClicked = function (data, event) {
        if (self.activeTab() == 'choiisms')
            self.loadChoiisms(data.pageNumber());
        else
            self.loadSubscribers(data.pageNumber());
    }

    self.goToPageByDirection = function (data, event) {
        if ((event.currentTarget.id == 'next' && self.hasNext()) || (event.currentTarget.id == 'previous' && self.hasPrevious()))
        {
            var currentPage;
            for (i = 0; i < self.pageLinks().length; i++)
            {
                if (self.pageLinks()[i].isActive()) {
                    currentPage = self.pageLinks()[i].pageNumber();
                    break;
                }
            }
            var toPage = currentPage + (event.currentTarget.id == 'next' ? 1 : -1);

            if (self.activeTab() == 'choiisms')
                self.loadChoiisms(toPage);
            else
                self.loadSubscribers(toPage);
        }
    }

    self.loadChoiisms = function (pageNum) {
        $.ajax({
            type: 'GET',
            url: '../api/Choiism',
            contentType: 'application/json',
            data: "pageNum=" + pageNum,
            beforeSend: function () {
                self.appState('loading');
                self.choiisms.removeAll();
                self.pageLinks.removeAll();
            }
        })
       .done(function (data) {
           if (data != null) {
               for (i = 0; i < data.Items.length; i++)
               {
                   var c = new choiism();
                   c.ID = data.Items[i].ChoiismID;
                   c.type(data.Items[i].ChoiismType);
                   c.value(data.Items[i].ChoiismValue);
                   c.caption(data.Items[i].ChoiismCaption);
                   c.submitter(data.Items[i].Submitter);
                   self.choiisms.push(c);
               }
               self.hasPrevious(data.HasPrevious);
               self.hasNext(data.HasNext);
               for (i = 1; i <= data.TotalPages; i++)
               {
                   var p = new pageLink();
                   p.pageNumber(i);
                   p.isActive(i == pageNum);
                   self.pageLinks.push(p);
               }
            }
       })
       .always(function () {
           self.appState('viewing');
       });
    }

    self.loadSubscribers = function (pageNum) {
        $.ajax({
            type: 'GET',
            url: '../api/Subscriber',
            contentType: 'application/json',
            data: "pageNum=" + pageNum,
            beforeSend: function () {
                self.appState('loading');
                self.subscribers.removeAll();
                self.pageLinks.removeAll();
            }
        })
       .done(function (data) {
           if (data != null) {
               for (i = 0; i < data.Items.length; i++) {
                   var s = new subscriber();
                   s.ID = data.Items[i].SubscriberID;
                   s.name(data.Items[i].Name);
                   s.email(data.Items[i].EmailAddress);
                   self.subscribers.push(s);
               }
               self.hasPrevious(data.HasPrevious);
               self.hasNext(data.HasNext);
               for (i = 1; i <= data.TotalPages; i++) {
                   var p = new pageLink();
                   p.pageNumber(i);
                   p.isActive(i == pageNum);
                   self.pageLinks.push(p);
               }
           }
       })
       .always(function () {
           self.appState('viewing');
       });
    }

    return self;
}

var choiism = function () {
    self = this;
    self.ID = -1;
    self.type = ko.observable('');
    self.value = ko.observable('');
    self.caption = ko.observable('');
    self.submitter = ko.observable('');

    return self;
}

var subscriber = function () {
    self = this;
    self.ID = -1;
    self.name = ko.observable('');
    self.email = ko.observable('');

    return self;
}

var pageLink = function () {
    self = this;
    self.pageNumber = ko.observable(-1);
    self.isActive = ko.observable(false);

    return self;
}

var avm = adminViewModel();
ko.applyBindings(avm);
avm.loadChoiisms(1);
