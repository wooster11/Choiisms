var unsubscribeViewModel = function() {
    var self = choiismBase();
    
    self.isReady = function () {
        self.appState('unsubscribing');
    }

    self.goHome = function () {
        window.location.href = '../';
    }

    self.submitUnsubscribe = function (emailHash) {
        $.ajax({
            type: 'DELETE',
            url: '../api/Subscriber',
            contentType: 'application/json',
            data: ko.toJSON({ refid: emailHash }),
            beforeSend: function () {
                self.appState('saving');
                self.isNavDisabled(true);
            }
        })
        .always(function () {
            self.appState('confirmUnsubscribe');
        });
    }

    return self;
}

var uvm = unsubscribeViewModel();
ko.applyBindings(uvm);

$(document).ready(function () {
    uvm.isReady();
})

