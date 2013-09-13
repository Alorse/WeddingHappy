/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function budget() {

    this.total_cost = 0;
    this.name_actual = '';
    this.cost_actual = '';
    this.cate_actual = '';

    this.constructor = function() {
        index.loadMenu();
        $('body').on("swiperight", budget.swiperight);

        budget.getSqlResultBudgets();
        $('#add_budget').click(function() {
            window.localStorage.setItem("type_action", "new");
            $('#btn_save').val('Guardar');
            $('#name_budget').val('');
            $('#cost_budget').val('');
            $('#category').val('');
            $('.check').hide();
            go_('#new', false);
        });
        budget.change_category();
        budget.active_search();

        $('#howm').focus(function() {
            this.type = 'number';
        });

        $('#howm').blur(function() {
            this.type = 'text';
            if ($(this).val() !== '') {
                window.localStorage.setItem("budget", $(this).val());
                budget.l1ghts(false);
            } else {
                window.localStorage.removeItem("budget");
            }
        });
    };

    this.swiperight = function() {
        $("#right-panel").panel("open");
    };

    this.action_budget = function() {
        var mode = localStorage.getItem('type_action');
        switch (mode) {
            case 'new':
                budget.new_budget();
                break;

            case 'edit':
                budget.update_budget();
                break;

            case 'del':
                budget.delete_budget();
                break;

            default:
                ToastS('¿Qué? Sal e ingresa nuevamente.');
                break;
        }
    };

    this.new_budget = function() {
        var date = ((new Date()).getTime() / 1000).toFixed(0);
        var category = $('#category').val();
        var text = $('#name_budget').val();
        var cost = $('#cost_budget').val();
        if (category !== '0' && text !== '' && cost !== '') {

            var budget_info = [];
            var budget_data = ['date', 'category', 'text', 'cost', 'day_notification', 'is_editable', 'state'];
            budget_info.push(date, category, text, cost, 0, 1, 0);
            insertSQL(budget_data, budget_info, 'sp_budgets');
            budget.getSqlResultBudgets();
            $('#name_budget').val('');
            $('#cost_budget').val('');
            if (!emulated) {
                function onAction(button) {
                    if (button === 1) {
                        go_('#list', true);
                    } else
                        $("#name_budget").focus();
                }
                navigator.notification.confirm(
                        '¿Deseas crear otro concepto?',
                        onAction,
                        'Evento guardado',
                        ['No', 'Si']
                        );
//                go_('#list', true);
            } else {
                var action = confirm("¿Deseas crear otro concepto?");
                if (!action) {
                    go_('#list', true);
                } else
                    $("#name_budget").focus();
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
            event_info.push(1, dad, date, text);
            insertSQL(event_data, event_info, 'sp_comments');
            go_('#list', true);
            budget.slide_budget('coment_event', id_actual);
            ToastL('Acabas de agregar un comentario.');
        } else {
            ToastL('Escribe algo en el comentario.');
        }

    };

    this.errorCB = function(err) {
        console.log("Tenemos un error SQL: " + err.code);
    };

    this.getSqlResultBudgets = function() {
        openDB();
        db.transaction(budget.queryDBBudgets, budget.errorCB);

    };

    /*
     * queryDBPlans: ejecuta la consulta SQL para buscar los budgetos del usuario.
     * @param {type} tx
     * @returns {undefined}
     */
    this.queryDBBudgets = function(tx) {
        tx.executeSql('SELECT * FROM sp_budgets', [], budget.querySuccessBudgets, budget.errorCB);
    };

    /*
     * querySuccessPlans: retorna un listado con las metas del usuario
     * @param {type} tx
     * @param {type} results
     * @returns {budgets}
     */
    this.querySuccessBudgets = function(tx, results) {

        var select_day = '<div data-role="popup" id="popupMenu" data-theme="d">' +
                '<select id="select_day">';
        for (var i = 1; i < 29; i++) {
            select_day += '<option value="' + i + '">' + i + '</option>';
        }
        select_day += '</select>' +
                '</div>';
        budget.total_cost = 0;
        if (results.rows.length > 0) {
            var budgets = '';
            budgets += '<ul>';
            for (var i = 0; i < results.rows.length; i++) {
                budgets += '<li id="actual' + results.rows.item(i).id + '" class="cats cat' + results.rows.item(i).category + ' state' + results.rows.item(i).state + ' editable' + results.rows.item(i).is_editable + '">';
                if (results.rows.item(i).state)
                    budgets += '<div class="state_budget payed" id="state_budget' + results.rows.item(i).id + '" onclick="budget.held_budget(' + results.rows.item(i).id + ', 1)"></div>';
                else
                    budgets += '<div class="state_budget" id="state_budget' + results.rows.item(i).id + '" onclick="budget.held_budget(' + results.rows.item(i).id + ', 1)"></div>';
                budgets += '<div class="budget_desc" id="budget_desc' + results.rows.item(i).id + '" onclick="budget.slide_budget(\'menu_budget\', ' + results.rows.item(i).id + ')">' + results.rows.item(i).text + '</div>';
                budgets += '<div class="msg_budget" id="msg_budget' + results.rows.item(i).id + '" onclick="loadComments(' + results.rows.item(i).id + ');"><!--3--></div>';
                budgets += '<div class="budget_cost" id="budget_cost' + results.rows.item(i).id + '" onclick="budget.slide_budget(\'menu_budget\', ' + results.rows.item(i).id + ')">' + budget.numberWithCommas(results.rows.item(i).cost) + '</div>'; //budget.numberWithCommas(results.rows.item(i).cost)
                budgets += '<div class="coment_budget" id="coment_budget' + results.rows.item(i).id + '">';
                budgets += '</div>';
                budgets += '<div class="menu_budget" id="menu_budget' + results.rows.item(i).id + '">';
                budgets += '<ul>' +
                        '<li><a onclick="budget.load_popup(' + results.rows.item(i).id + ', \'' + results.rows.item(i).day_notification + '\')" href="#popupBasic' + results.rows.item(i).id + '" data-rel="popup" data-inline="true" data-transition="flip"><img src="img/icons/ico_reloj.png" /></a></li>' +
                        '<li><a onclick="id_actual = ' + results.rows.item(i).id + '; go_(\'#comment\', false);"><img src="img/icons/ico_comment_1_on.png" /></a></li>' +
                        '<li><a onclick="budget.edit_budget(' + results.rows.item(i).id + ',\'' + results.rows.item(i).text + '\',\'' + results.rows.item(i).cost + '\',\'' + results.rows.item(i).category + '\')"><img src="img/icons/ico_edit.png" /></a></li>' +
                        '</ul>';
                budgets += '<div id="pop' + results.rows.item(i).id + '"></div>';
                budgets += '</li>';
                budgets_txt[results.rows.item(i).id] = normalize((results.rows.item(i).text).toLowerCase());
                budget.total_cost += results.rows.item(i).cost;
            }
            budgets += '<li>Total<span class="total"></span></li>';
            budgets += '</ul>';

            $('.list_budget').show().html(budgets);
            $('.menu_budget').hide();
            $('.coment_budget').hide();

            $('.cats').hide();
            $('.cat' + 12).show();
            $('#categorys').val(12);
            budget.calculate_total('cat' + 12);

            $('.content').height($('.cl').height());
            if (window.localStorage.getItem("budget")) {
                $('#howm').val(window.localStorage.getItem("budget"));
                budget.l1ghts(false);
            }

        } else {
            $('.list_budget').html('No tienes conceptos aún.');
        }
    };

    this.slide_budget = function(open, id) {
        var state = true;
        $('#' + open + id).slideFadeToggle((open === 'coment_budget') ? 500 : 200, 'linear',
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

    this.change_category = function() {
        $('#categorys').change(function() {
            $("#categorys option[value=0]").remove();
            var val = $("#categorys option:selected").val();
            $('.cats').hide();
            $('.cat' + val).show();
            $('.content').height($('.cl').height());
            budget.calculate_total('.cat' + val);
        });

    };

    this.load_popup = function(id, day) {

        var events = '<div data-role="popup" id="popupBasic' + id + '" data-theme="d" class="popupBasic">';
        //var events = '<div>';
        events += '¿Qué día quieres recibir la notificación?<br /><br />';
        events += '<div class="datepicker" id="datepicker' + id + '"></div>';
        if (day !== '0')
            events += 'Día planeado: ' + day;
        events += '<br /><input type="button" value="Guardar" class="btn_half" onclick="budget.setdatenoti(' + id + ')" />';
        events += '</div>';
        $('#pop' + id).html(events);
        $("#popupBasic" + id).popup();
        $("#datepicker" + id).datepicker({
            dateFormat: "d/mm/yy"
        });
    };

    this.edit_budget = function(id, name, cost, cate) {
        window.localStorage.setItem("type_action", "edit");
        id_actual = id;
        name_actual = name;
        cost_actual = cost;
        cate_actual = cate;

        $('#btn_save').val('Actualizar');
        $('#name_budget').val(name_actual);
        $('#cost_budget').val(cost_actual);
        $('#category').val(cate_actual);
        $('.check').show();

        go_('#new', false);
    };

    this.update_budget = function() {
        var category = $('#category').val();
        var text = $('#name_budget').val();
        var cost = $('#cost_budget').val();
        var sql = "UPDATE sp_budgets SET category = '" + category + "', text = '" + text + "', cost = '" + cost + "' WHERE id = " + id_actual;
        updateSQL(sql);
        window.localStorage.setItem('sync', true);
        budget.getSqlResultBudgets();
        go_('#list', true);
        $('#budget_desc' + id_actual).html(text);
        ToastL('Concepto actualizado.');
    };

    this.delete_budget = function() {
        var id = id_actual;
        var sql = "DELETE FROM sp_budgets WHERE id = " + id;
        if (!emulated) {
            function onAction(button) {
                if (button === 2) {
                    updateSQL(sql);
                    window.localStorage.setItem('sync', true);
                    go_('#list', true);
                    $('#actual' + id).hide();
                    ToastL('Concepto eliminado');
                }
            }
            navigator.notification.confirm(
                    '¿Estás seguro de eliminar este concepto?',
                    onAction,
                    'Eliminar Concenpto',
                    ['No', 'Si']
                    );
        } else {
            var action = confirm("¿Estás seguro de eliminar este concepto?");
            if (action) {
                updateSQL(sql);
                window.localStorage.setItem('sync', true);
                go_('#list', true);
                $('#actual' + id).hide();
                ToastL('Concepto eliminado');
            }
        }
    };

    var b = false;
    this.change_del = function() {

        if (!b) {
            window.localStorage.setItem("type_action", "del");

            $('#del_event').attr('checked', 'checked');
            $('#name_budget').attr("disabled", "disabled");
            $('#cost_budget').attr("disabled", "disabled");
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


    this.held_budget = function(q, v) {
        var sql = "UPDATE sp_budgets SET state = " + v + " WHERE id = " + q;
        if (!emulated) {
            function onAction(button) {
                if (button === 2) {
                    updateSQL(sql);
                    window.localStorage.setItem('sync', true);
                    $('#state_budget' + q).addClass('payed');
                }
            }
            navigator.notification.confirm(
                    '¿Deseas marcar este concepto como realizado?',
                    onAction,
                    'Editar concepto',
                    ['No', 'Si']
                    );
        } else {
            var action = confirm("¿Deseas marcar este concepto como realizado?");
            if (action) {
                updateSQL(sql);
                window.localStorage.setItem('sync', true);
                $('#state_budget' + q).addClass('payed');
            }
        }
    };

    this.setdatenoti = function(id) {
        var dateObject = $('#datepicker' + id).val();
        var sql = "UPDATE sp_budgets SET day_notification = '" + dateObject + "' WHERE id = " + id;
        updateSQL(sql);
        window.localStorage.setItem('sync', true);
        $('#popupBasic' + id).popup('close');
        ToastS('Seras notificado el ' + dateObject);
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

            var ev = budgets_txt.join("{}");
            ev = budget.replaceAll(ev, '{}', '""') + '"';
            //alert(ev);

            var rx = new RegExp('"([^"]*' + search + '[^"]*)"', 'gi');
            var i = 0, results = '';
            $('.cats').hide();
            while (result = rx.exec(ev)) {
                var id = $.inArray(result[1], budgets_txt);
                //console.log(id, result[1]);
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

    this.filter_budgets = function(selector) {
        $('.cats').hide();
        $("#categorys option[value=0]").remove();
        var head;
        switch (selector) {
            case 'c':
                $('.state1').show();
                head = 'state1';
                $('#categorys').append(new Option('Conceptos pagos', "0"));
                break;
            case 'p':
                $('.state0').show();
                head = 'state0';
                $('#categorys').append(new Option('Conceptos pendientes', "0"));
                break;
            case 'm':
                $('.editable1').show();
                head = 'editable1';
                $('#categorys').append(new Option('Mis conceptos', "0"));
                break;
        }
        $('#categorys').val("0");
        $("#categorys option:selected").attr('disabled', 'disabled');
        $('.content').height($('.cl').height());

        budget.calculate_total(head);
    };

    this.numberWithCommas = function(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(".");
    };

    this.edit_money = function() {
        $('#howm').slideFadeToggle();
        $('.how_much section').slideFadeToggle();
        $('#howm').focus();
    };

    this.l1ghts = function(flag) {
        $('#cost').html('$' + budget.numberWithCommas(window.localStorage.getItem("budget")));
        $('#pro').html('$' + budget.numberWithCommas(budget.total_cost));
        if (flag) {
            $('#howm').slideFadeToggle();
            $('.how_much section').slideFadeToggle();
        }

        if (budget.total_cost >= (window.localStorage.getItem("budget") * 0.8)) {

            if (budget.total_cost >= window.localStorage.getItem("budget")) {
                $('.how_much #semaforo').css('background-position', '-34px');
            } else {
                $('.how_much #semaforo').css('background-position', '-17px');
            }
        } else {
            $('.how_much #semaforo').css('background-position', '0px');
        }
    };

    this.calculate_total = function(clss) {
        var total = 0;
        $('.' + clss + ' .budget_cost').each(function() {
            total += (parseInt($(this).html().replace(/\./g, '')));
        });
        $('.total').html('$' + budget.numberWithCommas(total));
    };
}

var budget = new budget();

$(document).ready(function()
{
    if (emulated)
        budget.constructor();
    else if (ismobile)
        document.addEventListener("deviceready", budget.constructor, true);
    else
        ToastL('Lo siento es un app mobile');
});
