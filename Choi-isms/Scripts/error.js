var errorViewModel = function () {
    var self = choiismBase();

    self.goHome = function () {
        window.location.href = '../';
    }

    return self;
}

var evm = errorViewModel();
ko.applyBindings(evm);
