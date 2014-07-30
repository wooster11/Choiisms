var adminViewModel = function () {
    var self = choiismBase();

    self.activeTab = ko.observable("choiisms");
    self.choiisms = ko.observableArray();
    self.subscribers = ko.observableArray();
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.pageLinks = ko.observableArray();
    self.isDirty = ko.observable(false);
    self.isChangesSaved = ko.observable(false);
    self.isChangesFailed = ko.observable(false);

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

    //Editing Functions
    self.textChanged = function (data, event) {
        self.isDirty(true);
        var arrayItem;
        if (self.activeTab() == 'choiisms')
        {
            for (i = 0; i < self.choiisms().length; i++) {
                if (self.choiisms()[i].ID == data.ID) {
                    self.choiisms()[i].type(data.type());
                    self.choiisms()[i].value(data.value());
                    self.choiisms()[i].caption(data.caption());
                    self.choiisms()[i].submitter(data.submitter());
                    self.choiisms()[i].isDirty(true);
                    break;
                }
            }
        }
        else
        {
            for (i = 0; i < self.subscribers().length; i++) {
                if (self.subscribers()[i].ID == data.ID) {
                    self.subscribers()[i].name(data.name());
                    self.subscribers()[i].email(data.email());
                    arrayItemself.subscribers()[i].isDirty(true);
                    break;
                }
            }
        }
    }

    self.saveChanges = function (data, event) {
        var arrayToCheck;
        var apiUrl;
        if (self.activeTab() == 'choiisms') {
            arrayToCheck = self.choiisms();
            apiUrl = '../api/Choiism';
        }
        else {
            arrayToCheck = self.subscribers();
            apiUrl = '../api/Subscriber';
        }

        var itemsToSave = {
            changedItems: ko.utils.arrayFilter(arrayToCheck, function (item) { return item.isDirty(); })
        };


        $.ajax({
            type: 'PUT',
            url: apiUrl,
            contentType: 'application/json',
            data: ko.toJSON(itemsToSave),
            beforeSend: function () {
                self.appState('saving');
            }
        })
        .done(function (data) {
            self.isChangesSaved(true);
            self.isDirty(false);
        })
        .fail(function (data) {
            self.isChangesFailed(true);
        })
        .always(function () {
            self.appState('viewing');
        });
    }

    self.deleteChoiism = function (data, event) {
        $.ajax({
            type: 'DELETE',
            url: '../api/Choiism/' + data.ID,
            contentType: 'application/json',
            beforeSend: function () {
                self.appState('saving');
            }
        })
        .done(function (data) {
            if (data != null) {
                var cToDelete = ko.utils.arrayFirst(self.choiisms(), function (item) {
                    return item.ID == data.ChoiismID;
                });
                self.choiisms.remove(cToDelete);
                self.isChangesSaved(true);
            }
        })
        .fail(function () {
            self.isChangesFailed(true);
        })
       .always(function () {
           self.appState('viewing');
       });
    }

    self.deleteSubscriber = function (data, event) {
        $.ajax({
            type: 'DELETE',
            url: '../api/Subscriber/' + data.ID,
            contentType: 'application/json',
            beforeSend: function () {
                self.appState('saving');
            }
        })
        .done(function (data) {
            if (data != null) {
                var subToDelete = ko.utils.arrayFirst(self.subscribers(), function (item) {
                    return item.ID == data.SubscriberID;
                });
                self.subscribers.remove(subToDelete);
                self.isChangesSaved(true);
            }
        })
        .fail(function () {
            self.isChangesFailed(true);
        })
        .always(function () {
            self.appState('viewing');
        });
    }

    self.dismissChangesSavedAlert = function () {
        self.isChangesSaved(false);
    }

    self.dismissChangesFailedAlert = function () {
        self.isChangesFailed(false);
    }

    return self;
}

var choiism = function () {
    self = this;
    self.ID = -1;
    self.type = ko.observable('');
    self.value = ko.observable('');
    self.isEditValue = ko.observable(false);
    self.caption = ko.observable('');
    self.isEditCaption = ko.observable(false);
    self.submitter = ko.observable('');
    self.isEditSubmitter = ko.observable(false);
    self.isDirty = ko.observable(false);
 
    self.editText = function (data, event) {
        data.isEditValue(false);
        data.isEditCaption(false);
        data.isEditSubmitter(false);
        switch (event.currentTarget.id)
        {
            case 'value':
                data.isEditValue(true);
                break;
            case 'caption':
                data.isEditCaption(true);
                break;
            case 'submitter':
                data.isEditSubmitter(true);
                break;
        }
    }

    return self;
}

var subscriber = function () {
    self = this;
    self.ID = -1;
    self.name = ko.observable('');
    self.isEditName = ko.observable(false);
    self.email = ko.observable('');
    self.isEditEmail = ko.observable(false);
    self.isDirty = ko.observable(false);

    self.editText = function (data, event) {
        data.isEditName(false);
        data.isEditEmail(false);
        switch (event.currentTarget.id) {
            case 'name':
                data.isEditName(true);
                break;
            case 'email':
                data.isEditEmail(true);
                break;
        }
    }

    self.updateData = function(data) {
        self.name(data.name());
        self.email(data.email());
    }

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
