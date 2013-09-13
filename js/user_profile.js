$(document).ready(function()
{
    if (emulated)
            onDeviceUP();
        else if (ismobile)
            document.addEventListener("deviceready", onDeviceUP, true);
        else
            ToastL('Lo siento es un app mobile');
});

var value = window.localStorage.getItem('val_rotate') ? parseInt(window.localStorage.getItem('val_rotate')) : 0;

var onDeviceUP = function() {
    $('#my-name').val(window.localStorage.getItem("nameme"));
    $('#my-email').val(window.localStorage.getItem("email"));
    $('#m-date').val(window.localStorage.getItem("datema"));
    $('#m-name').val(window.localStorage.getItem("nameaf"));
    $('#ciudad').val(window.localStorage.getItem("city"));
    $('#m-email').val(window.localStorage.getItem("emailaf"));
    $('#imgma').attr("src", window.localStorage.getItem("photo"));
    
    $('#imgma').css('max-width', $(document).width());
    $("#imgma").rotate(value);
    
    $('#m-date').click(function() {
        $('#m-date').val('');
    });
};

var update_merriage = function() {

    index.checkConnection();
    if (connect) {
$('#luces').show();
        var nameME = $('#my-name').val();
        var emailME = $('#my-email').val();
        var nameAF = $('#m-name').val();
        var emailAF = $('#m-email').val();
        var dateMA = $('#m-date').val();
        var city = $('#city').val();
        var photo = $('#photo').val();

        var _page = "?mode=marriage_new";

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
                        save_profile();
                        ToastL("El matrimonio se ha actuazalido con exito");
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

var submit_form = function() {
    alert($('#date').val());
};


var save_profile = function() {
    //Obtengo nuevamente los datos del formulario
    var nameME = $('#my-name').val();
    var emailME = $('#my-email').val();
    var nameAF = $('#m-name').val();
    var emailAF = $('#m-email').val();
    var dateMA = $('#m-date').val();
    var city = $('#city').val();
    var photo = $('#photo').val();

    //Almaceno en local los datos del matriminio para crear crear el perfil
    window.localStorage.setItem('nameme', nameME);
    window.localStorage.setItem('email', emailME);
    window.localStorage.setItem('nameaf', nameAF);
    window.localStorage.setItem('emailaf', emailAF);
    window.localStorage.setItem('datema', dateMA);
    window.localStorage.setItem('city', city);
    //window.localStorage.setItem('photo', photo);

    window.location = 'marriage_landing.html';
};

var rotar = function() {
    value += 90;
    $("#imgma").rotate({
        angle: (value - 90), 
        animateTo: value, 
        easing: $.easing.easeInOutExpo
    });
    if (value === 360)
        value = 0;
    if ($("#imgma").height() < $("#imgma").width())
        $("#imgma").css('margin', (($("#imgma").height() / 2)) + 'px 0');
    window.localStorage.removeItem('val_rotate');
    window.localStorage.setItem('val_rotate', value);
    $("#imgma").css('min-width',$(document).width());
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
    window.localStorage.setItem('photo', urlimg);
    $('#imgma').attr("src", urlimg + '?' + new Date().getTime());
    $("#imgma").rotate(value);
}

function fail(error) {
    $('#luces').hide();
    console.log("upload error source " + error.source);
    alert("upload error source " + error.source);
}