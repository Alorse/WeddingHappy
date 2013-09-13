/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function sync() {

    this.namesI = [];
    this.valuesI = [];
    this.namesCLC = [];
    this.valuesCLC = [];

    this.constructor = function() {
        $('#favorites').on("swiperight", sync.swiperight);
        //Llamados de sincronización
        sync.down_cl_cats();
        sync.up_inspiration();
    };

    this.swiperight = function() {
        $("#right-panel").panel("open");
    };

    this.up_cl = function() {
        var cl = new checklist();
        cl.getSqlResultEvents();
        setTimeout("sync.load_cl();", 200);
    };

    this.load_cl = function() {
        console.log(cl_items);
        if (cl_items.length !== 0) {
            console.log(cl_items);
            var _page = "?mode=insert_cl";
            $.ajax({
                type: 'GET',
                url: _host + _page,
                data: {
                    cl_items: cl_items
                },
                success: function(data) {
                    alert(data);
                },
                error: function(e) {
                    alert('es error ');
                }
            });
        } else {
            ToastL('es 0');
        }
    };

    this.up_inspiration = function() {
        createDB();
        var inspiration = new pint();
        inspiration.getInspiration();
        setTimeout("sync.load_inspiration();", 200);

    };

    this.load_inspiration = function() {
        if (pines.length !== 0) {
            var _page = "?mode=insert_pins";
            $.ajax({
                type: 'GET',
                url: _host + _page,
                data: {
                    pines: pines
                },
                success: function(data) {
                    sync.down_inspiration();
                },
                error: function(e) {
                    sync.down_inspiration();
                }
            });
        } else {
            sync.down_inspiration();
        }
    };

    this.down_inspiration = function() {
        var _page = "json-inspiracion";
        $.ajax({
            type: 'GET',
            url: _hostf + _page,
            dataType: "json",
            data: {
                correo: window.localStorage.getItem('email')
            },
            success: function(data) {
                valuesI = data.inspiracion;
                namesI = ['id_pin', 'nid', 'favorite', 'facebook', 'twitter', 'pinterest', 'url'];
                sync.insertSQL_inpitarion();
                ToastS('Todo full');
                window.localStorage.setItem('first', true);
                window.localStorage.setItem('sync', false);
                index.loadindex('l');
            },
            error: function(data) {
                ToastL('Culpa de Jairo.');
            }
        });
    };

    this.errorCB = function(err) {
        console.log("Tenemos un error SQL: " + err.code);
    };

    this.insertSQL_inpitarion = function() {
        openDB();
        db.transaction(sync.insertDB_inspiration, sync.errorCB);
    };

    this.insertDB_inspiration = function(tx) {
        tx.executeSql('DELETE FROM sp_inspiration');
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = "sp_inspiration"');
        var inspiration_info = [];

        $.each(valuesI, function(key, val) {
            $.each(val, function(name, value) {
                inspiration_info.push(value.Pin, value.Nid, value.Favorito, value.Facebook, value.Twitter, value.Pinterest, value.URL);
                var sql = "INSERT INTO sp_inspiration "
                        + "(" + namesI.join(', ') + ") VALUES "
                        + "(\"" + inspiration_info.join('", "') + "\");";
                tx.executeSql(sql);
                console.log(sql);
                inspiration_info = [];
            });
        });
    };

    this.down_cl_cats = function() {
        var _page = "json-categorias-checklist";
        $.ajax({
            type: 'GET',
            url: _hostf + _page,
            dataType: "json",
            success: function(data) {
                namesCLC = ['val', 'name'];
                valuesCLC = data.cats_checklist;
                sync.insertSQL_cl_c();
            },
            error: function(data) {
                ToastL(data);
            }
        });
    };

    this.insertSQL_cl_c = function() {
        openDB();
        db.transaction(sync.insertDB_cl_c, sync.errorCB);
    };

    this.insertDB_cl_c = function(tx) {
        tx.executeSql('DELETE FROM sp_cl_cats');
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = "sp_cl_cats"');
        var cl_cats_info = [];

        $.each(valuesCLC, function(key, value) {
            cl_cats_info.push(normalize(value.name).replace(/\ /g, '-'), value.name);
            var sql = "INSERT INTO sp_cl_cats "
                    + "(" + namesCLC.join(', ') + ") VALUES "
                    + "(\"" + cl_cats_info.join('", "') + "\");";
            tx.executeSql(sql);
            console.log(sql);
            cl_cats_info = [];
        });
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
}

var sync = new sync();

$(document).ready(function()
{
    if (filename === 'index.html' && window.localStorage.getItem('email') && !window.localStorage.getItem('first')) {
        if (emulated)
            sync.constructor();
        else if (ismobile)
            document.addEventListener("deviceready", sync.constructor, true);
        else
            ToastL('Lo siento es un app mobile');
    } else {
//        sync.up_cl();
        setTimeout("index.loadindex('n')", 900);
    }
});