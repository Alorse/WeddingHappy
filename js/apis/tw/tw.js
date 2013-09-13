/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/* Inicio plugin twitter */
function twitter() {

    this.oauth;
    this.requestParams;
    this.options = {
        consumerKey: 'Ggrjbvt4xxv3VKBKkArllw',
        consumerSecret: 'qhUkDLXoLYazMI5iit4m8wY498K4fpxyld5M4MQWJY',
        callbackUrl: 'http://www.socialparaiso.net/'};
    this.mentionsId = 0;
    this.localStoreKey = "tmt6p1";

    this.ref = null;
    this.loc = null;

    this.login = function() {
        if (true) {
            twitter.tw_connect();
            // Note: Consumer Key/Secret and callback url always the same for this app.        
            ToastS('Obteniendo autorización...');
            oauth = OAuth(options);
            oauth.get('https://api.twitter.com/oauth/request_token',
                    function(data) {
                        requestParams = data.text;
                        console.log("AppLaudLog: requestParams: " + data.text);
                        ref = window.open(encodeURI('https://api.twitter.com/oauth/authorize?' + data.text), '_blank', 'location=no');
                        ref.addEventListener('loadstop', function(event) {
                            loc = event.url;
                            //alert('loadstop => ' + event.url); //Linea a comentar
                            if (loc.indexOf("http://www.socialparaiso.net/?") >= 0) {
                                var verifier = '';
                                var params = loc.substr(loc.indexOf('?') + 1);

                                params = params.split('&');
                                for (var i = 0; i < params.length; i++) {
                                    var y = params[i].split('=');
                                    if (y[0] === 'oauth_verifier') {
                                        verifier = y[1];
                                        tw_connect();
                                    }
                                }
                                ref.close();
                            }
                        });
                        ref.addEventListener('loaderror', function(event) {
                            ref.close();
                            console.log('error: ' + event.message);
                        });
                        ref.addEventListener('exit', function(event) {
                            ref.close();
                            console.log(event.type);
                        });
                        ref.addEventListener('loadstart', function(event) {
                            loc = event.url;
                            if (loc.indexOf("http://www.socialparaiso.net/?") >= 0) {
                                var verifier = '';
                                var params = loc.substr(loc.indexOf('?') + 1);

                                params = params.split('&');
                                for (var i = 0; i < params.length; i++) {
                                    var y = params[i].split('=');
                                    if (y[0] === 'oauth_verifier') {
                                        verifier = y[1];
                                        tw_connect();
                                    }
                                }
                                ref.close();
                            }
                        });
                    },
                    function(data) {
                        ToastL('Error : No Authorization');
                        console.log("AppLaudLog: 2 Error " + data);
                        ToastS('Error durante la autorización');
                    }
            );
        }
    };

    this.tw_connect = function() {

        if (loc !== null) {
            console.log("AppLaudLog: onLocationChange : " + loc);
            // If user hit "No, thanks" when asked to authorize access
            if (loc.indexOf("http://www.socialparaiso.net/?denied") >= 0) {
                ToastS('Usuario negó el acceso');
                ref.close();
                return;
            }

            // Same as above, but user went to app's homepage instead
            // of back to app. Don't close the browser in this case.
            if (loc === "http://www.socialparaiso.net/") {
                ToastS('Usuario negó el acceso');
                return;
            }

            // The supplied oauth_callback_url for this session is being loaded
            if (loc.indexOf("http://www.socialparaiso.net/?") >= 0) {
                var verifier = '';
                var params = loc.substr(loc.indexOf('?') + 1);

                params = params.split('&');
                for (var i = 0; i < params.length; i++) {
                    var y = params[i].split('=');
                    if (y[0] === 'oauth_verifier') {
                        verifier = y[1];
                        ref.close();
                    }
                }
                // Exchange request token for access token
                oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier=' + verifier + '&' + requestParams,
                        function(data) {

                            var accessParams = {};
                            var qvars_tmp = data.text.split('&');
                            for (var i = 0; i < qvars_tmp.length; i++) {
                                var y = qvars_tmp[i].split('=');
                                accessParams[y[0]] = decodeURIComponent(y[1]);
                            }
                            console.log('AppLaudLog: ' + accessParams.oauth_token + ' : ' + accessParams.oauth_token_secret);
                            oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);

                            // Save access token/key in localStorage
                            var accessData = {};
                            accessData.accessTokenKey = accessParams.oauth_token;
                            accessData.accessTokenSecret = accessParams.oauth_token_secret;
                            console.log("AppLaudLog: Storing token key/secret in localStorage");
                            localStorage.setItem(localStoreKey, JSON.stringify(accessData));

                            oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
                                    function(data) {
                                        var entry = JSON.parse(data.text);
                                        $("#name").attr('value', entry.screen_name);
                                        $("#typereg").attr('value', 't');
                                        $("#password").hide().attr('value', 'T-C.s_p' + entry.screen_name);
                                        console.log("Login Twitter: Nombre: " + entry.screen_name);
                                    },
                                    function(data) {
                                        var entry = JSON.parse(data.text);
                                        alert(print(data));
                                        ToastL('Error al obtener las credenciales de usuario');
                                        console.log("Error al obtener las credenciales de usuario: " + data);
                                    }
                            );
                            ref.close();
                        },
                        function(data) {
                            var entry = JSON.parse(data.text);
                            alert(print(data));
                            ToastL('Error during authorization');
                        }
                );
            }
        } // end if
    };

    this.get_email = function(username, password) {
        checkConnection();
        if (connect) {
            var _page = "?mode=get_email";

            $.ajax({
                type: 'GET',
                url: _host + _page,
                data: {
                    username: username,
                    password: md5(md5(password))
                },
                success: function(data) {
                    switch (data.charAt(0)) {
                        case '0':
                            window.localStorage.setItem('twname', username);
                            window.localStorage.setItem('twpass', password);

                            window.location = 'user_register.html';
                            break;
                        default :
                            $("#email").attr('value', data);
                            
                            break;
                    }
                },
                error: function(data) {
                    ToastL('Se ha producido un error en el dispositivo.');
                }
            });
            return false;
        } else {
            ToastL("No hay conexión a internet");
        }
    };
}

var twitter = new twitter();