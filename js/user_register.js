$(document).ready(function()
{
    if (emulated)
        onDeviceUR();
    else if (ismobile)
        document.addEventListener("deviceready", onDeviceUR, true);
    else
        ToastL('Lo siento es un app mobile');
});

var ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

var onDeviceUR = function() {
    $('.border1').height($(window).height() - 50);
};

var register_native = function() {

    index.checkConnection();
    if (connect) {
        $('#luces').show();
        var username = $('#name').val();
        var email = $('#email').val();
        var password = md5(md5($('#password').val()));
        var typereg = $('#typereg').val();
        var _page = "?mode=register";

        if (ck_email.test(email) && username.length >= 4 && password.length >= 4) {
            $.ajax({
                type: 'GET',
                url: _host + _page,
                data: {
                    username: username,
                    email: email,
                    password: password,
                    typereg: typereg
                },
                success: function(data) {
                    var dat = data.replace(/\s/g, '');
                    switch (dat) {
                        case '1':
                            $("#invalid_reg").hide();
                            ToastL("Usuario registrado correctamente.");
                            save_login();
                            break;
                        case '2':
                            if (typereg === 'n')
                                $("#invalid_reg").show().addClass("warning_msg_003").html('El nombre o la dirección de correo electrónico ya está registrado.');
                            else {
                                go_('#loginu', false);
                                user_login();
                            }
                            break;
                        default :
                            $("#invalid_reg").show().addClass("error_msg_003").html('Se ha producido un error en el registro.' + data);
                            break;
                    }
                    $('#luces').hide();
                },
                error: function(data) {
                    $("#invalid_reg").show().html('Se ha producido un error en el dispositivo.');
                    $('#luces').hide();
                    //alert("llega aquí");
                }
            });
        } else {
            $("#invalid_reg").show().addClass("info_msg_003").html('Por favor completa todos los campos');
            $('#luces').hide();
        }
    } else {
        ToastL("No hay conexión a internet");
    }
};

var save_login = function() {
    //Si es un registro, limpia el local storange
    window.localStorage.clear();
    //Obtengo nuevamente los datos del formulario de registro o login
    var username = $('#name').val();
    var email = $('#email').val();
    var typereg = $('#typereg').val();

    //almaceno en local los datos de registro para crear la sesión
    window.localStorage.setItem('username', username);
    window.localStorage.setItem('email', email);
    window.localStorage.setItem('typereg', typereg);

    //redirecciono a registrar matrimonio si viene del registro
    window.location = 'marriage_new.html';
};

var user_login = function() {
    index.checkConnection();
    if (connect) {
        $('#luces').show();
        var email = $('#emaill').val();
        var password = $('#passwordl').val();

        var _page = "feed-usuarios";

        $.ajax({
            type: 'GET',
            url: _hostf + _page,
            dataType: "xml",
            data: {
                correo: email,
                password: password
            },
            success: function(data) {
                $(data).find('users').each(function() {
                    $(this).find('user').each(function() {
                        window.localStorage.setItem('username', $(this).find('Usuario').text());
                        window.localStorage.setItem('email', $(this).find('Correo-usuario').text());
                        window.localStorage.setItem('nameme', $(this).find('Nombre-completo').text());
                        window.localStorage.setItem('nameaf', $(this).find('Afortunado').text());
                        window.localStorage.setItem('emailaf', $(this).find('Email-afortunado').text());
                        window.localStorage.setItem('datema', $(this).find('Fecha-matrimonio').text());
                        window.localStorage.setItem('city', $(this).find('Ciudad').text());
                        window.localStorage.setItem('photo', $(this).find('Foto').text());
                        window.localStorage.setItem('typereg', $(this).find('Tipo-registro').text());
//                        save_loginl();
                        sync.constructor();
                    });
                });
            },
            error: function(data) {
                ToastL("Problemas leyendo el XML");
                $('#luces').hide();
            }
        });
    } else {
        $('#luces').hide();
        ToastS('No hay conexión a Internet');
    }
};

var save_loginl = function() {
    if (window.localStorage.getItem("datema")) {
        window.location = 'marriage_landing.html';
    } else if (window.localStorage.getItem("username")) {
        window.location = 'marriage_new.html';
    }
};