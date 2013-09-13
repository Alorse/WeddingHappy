/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function()
{
    if (emulated)
        onDeviceMN();
    else if (ismobile)
        document.addEventListener("deviceready", onDeviceMN, true);
    else
        ToastL('Lo siento es un app mobile');
});

var value = 0;

var onDeviceMN = function() {
    
    $('body').height($(window).height() - 40);
    $('#name').val(window.localStorage.getItem("username"));

    $('#photo').click(function() {
        var filename = $(this).val().substring($(this).val().lastIndexOf('\\') + 1);
        $('#selphoto').html(filename);
    });

    $("#image").rotate(value);
    
    $('#date').focus(function() {
        document.getElementById('date').type = 'date';
    });

    $("#ciudad").change(function() {
        if ($(this).val() === "0")
            $(this).addClass("empty");
        else
            $(this).removeClass("empty");
    });
    $("#ciudad").change();
};

var register_merriage = function() {
    index.checkConnection();
    if (connect) {
        $('#luces').show();
        var nameME = $('#name').val();
        var emailME = window.localStorage.getItem("email");
        var nameAF = $('#fiance').val();
        var emailAF = $('#emailfiance').val();
        var dateMA = $('#date').val();
        var city = $('#city').val();
        var photo = $('#photo').val();

        var _page = "?mode=marriage_new";
        //var _page = "?mode=img_upload";

        $.ajax({
            type: 'GET',
            url: _host + _page,
            data: {
                nameme: nameME,
                emailme: emailME,
                nameaf: nameAF,
                emailaf: emailAF,
                datema: dateMA,
                city: city,
                photo: photo
            },
            success: function(data) {
                var dat = data.replace(/\s/g, '');
                switch (dat) {
                    case '1':
                        $("#invalid_reg").hide();
                        save_marriage();
                        ToastL("El matrimonio se ha creado con exito");
                        break;
                    case '0':
                        $("#invalid_reg").show().addClass("error_msg_003").html('Ha ocurrido un fallo en nuestro servicio, intentalo más tarde.');
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
        ToastL("No hay conexión a internet");
    }
};

var img_upload = function(imageURI) {
    $('#luces').show();
    var _page = "?mode=img_upload";

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    var params = {};
    params.email = window.localStorage.getItem("email");

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(_host + _page), win, fail, options);
};


var load_img = function() {
    navigator.camera.getPicture(uploadPhoto,
            function(message) {
                ToastS('No se eligió imagen');
            },
            {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY}
    );
};

function uploadPhoto(imageURI) {
    $('#luces').show();
    var _page = "?mode=img_upload";

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    var params = {};
    params.email = window.localStorage.getItem("email");
    //params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(_host + _page), win, fail, options);
}

function win(r) {
    $('#luces').hide();
    var urlimg = r.response.replace(/\s/g, '');
    //alert(urlimg);
    window.localStorage.setItem('photo', urlimg);
    //$('#imgma').show().html('<img src="' + urlimg + '?' + new Date().getTime() + '" style="max-width: ' + (screen.width / 2.4) + 'px;" id="image" /><br /><button id="rotar" onclick="rotar();">Rotar</button>');
    //$("#image").rotate(value);
    ToastL('Foto cargada correctamente, continúa con el registro.');
}

function fail(error) {
    $('#luces').hide();
    console.log("upload error source " + error.source);
    alert("upload error source " + error.source);
}

//http://jsfiddle.net/8LV3p/4490/
var submit_form = function() {
    alert($('#date').val());
};


var save_marriage = function() {
    //Obtengo nuevamente los datos del formulario
    var nameME = $('#name').val();
    var nameAF = $('#fiance').val();
    var emailAF = $('#emailfiance').val();
    var dateMA = $('#date').val();
    var city = $('#city').val();
    //var photo = $('#photo').val();

    //almaceno en local los datos del matriminio para crear crear el perfil
    window.localStorage.setItem('nameme', nameME);
    window.localStorage.setItem('nameaf', nameAF);
    window.localStorage.setItem('emailaf', emailAF);
    window.localStorage.setItem('datema', dateMA);
    window.localStorage.setItem('city', city);
    

    //redirecciono a registrar matrimonio si viene del registro
    window.location = 'marriage_landing.html';
};

var rotar = function() {
    value += 90;
    $("#image").rotate({angle: 0, animateTo: value, easing: $.easing.easeInOutExpo});
    if (value === 360)
        value = 0;
    if ($("#image").height() < $("#image").width())
        $("#image").css('margin', (($("#image").height() / 2)) + 'px 0');
    window.localStorage.removeItem('val_rotate');
    window.localStorage.setItem('val_rotate', value);
    ToastS('rota a ' + value);
};