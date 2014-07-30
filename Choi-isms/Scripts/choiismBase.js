var choiismBase = function () {
    self = {};
    self.isNavDisabled = ko.observable(true);
    self.appState = ko.observable("loading");

    self.goHome = function () { window.location.href = '../'; };
    self.goToSubmit = function () { };
    self.goToSubscribe = function () { };

    return self;
}

ko.bindingHandlers.hasSelectedFocus = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.bindingHandlers['hasfocus'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.bindingHandlers['hasfocus'].update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

        var selected = ko.utils.unwrapObservable(valueAccessor());
        if (selected) element.select();
    }
};