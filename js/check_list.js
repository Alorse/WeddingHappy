/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var id_actual;


function checklist() {
    this.constructor = function() {
        $('.content').height($('.cl').height() + 40);
        $('#txt_event').height($(document).height() - 300);
        index.loadMenu();
        check_list.getSqlResultCats();
        check_list.getSqlResultEvents();
        $('#add_event').click(function() {
            window.localStorage.setItem("type_action", "new");
            $('#txt_event').removeAttr("disabled");
            $('#category').removeAttr("disabled");
            $('#btn_save').val('Guardar');
            $('#txt_event').val('');
            $('#category').val('');
            $('.check').hide();
            go_('#new', false);
        });

        $('#check').live('pageshow', function(event, ui) {
            if (window.localStorage.getItem('type_action') === 'edit') {
                $('#btn_save').val('Actualizar');
                $('#txt_event').val(name_actual);
                $('#category').val(cate_actual);
                $('.check').show();
            }
        });

        $("#txt_event").focus();
        check_list.change_category();
        check_list.active_search();

        $('#check').on("swiperight", check_list.swiperight);
    };

    this.swiperight = function() {
        index.loadMenu();
        $("#right-panel").panel("open");
    };

    this.slide_event = function(open, id) {

        var state = true;
        $('#' + open + id).slideFadeToggle((open === 'coment_event') ? 500 : 200, 'linear',
                function() {
                    if (state === true) {
                        state = false;
                        $('#actual' + id).animate({
                            backgroundColor: "#a1d5bf"
                        }, 600);
                    } else {
                        state = true;
                        $('#actual' + id).animate({
                            backgroundColor: "#b9dfd0"
                        }, 600);
                    }
                });
    };

    this.save_event = function() {

        var date = ((new Date()).getTime() / 1000).toFixed(0);
        var category = $('#category').val();
//        var category = $("#category option[value='" + catval + "']").text();
        var text = $('#txt_event').val();
        $('#txt_event').removeAttr("disabled");
        $('#category').removeAttr("disabled");
        if (category !== '0' && text !== '') {

            var event_info = [];
            var event_data = ['date', 'category', 'text', 'day_notification', 'is_editable', 'state'];
            event_info.push(date, category, text, 0, 1, 0);
            insertSQL(event_data, event_info, 'sp_events');
            window.localStorage.setItem('sync', true);
            check_list.getSqlResultEvents();
            text = $('#txt_event').val('');
            if (!emulated) {
                function onAction(button) {
                    if (button === 1) {
                        ToastL('Acabas de agregar un evento.');
                        go_('#list', true);
                    } else
                        $("#txt_event").focus();
                }
                navigator.notification.confirm(
                        '¿Deseas crear otro evento?',
                        onAction,
                        'Evento guardado',
                        ['No', 'Si']
                        );
            } else {
                var action = confirm("¿Deseas crear otro evento?");
                if (!action) {
                    check_list.getSqlResultEvents();
                    ToastL('Acabas de agregar un evento.');
                    go_('#list', true);
                } else
                    $("#txt_event").focus();
            }
        } else {
            ToastL('Completa todos los campos.');
        }
    };

    this.save_comment = function() {
        var date = ((new Date()).getTime() / 1000).toFixed(0);
        var dad = id_actual;
        var text = $('#txt_comment').val();
        if (text !== '') {
            var event_info = [];
            var event_data = ['fro', 'dad', 'date', 'text'];
            event_info.push(0, dad, date, text);
            insertSQL(event_data, event_info, 'sp_comments');
            window.localStorage.setItem('sync', true);
            go_('#list', true);
            slide_event('coment_event', id_actual);
            ToastL('Acabas de agregar un comentario.');
        } else {
            ToastL('Escribe algo en el comentario.');
        }

    };

    this.event_held = function(q, v) {
        var sql = "UPDATE sp_events SET state = " + v + " WHERE id = " + q;
        if (!emulated) {
            function onAction(button) {
                if (button === 2) {
                    updateSQL(sql);
                    window.localStorage.setItem('sync', true);
                    $('#state_event' + q).addClass('payed');
                }
            }
            navigator.notification.confirm(
                    '¿Deseas marcar este evento como realizado?',
                    onAction,
                    'Editar evento',
                    ['No', 'Si']
                    );
        } else {
            var action = confirm("¿Deseas marcar este evento como realizado?");
            if (action) {
                updateSQL(sql);
                window.localStorage.setItem('sync', true);
                $('#state_event' + q).addClass('payed');
            }
        }
    };

    this.change_category = function() {
        $('#categorys').change(function() {
            var val = $("#categorys option:selected").val();
            $('.cats').hide();
            $('.cat' + val).show();
            $('.content').height($('.cl').height());
        });
    };

    this.active_search = function() {
        $('#isearch').keyup(function() {
            var search = $(this).val();
            var resultsText = $('#results_text');
            var resultsCount = $('#results_count');
            if (!search) {
                resultsText.val('');
                resultsCount.val('0');
                return;
            }

            var ev = events_txt.join("{}");
            ev = replaceAll(ev, '{}', '""') + '"';

            var rx = new RegExp('"([^"]*' + search + '[^"]*)"', 'gi');
            var i = 0, results = '';
            $('.cats').hide();
            var result;
            while (result = rx.exec(ev)) {
                var id = $.inArray(result[1], events_txt);
                $('#actual' + id).show();
                results += result[1] + "\n";
                i += 1;
            }
            resultsText.val(results);
            resultsCount.html(i);
        });
    };
    this.replaceAll = function(text, busca, reemplaza) {
        while (text.toString().indexOf(busca) !== - 1)
            text = text.toString().replace(busca, reemplaza);
        return text;
    };

    this.oninputdate = function(id) {
        var dateNoti = $('#datenoti' + id).val();
        ToastL('Recordatorio activado para el ' + dateNoti);
    };

    this.setdatenoti = function(id) {
        var dateObject = $('#datepicker' + id).val();
        var sql = "UPDATE sp_events SET day_notification = '" + dateObject + "' WHERE id = " + id;
        updateSQL(sql);
        window.localStorage.setItem('sync', true);
        $('#popupBasic' + id).popup('close');
        ToastS('Serás notificado el ' + dateObject);
    };

    this.filter_event = function(selector) {
        $('.cats').hide();
        switch (selector) {
            case 'c':
                $('.state1').show();
                break;
            case 'p':
                $('.state0').show();
                break;
            case 'm':
                $('.editable1').show();
                break;
        }
        $('.content').height($('.cl').height());
    };

    this.name_actual = '';
    this.cate_actual = '';

    this.edit_event = function(id, name, cate) {
        window.localStorage.setItem("type_action", "edit");
        $('#txt_event').removeAttr("disabled");
        $('#category').removeAttr("disabled");
        id_actual = id;
        name_actual = name;
        cate_actual = cate;
        go_('#new', false);
    };


    this.delete_event = function() {
        /*
         * No borra, solo cambia el estado a -1 y el backend se encarga del resto.
         */
        var id = id_actual;
        var sql = "UPDATE sp_events SET state = -1 WHERE id = " + id;
        if (!emulated) {
            function onAction(button) {
                if (button === 2) {
                    updateSQL(sql);
                    window.localStorage.setItem('sync', true);
                    go_('#list', true);
                    $('#actual' + id).hide();
                    ToastL('Evento eliminado');
                }
            }
            navigator.notification.confirm(
                    '¿Estás seguro de eliminar este evento?',
                    onAction,
                    'Editar evento',
                    ['No', 'Si']
                    );
        } else {
            var action = confirm("¿Estás seguro de eliminar este evento?");
            if (action) {
                updateSQL(sql);
                window.localStorage.setItem('sync', true);
                go_('#list', true);
                $('#actual' + id).hide();
                ToastL('Evento eliminado');
            }
        }
    };

    this.load_popup = function(id, day) {
        var events = '<div data-role="popup" id="popupBasic' + id + '" data-theme="d" class="popupBasic">';
        //var events = '<div>';
        events += '¿Qué día quieres recibir la notificación?<br /><br />';
        events += '<div class="datepicker" id="datepicker' + id + '"></div>';
        if (day !== '0')
            events += 'Día planeado: ' + day;
        events += '<br /><input type="button" value="Guardar" class="btn_half" onclick="setdatenoti(' + id + ')" />';
        events += '</div>';
        $('#pop' + id).html(events);
        $("#popupBasic" + id).popup();
        $("#datepicker" + id).datepicker({
            dateFormat: "d/mm/yy"
        });
    };

    var b = false;

    this.change_del = function() {
        if (!b) {
            window.localStorage.setItem("type_action", "del");

            $('#del_event').attr('checked', 'checked');
            $('#txt_event').attr("disabled", "disabled");
            $('#category').attr("disabled", "disabled");
            $('#btn_save').val('Eliminar');
            b = true;
        } else {
            window.localStorage.setItem("type_action", "edit");

            $('#del_event').removeAttr('checked');
            $('#txt_event').removeAttr("disabled");
            $('#category').removeAttr("disabled");
            $('#btn_save').val('Actualizar');
            b = false;
        }
    };

    this.event_btn = function() {
        var mode = window.localStorage.getItem("type_action");

        switch (mode) {
            case 'new':
                check_list.save_event();
                break;
            case 'edit':
                check_list.update_event();
                break;
            case 'del':
                check_list.delete_event();
                break;
        }
    };

    this.update_event = function() {
        var category = $('#category').val();
//        var category = $("#category option[value='" + catval + "']").text();
        var text = $('#txt_event').val();
        var sql = "UPDATE sp_events SET category = '" + category + "', text = '" + text + "' WHERE id = " + id_actual;
        updateSQL(sql);
        window.localStorage.setItem('sync', true);
        go_('#list', true);
        $('#event_desc' + id_actual).html(text);
        ToastL('Evento actualizado.');
    };

    this.errorCB = function(err) {
        console.log("Tenemos un error SQL: " + err.code);
    };

    this.getSqlResultEvents = function() {
        openDB();
        db.transaction(check_list.queryDBEvents, errorCB);
    };

    this.queryDBEvents = function(tx) {
        tx.executeSql('SELECT * FROM sp_events', [], check_list.querySuccessEvents, errorCB);
    };

    this.querySuccessEvents = function(tx, results) {

        var select_day = '<div data-role="popup" id="popupMenu" data-theme="d">' +
                '<select id="select_day">';
        for (var i = 1; i < 29; i++) {
            select_day += '<option value="' + i + '">' + i + '</option>';
        }
        select_day += '</select>' +
                '</div>';

        if (results.rows.length > 0) {
            var events = '';
            events += '<ul>';
            for (var i = 0; i < results.rows.length; i++) {
                if (results.rows.item(i).state !== -1) {
                    events += '<li id="actual' + results.rows.item(i).id + '" class="cats cat' + results.rows.item(i).category + ' state' + results.rows.item(i).state + ' editable' + results.rows.item(i).is_editable + '">';
                    if (results.rows.item(i).state === 1)
                        events += '<div class="state_event payed" id="state_event' + results.rows.item(i).id + '" onclick="check_list.event_held(' + results.rows.item(i).id + ', 1)"></div>';
                    else if (results.rows.item(i).state === 0)
                        events += '<div class="state_event" id="state_event' + results.rows.item(i).id + '" onclick="check_list.event_held(' + results.rows.item(i).id + ', 1)"></div>';
                    events += '<div class="event_desc" id="event_desc' + results.rows.item(i).id + '" onclick="check_list.slide_event(\'menu_event\', ' + results.rows.item(i).id + ')">' + results.rows.item(i).text + '</div>';
                    events += '<div class="msg_event" id="msg_event' + results.rows.item(i).id + '" onclick="loadComments(' + results.rows.item(i).id + ');"><!--3--></div><br />';
                    events += '<div class="coment_event" id="coment_event' + results.rows.item(i).id + '">';
                    events += '</div>';
                    events += '<div class="menu_event" id="menu_event' + results.rows.item(i).id + '">';
                    events += '<ul>' +
                            '<li><a onclick="check_list.load_popup(' + results.rows.item(i).id + ', \'' + results.rows.item(i).day_notification + '\')" href="#popupBasic' + results.rows.item(i).id + '" data-rel="popup" data-inline="true" data-transition="flip"><img src="img/icons/ico_reloj.png" /></a></li>';
                    events += '<li><a onclick="id_actual = ' + results.rows.item(i).id + '; go_(\'#comment\', false);"><img src="img/icons/ico_comment_1_on.png" /></a></li>';
                    if (results.rows.item(i).is_editable === 1)
                        events += '<li><a onclick="check_list.edit_event(' + results.rows.item(i).id + ',\'' + results.rows.item(i).text + '\',\'' + results.rows.item(i).category + '\')"><img src="img/icons/ico_edit.png" /></a></li>';
                    events += '</ul>';
                    events += '<div id="pop' + results.rows.item(i).id + '"></div>';
                    events += '</li>';
                    events_txt[results.rows.item(i).id] = normalize((results.rows.item(i).text).toLowerCase());
                }

                cl_items[i] = {
                    date: '' + results.rows.item(i).date,
                    user: '' + window.localStorage.getItem('email'),
                    category: '' + results.rows.item(i).category,
                    text: '' + results.rows.item(i).text,
                    day_notification: '' + results.rows.item(i).day_notification,
                    is_reportable: '' + results.rows.item(i).is_reportable,
                    is_editable: '' + results.rows.item(i).is_editable,
                    state: '' + results.rows.item(i).state
                };
            }
            events += '</ul>';
            $('.events').show().html(events);
            $('.menu_event').hide();
            $('.coment_event').hide();

            $('.cats').hide();
            $('.cat12_meses_antes_o_más').show();
            $('#categorys').val('12_meses_antes_o_más');

            $('.content').height($('.cl').height());

        } else {
            $('.events').html('No tienes Eventos aún.');
        }
    };

    this.getSqlResultCats = function() {
        openDB();
        db.transaction(check_list.queryDBCats, check_list.errorCB);
    };

    this.queryDBCats = function(tx) {
        tx.executeSql('SELECT * FROM sp_cl_cats', [], check_list.querySuccessCats, check_list.errorCB);
    };

    this.querySuccessCats = function(tx, results) {
        if (results.rows.length > 0) {
            for (var i = 0; i < results.rows.length; i++) {
                $('#category').append(new Option(results.rows.item(i).name, results.rows.item(i).name.replace(/\ /g, '_')));
                $('#categorys').append(new Option(results.rows.item(i).name, results.rows.item(i).name.replace(/\ /g, '_')));
            }
        }
    };

}

var check_list = new checklist();
if (filename === 'check_list.html') {
    $(document).ready(function()
    {
        if (emulated)
            check_list.constructor();
        else if (ismobile)
            document.addEventListener("deviceready", check_list.constructor, true);
        else
            ToastL('Lo siento es un app mobile');
    });
}