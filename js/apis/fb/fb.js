
//var App_ID = 313084688825944; // Mio
var App_ID = 653272954686930; // Adriana
/* Inicio Plugin Facebook */

function facebook() {

    this.constructor = function() {
        document.addEventListener('deviceready', function() {
            try {
                FB.init({
                    appId: App_ID, //mio
                    nativeInterface: CDV.FB,
                    useCachedDialogs: false
                });
            } catch (e) {
                alert(e);
            }
        }, false);
    };

    this.go_back = function() {
        //window.location = 'goal_view.html';
    };

    this.login = function() {
        if (true) {
            FB.login(
                    function(response) {
                        if (response) {
//                            ToastS('entra al login');
                            facebook.getMeinfo();
                        } else {
                            alert('No se pudo conectar con facebook');
//                        fb_me();
                        }
                    },
                    {scope: "email"}
            );
        }
    };

    this.logout = function() {
        FB.logout(function(response) {
            //ToastS('logged out');
        });
    };

    this.getLoginStatus = function() {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                return true;
            } else {
                return false;
            }
        });
    };

    this.getMeinfo = function() {
        ToastS('entra obtener datos');
        FB.api('/me', {
            fields: 'name, picture, email' // lo que le pido a FB
        }, function(response) {
            if (response.error) {
                alert(JSON.stringify(response.error));
                facebook.logout();
            } else {
                user = response; // contiene los campos que le solicité a FB
                console.log('Conectó con facebook ' + JSON.stringify(response));
                $("#name").attr('value', user.name);
                $("#email").attr('value', user.email);
                $("#emaill").attr('value', user.email);
                $("#password").attr('value', 'facebookconnect' + user.email);
                $("#passwordl").attr('value', 'facebookconnect' + user.email);
                $("#typereg").attr('value', 'f');
                $("#password").hide();
                //publishGoalFriend();
                register_native();
            }
        });
    };

    this.shareApp = function() {
        ToastS('Llega a la función');
        var params = {
            method: 'feed',
            name: 'Wedding Happy - Social Paraiso',
            link: 'http://www.socialparaiso.net/',
            picture: _hostf + 'f8.jpg',
            caption: 'Acabo de crear mi matrimonio',
            description: 'Texto 140 caracteres...',
            properties: [
                {text: 'Para iOS  ', href: 'http://goo.gl/5Rmwq'},
                {text: 'Para Android', href: 'http://goo.gl/npLIn'}
            ]
        };
        FB.ui(params, function(obj) {
            console.log(obj);
//            alert(index.print(obj));
        });
    };
}


if ((typeof cordova === 'undefined') && (typeof Cordova === 'undefined'))
    ToastL('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV === 'undefined')
    ToastL('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if (typeof FB === 'undefined')
    ToastL('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

FB.Event.subscribe('auth.login', function(response) {
//    ToastS('1. login FB' + response);
});

FB.Event.subscribe('auth.logout', function(response) {
//    ToastS('2. auth.logout event' + response);
});

FB.Event.subscribe('auth.sessionChange', function(response) {
//    ToastS('3. auth.sessionChange event' + response);
});

FB.Event.subscribe('auth.statusChange', function(response) {
//    ToastS('4. auth.statusChange event' + response);
});

var facebook = new facebook();

$(document).ready(function()
{
    document.addEventListener("deviceready", facebook.constructor, true);
});