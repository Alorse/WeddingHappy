/**
 * Cordova StartApp plugin
 * Author: Dmitry Medvinsky <dmedvinsky@gmail.com>
 * License: MIT/X11
 */
var StartApp = function() { };

StartApp.prototype.start = function(params, success, fail) {
    success = success ? success : function() {};
    fail = fail ? fail : function() {};
    var component = params.android;
    return cordova.exec(success, fail, 'StartApp', 'startApp', [component]);
};

function successCallback(result) {
    ToastS(result);
}
function failureCallback(error) {
    ToastL(error);
}

window.startapp = new StartApp();
