var _host = "http://tresdiseno.com/clientes/social_paraiso/drupal/node/1";//3diseño
var _hostf = "http://tresdiseno.com/clientes/social_paraiso/drupal/";//3diseño
var emulated = window.tinyHippos !== undefined;
var ismobile = (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android 3|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
var filename = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
var connect = false;
var value = window.localStorage.getItem('val_rotate') ? parseInt(window.localStorage.getItem('val_rotate')) : 0;

function index() {

    this.constructor = function() {
        createDB();
        $('body').height($(window).height() - 40);
        $('.wrap').height($(window).height() - 40);
        $('.splashico').css('left', ($(window).width() / 2) - 17);
        $('.menubottom').css('top', ($('body').height() - $('.menubottom').height()) - 260);
        $(window).resize(function() {
            $('body').height($(window).height() - 40);
            $('.wrap').height($(window).height() - 40);
            $('.splashico').css('left', ($(window).width() / 2) - 17);
        });
        document.addEventListener("backbutton", index.onBackbutton, false);
    };

    this.loadMenu = function() {
        $("#right-panel").panel({
            beforeopen: function() {
                $('html').css('position', 'fixed');
                $('.menubottom').css('top', ($('body').height() - $('.menubottom').height()) - 60);
                $('.headfix .iconmn').animate({
                    left: '-15px'
                }, 'slow');
            },
            beforeclose: function() {
                $('html').css('position', 'initial');
                $('.headfix .iconmn').animate({
                    left: '-10px'
                }, 'slow');
            }
        });
    };

    this.onBackbutton = function() {
        ToastS('Chao');
        window.localStorage.removeItem('first');
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        }
    };

    this.loadindex = function(type) {
        $('#luces').hide();
        if (window.localStorage.getItem("datema")) {
            if (type === 'l')
                window.location = 'marriage_landing.html';
            else
                go_('#landing', false);
        } else if (window.localStorage.getItem("username")) {
            go_('marriage_new.html', 0);
        } else {
            go_('#registeru', false);
        }
    };

    this.checkConnection = function() {

        if (ismobile) {
            var networkState = navigator.network.connection.type;
            //var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.NONE] = 'No network connection';

            if (states[networkState] !== 'No network connection') {
                connect = true;
            } else {
                ToastL("No hay conexión :S");
            }
        } else {
            connect = true;
            ToastS("Conectado desde navegador web.");
        }
    };

    this.session_kill = function() {
        ToastS("<span data-localize='savings_plan'>Hasta la próxima</span>");
        window.localStorage.clear();
        window.location = 'index.html#registeru';
    };

    this.print = function(o) {
        var str = '';

        for (var p in o) {
            if (typeof o[p] === 'string') {
                str += p + ': ' + o[p] + '; \n';
            } else {
                str += p + ': { \n' + print(o[p]) + '}';
            }
        }
        return str;
    };

    this.shareFacebook = function() {
        facebook.shareApp();
    };

    this.shareTwitter = function() {
        var msj = 'Planea cada detalle de tu matrimonio con Wedding Happy%0D%0A';
        msj += 'App Android http://goo.gl/npLIn %0D%0A';
        msj += 'App iOS http://goo.gl/5Rmwq';
        go_('https://twitter.com/intent/tweet?text=' + msj, 'external');
    };

    this.shareEmail = function() {
        var f_mail = '', f_subject = '', f_body = '';

        f_subject = 'Te invito a que conozcas la app móvil Wedding Happy';
        f_body = 'Hola %0D%0A';
        f_body += 'Te invito a que conozcas la app móvil de Social Paraiso, Wedding Happy. %0D%0A %0D%0A';
        f_body += 'Con esta podras planear cada detalle de tu matrimonio. %0D%0A %0D%0A';
        f_body += 'Para iOS http://goo.gl/5Rmwq %0D%0A';
        f_body += 'Para Android http://goo.gl/npLIn %0D%0A';

        window.location = 'mailto:' + f_mail + '?subject=' + f_subject + '&body=' + f_body;
    };

    this.shareSMS = function() {
        var f_body = 'Hola %0D%0A';
        f_body += 'Te invito a que conozcas la app móvil Wedding Happy, con esta podras planear cada detalle de tu matrimonio. %0D%0A %0D%0A';
        f_body += 'App Android http://goo.gl/npLIn %0D%0A';
        f_body += 'App iOS http://goo.gl/5Rmwq %0D%0A';
        window.location = 'sms:?body=' + f_body;
    };
}

var index = new index();
if (filename === 'index.html') {
    $(document).ready(function()
    {
        if (emulated) {
            index.constructor();
            ToastL('Emulador');
        } else if (ismobile)
            document.addEventListener("deviceready", index.constructor, true);
        else
            ToastL('Lo siento es un app mobile');
    });
}

var normalize = (function() {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç!¡.",
            to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
        mapping[ from.charAt(i) ] = to.charAt(i);

    return function(str) {
        var ret = [];
        for (var i = 0, j = str.length; i < j; i++) {
            var c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[ c ]);
            else
                ret.push(c);
        }
        return ret.join('');
    };

})();

var go_ = function(path, reverse) {

    if (reverse === 'external') {
        if (device.platform === 'Android') {
            navigator.app.loadUrl(path, {openExternal: true});
        } else {
            window.open(path, "_system");
        }
        return;
    }

    if ($.mobile) {
        if (reverse === 0) {
            window.location = path;
        } else {
            reverse = reverse ? true : false;
            $.mobile.changePage(path, {transition: "slide", reverse: reverse});
        }
    } else {
        window.location = path;
    }
};

$.fn.slideFadeToggle = function(speed, easing, callback) {
    return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
};