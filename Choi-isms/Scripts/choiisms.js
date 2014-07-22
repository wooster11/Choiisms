var choiismViewModel = function () {
    var self = choiismBase();
    self.ID = 1;
    self.type = ko.observable('');
    self.value = ko.observable('');
    self.caption = ko.observable('');
    self.submitter = ko.observable('');

    //Submit form observables
    self.selectedChoiismType = ko.observable("string");
    self.submitName = ko.observable('');
    self.isSubmitNameInvalid = ko.observable(false);
    self.submitStringChoiismValue = ko.observable('');
    self.isSubmitStringChoiismValueInvalid = ko.observable(false);
    self.submitImageUrl = ko.observable('');
    self.isSubmitImageUrlInvalid = ko.observable(false);
    self.submitImageCaption = ko.observable('');
    self.submitLinkUrl = ko.observable('');
    self.isSubmitLinkUrlInvalid = ko.observable(false);
    self.submitLinkCaption = ko.observable('');

    //Subscribe form observables
    self.subscriberName = ko.observable('');
    self.successSubscriberName = ko.observable('');
    self.isSubscriberNameInvalid = ko.observable(false);
    self.subscriberEmail = ko.observable('');
    self.isSubscriberEmailInvalid = ko.observable(false);
    self.isSubscribedSuccess = ko.observable(false);

    self.linkCaption = ko.computed(function () {
        if (self.caption() == null)
            return self.value();
        else
            return self.caption().length > 0 ? self.caption() : self.value();
    }, this);

    self.getChoiism = function (retrievalType) {
        var choiismUrl = 'api/Choiism';
        if (self.ID > 0)
            choiismUrl += '/' + self.ID;
            
        $.ajax({
            type: 'GET',
            url: choiismUrl,
            contentType: 'application/json',
            data: "retrievalType=" + retrievalType,
            beforeSend: function() {
                self.appState('loading');
                self.isNavDisabled(true);
            }
        })
        .done(function (data) {
            if (data != null) {
                self.ID = data.ChoiismID;
                self.type(data.ChoiismType);
                self.value(data.ChoiismValue);
                self.caption(data.ChoiismCaption);
                self.submitter("Submitted by " + data.Submitter);
            }
        })
        .always(function () {
            self.appState('viewing');
            self.isNavDisabled(false);
        });

        return true;
    }

    self.goHome = function () {
        self.appState('viewing');
        self.resetSubmitForm();
        self.resetSubscribeForm(false);
    }
    
    self.selectedChoiismType.subscribe(function () {
        self.resetSubmitForm();
    })

    self.resetSubmitForm = function () {
        self.submitName('');
        self.isSubmitNameInvalid(false);
        self.submitStringChoiismValue('');
        self.isSubmitStringChoiismValueInvalid(false);
        self.submitImageUrl('');
        self.isSubmitImageUrlInvalid(false);
        self.submitImageCaption('');
        self.submitLinkUrl('');
        self.isSubmitLinkUrlInvalid(false);
        self.submitLinkCaption('');
        self.selectedChoiismType('string');
    }

    self.goToSubmit = function () {
        self.appState('submitting');
    }

    self.submitChoiism = function () {
        var isBaseInputsValid = false;
        var invalidElement;
        switch (self.selectedChoiismType())
        {
            case 'string':
                isBaseInputsValid = self.submitStringChoiismValue().length >= 5; //Choi-ism must be at least 5 characters long
                self.isSubmitStringChoiismValueInvalid(!isBaseInputsValid);
                invalidElement = $('#ChoiismStringValue');
                break;
            case 'image':
                isBaseInputsValid = self.isUrl(self.submitImageUrl());
                self.isSubmitImageUrlInvalid(!isBaseInputsValid);
                invalidElement = $('#ChoiismImageUrl');
                break;
            case 'link':
                isBaseInputsValid = self.isUrl(self.submitLinkUrl());
                self.isSubmitLinkUrlInvalid(!isBaseInputsValid);
                invalidElement = $('#ChoiismLinkUrl');
                break;
        }

        //Select and Focus invalid element if needed
        if (!isBaseInputsValid) {
            invalidElement.select();
            invalidElement.focus();
        }

        //Validate the submitter name
        self.isSubmitNameInvalid(self.submitName().length < 2); //Name must be at least 2 characters long
        if (self.isSubmitNameInvalid() && isBaseInputsValid) //Only focus and select on the name if all base inputs were valid and this is the last field that failed
        {
            $('#ChoiismSubmitter').select();
            $('#ChoiismSubmitter').focus();
        }
        
        //Form is completely valid so submit
        if (isBaseInputsValid && !self.isSubmitNameInvalid())
        {
            $.ajax({
                type: 'POST',
                url: 'api/Choiism',
                contentType: 'application/json',
                data: ko.toJSON(self),
                beforeSend: function () {
                    self.appState('saving');
                    self.isNavDisabled(true);
                }
            })
            .done(function (data) {
                if (data != null) {
                    self.ID = data.ChoiismID;
                    self.type(data.ChoiismType);
                    self.value(data.ChoiismValue);
                    self.caption(data.ChoiismCaption);
                    self.submitter("Submitted by " + data.Submitter);
                }
            })
            .always(function () {
                self.goHome();
                self.isNavDisabled(false);
            });
        }

        return false; //Return false to prevent actual submitting of form for Knockout
    }

    self.goToSubscribe = function () {
        self.appState("subscribing");
    }

    self.resetSubscribeForm = function (keepSuccess) {
        self.subscriberName('');
        self.isSubscriberNameInvalid(false);
        self.subscriberEmail('');
        self.isSubscriberEmailInvalid(false);
        self.isSubscribedSuccess(keepSuccess);
    }

    self.submitSubscriber = function () {
        self.isSubscriberNameInvalid(self.subscriberName().length < 2);
        self.isSubscriberEmailInvalid(!self.isEmail(self.subscriberEmail()));
        if (self.isSubscriberNameInvalid())
        {
            $('#SubscriberName').select();
            $('#SubscriberName').focus();
            return;
        }
        if (self.isSubscriberEmailInvalid())
        {
            $('#SubscriberEmail').select();
            $('#SubscriberEmail').focus();
            return;
        }

        var subData = { subscriberName: self.subscriberName(), subscriberEmail: self.subscriberEmail() };

        $.ajax({
            type: 'POST',
            url: 'api/Subscriber',
            contentType: 'application/json',
            data: ko.toJSON(subData),
            beforeSend: function () {
                self.isNavDisabled(true);
            }
        })
        .done(function (data) {
            if (data != null) {
                self.isSubscribedSuccess(data.SubscriberID > 0);
                self.successSubscriberName(self.subscriberName());
                self.resetSubscribeForm(true);
            }
        })
        .always(function () {
            self.isNavDisabled(false);
        });
    }

    self.isUrl = function (urlValue) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(urlValue);
    }

    self.isEmail = function (emailValue) {
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(emailValue);
    }

    return self;
}

var cvm = choiismViewModel();
ko.applyBindings(cvm);
cvm.getChoiism('random');