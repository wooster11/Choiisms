var choiismBase = function () {
    self = {};
    self.isNavDisabled = ko.observable(true);
    self.appState = ko.observable("loading");

    self.goHome = function () { window.location.href = '../'; };
    self.goToSubmit = function () { };
    self.goToSubscribe = function () { };

    return self;
}