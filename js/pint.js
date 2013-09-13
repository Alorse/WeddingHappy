/*
 * 
 * Variables globales del sistema.
 * @type String
 */

//var _host = 'http://10.60.6.152:8888/pinterestAPI/';
var pag = 1, first = 0;
var ismobile = (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android 3|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
var filename = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

function pint() {

    this.constructor = function() {
        index.loadMenu();
//        $('#inspiration').on("swiperight", pinte.swiperight);
        if (first === 0) {
            setTimeout("pinte.loadpines(1)", 10);
        }
    };

    this.swiperight = function() {
        $("#right-panel").panel("open");
    };

    this.loadpines = function(page) {
        if (navigator.onLine) {
            pinte.getInspiration();
            $.getJSON('http://pinterestapi.co.uk/socialparaiso/pins', function(data) {
                var items = '';
                var id_pin = 0;
                $.each(data.body, function(key, val) {
                    var size = val.href.length - 1;
                    id_pin = val.href.substring(5, size);

                    items += '<div class="pin" id="' + id_pin + '">';
                    items += '<img src="' + val.src.replace('236x', '736x') + '" alt="' + val.desc + '" class="imgpin" />';
                    items += '<div class="pinsocial">';
                    if ($.inArray(id_pin, pinesids) !== -1) {
                        for (var i = 0; i < pinesids.length; i++)
                        {
                            if (pinesids[i].toString() === id_pin.toString() && typeof pines[i] !== 'undefined') {

                                if (pines[i].fav === '1') {
                                    items += '<img src="img/ico_inspiracion/ico_favorite_on.png" class="iconfoll_on" id="favorite' + id_pin + '" />';
                                } else {
                                    items += '<img src="img/ico_inspiracion/ico_favorite.png" class="iconfoll" id="favorite' + id_pin + '" />';
                                }
                                if (pines[i].fb === '1') {
                                    items += '<img src="img/ico_inspiracion/ico_facebook_on.png" class="iconsocialf_on" id="facebook' + id_pin + '" />';
                                } else {
                                    items += '<img src="img/ico_inspiracion/ico_facebook.png" class="iconsocialf" id="facebook' + id_pin + '" />';
                                }
                                if (pines[i].tw === '1') {
                                    items += '<img src="img/ico_inspiracion/ico_twitter_on.png" class="iconsocialt_on" id="twitter' + id_pin + '" />';
                                } else {
                                    items += '<img src="img/ico_inspiracion/ico_twitter.png" class="iconsocialt" id="twitter' + id_pin + '" />';
                                }
                                if (pines[i].pin === '1') {
                                    items += '<img src="img/ico_inspiracion/ico_pinterest_on.png" class="iconsocialp_on" id="pinterest' + id_pin + '" />';
                                } else {
                                    items += '<img src="img/ico_inspiracion/ico_pinterest.png" class="iconsocialp" id="pinterest' + id_pin + '" />';
                                }
                            }
                        }
                    } else {
                        items += '<img src="img/ico_inspiracion/ico_favorite.png" class="iconfoll" id="favorite' + id_pin + '" />';
                        items += '<img src="img/ico_inspiracion/ico_facebook.png" class="iconsocialf" id="facebook' + id_pin + '" />';
                        items += '<img src="img/ico_inspiracion/ico_twitter.png" class="iconsocialt" id="twitter' + id_pin + '" />';
                        items += '<img src="img/ico_inspiracion/ico_pinterest.png" class="iconsocialp" id="pinterest' + id_pin + '" />';
                    }
                    items += '</div>';
                    items += '</div>';
                });

                $('#postswrapper').html(items);


                $('div#loadmoreajaxloader').hide();


                $('.iconfoll').mousedown(function(e) {
                    var id_pin = e.target.id.replace('favorite', '');
                    if ($.inArray(id_pin, pinesids) === -1) {
                        pinte.new_inspiration(e.target.id, 'favorite');
                    } else {
                        pinte.update_inspiration(e.target.id, 'favorite', 1);
                    }
                    $(this).attr('src', 'img/ico_inspiracion/ico_favorite_on.png');
                    ToastL('Tienes un nuevo Favorito.');
                });

                $('.iconsocialf').mousedown(function(e) {
                    var id_pin = e.target.id.replace('facebook', '');
                    if ($.inArray(id_pin, pinesids) === -1) {
                        pinte.new_inspiration(e.target.id, 'facebook');
                    } else {
                        pinte.update_inspiration(e.target.id, 'facebook', 1);
                    }
                    $(this).attr('src', 'img/ico_inspiracion/ico_facebook_on.png');
                    ToastL('Compartido en Facebook.');
                });

                $('.iconsocialt').mousedown(function(e) {
                    var id_pin = e.target.id.replace('twitter', '');
                    if ($.inArray(id_pin, pinesids) === -1) {
                        pinte.new_inspiration(e.target.id, 'twitter');
                    } else {
                        pinte.update_inspiration(e.target.id, 'twitter', 1);
                    }
                    $(this).attr('src', 'img/ico_inspiracion/ico_twitter_on.png');
                    ToastL('Compartido en Twitter.');
                });

                $('.iconsocialp').mousedown(function(e) {
                    var id_pin = e.target.id.replace('pinterest', '');
                    navigator.app.loadUrl("http://pinterest.com/pin/" + id_pin, {openExternal: true});
                    if ($.inArray(id_pin, pinesids) === -1) {
                        pinte.new_inspiration(e.target.id, 'pinterest');
                    } else {
                        pinte.update_inspiration(e.target.id, 'pinterest', 1);
                    }
                    $(this).attr('src', 'img/ico_inspiracion/ico_pinterest_on.png');
                    ToastL('Visto en Pinterest.');
                });

            });
        } else {
            $('div#loadmoreajaxloader').hide();
            ToastS('No hay conexión a Internet');
        }
    };


    this.new_inspiration = function(id, what) {
        var id_pin = id.replace(what, '');
        var url = $('div#' + id_pin + '>img').attr('src');

        var event_info = [id_pin, 0, 1, url];
        var event_data = ['id_pin', 'nid', what, 'url'];
        insertSQL(event_data, event_info, 'sp_inspiration');
        pinte.getInspiration();
    };

    this.update_inspiration = function(id, what, state) {
        var id_pin = id.replace(what, '');
        updateSQL('UPDATE sp_inspiration SET ' + what + ' = ' + state + ' WHERE id_pin = "' + id_pin + '"');
        pinte.getInspiration();
    };

    this.pinit = function(actual_pin) {
        actual_pin = actual_pin.replace('192x', '736x');
        window.localStorage.setItem("actual_pin", actual_pin);
        $('#pinpost').show().html('<img src="' + window.localStorage.getItem("actual_pin") + '" />');
    };

    this.errorCB = function(err) {
        console.log("Tenemos un error SQL: " + err.code);
    };

    /*
     * getInspiration: abre la base dedatos para buscar la información de las imagenes de pinterest.
     * @returns {undefined}
     */

    this.getInspiration = function() {
        openDB();
        db.transaction(pinte.queryInspiration, pinte.errorCB);
    };

    /*
     * queryInspiration: ejecuta la consulta SQL para buscar la información de las imagenes de pinterest.
     * @param {type} tx
     * @returns {undefined}
     */
    this.queryInspiration = function(tx) {
        tx.executeSql('SELECT * FROM sp_inspiration', [], pinte.querySuccessInspiration, errorCB);
    };

    /*
     * querySuccessInspiration: retorna un listado con la información de las imagenes de pinterest.
     * @param {type} tx
     * @param {type} results
     * @returns {events}
     */
    this.querySuccessInspiration = function(tx, results) {
        if (results.rows.length > 0) {
            for (var i = 0; i < results.rows.length; i++) {
                pines[i] = {
                    name: '/pin/' + results.rows.item(i).id_pin + '/',
                    user: '' + window.localStorage.getItem('email'),
                    pinid: '' + results.rows.item(i).id_pin,
                    fav: '' + results.rows.item(i).favorite,
                    fb: '' + results.rows.item(i).facebook,
                    tw: '' + results.rows.item(i).twitter,
                    pin: '' + results.rows.item(i).pinterest,
                    url: '' + results.rows.item(i).url,
                    nid: '' + results.rows.item(i).nid
                };
                pinesids.push(results.rows.item(i).id_pin);
            }
        }
    };
}

var pinte = new pint();

if (filename === 'pinpost.html') {
    $(window).scroll(function() {
        if ($(window).scrollTop() === ($('#postswrapper').height() - $(window).height())) {
            $('div#loadmoreajaxloader').show();
            if (first !== 0) {
                pinte.loadpines(pag);
            }
        }
    });

    $(document).ready(function()
    {
        if (emulated)
            pinte.constructor();
        else if (ismobile)
            document.addEventListener("deviceready", pinte.constructor, true);
        else
            ToastL('Lo siento es un app mobile');
    });
}