function ChoiismViewModel() {
    var self = this;
    self.ID = -1;
    self.type = ko.observable("");
    self.value = ko.observable("");
    self.caption = ko.observable("");
    self.submitter = ko.observable("");
    self.appState = ko.observable("loading"); //loading, viewing, submitting

    //Submission form observables
    self.selectedChoiismType = ko.observable("string");
    self.submitName = ko.observable("");
    self.isSubmitNameInvalid = ko.observable(false);
    self.submitStringChoiismValue = ko.observable("");
    self.isSubmitStringChoiismValueInvalid = ko.observable(false);
    self.submitImageUrl = ko.observable("");
    self.isSubmitImageUrlInvalid = ko.observable(false);
    self.submitImageCaption = ko.observable("");
    self.submitLinkUrl = ko.observable("");
    self.isSubmitLinkUrlInvalid = ko.observable(false);
    self.submitLinkCaption = ko.observable("");

    self.linkCaption = ko.computed(function () {
        if (self.caption() == null)
            return self.value();
        else
            return self.caption().length > 0 ? self.caption() : self.value();
    }, this);

    self.getChoiism = function () {
        var choiismUrl = 'api/Choiism';
        if (self.ID > 0)
            choiismUrl += '/' + self.ID;

        $.ajax({
            type: 'GET',
            url: choiismUrl,
            contentType: 'application/json',
            beforeSend: function() {
                self.appState('loading');
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
        });
    }

    self.goHome = function () {
        self.appState('viewing');
        self.resetSubmitForm();
        self.selectedChoiismType('string');
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
        self.isSubmitNameInvalid(self.submitName().length <= 2); //Name must be at least 2 characters long
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
            });
        }

        return false; //Return false to prevent actual submitting of form for Knockout
    }

    self.isUrl = function (urlValue) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(urlValue);
    }

}

var cvm = new ChoiismViewModel();
ko.applyBindings(cvm);
cvm.getChoiism();