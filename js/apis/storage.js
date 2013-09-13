var db = 0;
var dbname = 'SocialParaiso';
var tableSQL = '';
var rows = [];
var vals = [];
var events_txt = [];
var budgets_txt = [];
var pines = {};
var cl_items = {};
var pinesids = [];


var createTables = function(tx) {
//    tx.executeSql('DROP TABLE IF EXISTS sp_cl_cats');
    tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sp_cl_cats ('
            + 'id INTEGER primary key autoincrement, '
            + 'val TEXT NOT NULL, '
            + 'name TEXT NOT NULL)'
            );

//    tx.executeSql('DROP TABLE IF EXISTS sp_events');
    tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sp_events ('
            + 'id INTEGER primary key autoincrement, '
            + 'date INTEGER NOT NULL, '
            + 'category TEXT NOT NULL, '
            + 'text TEXT NOT NULL, '
            + 'day_notification TEXT NOT NULL, '
            + 'is_reportable INTEGER NOT NULL DEFAULT \'1\', '
            + 'is_editable INTEGER NOT NULL DEFAULT \'0\', '
            + 'state INTEGER NOT NULL DEFAULT \'0\')'
            );

//    tx.executeSql('DROP TABLE IF EXISTS sp_budgets');
    tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sp_budgets ('
            + 'id INTEGER primary key autoincrement, '
            + 'date INTEGER NOT NULL, '
            + 'category INTEGER NOT NULL, '
            + 'text TEXT NOT NULL, '
            + 'cost INTEGER NOT NULL, '
            + 'day_notification TEXT NOT NULL, '
            + 'is_reportable INTEGER NOT NULL DEFAULT \'1\', '
            + 'is_editable INTEGER NOT NULL DEFAULT \'0\', '
            + 'state INTEGER NOT NULL DEFAULT \'0\')'
            );

//    tx.executeSql('DROP TABLE IF EXISTS sp_comments');
    tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sp_comments ('
            + 'id INTEGER primary key autoincrement, '
            + 'fro INTEGER NOT NULL, '
            + 'dad INTEGER NOT NULL, '
            + 'date INTEGER NOT NULL, '
            + 'text TEXT NOT NULL)'
            );

    /*
     * fro corresponde a la procedencia del comentario, check list, presupuesto...
     * 0: check_list
     * 1: budget
     */

//    tx.executeSql('DROP TABLE IF EXISTS sp_inspiration');
    tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sp_inspiration ('
            + 'id INTEGER primary key autoincrement, '
            + 'id_pin TEXT NOT NULL DEFAULT 0, '
            + 'nid INTEGER NOT NULL, '
            + 'favorite INTEGER NOT NULL DEFAULT 0, '
            + 'facebook INTEGER NOT NULL DEFAULT 0, '
            + 'twitter INTEGER NOT NULL DEFAULT 0, '
            + 'pinterest INTEGER NOT NULL DEFAULT 0, '
            + 'sync INTEGER NOT NULL DEFAULT 0, '
            + 'url TEXT NOT NULL)'
            );
    //tx.executeSql('DROP TABLE IF EXISTS sp_suppliers');
    tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sp_suppliers ('
            + 'id INTEGER primary key autoincrement, '
            + 'id_drupal INTEGER NOT NULL, '
            + 'name TEXT NOT NULL, '
            + 'address TEXT NOT NULL, '
            + 'city TEXT NOT NULL, '
            + 'img TEXT NOT NULL, '
            + 'url TEXT NOT NULL, '
            + 'phone TEXT NOT NULL, '
            + 'category TEXT NOT NULL, '
            + 'email TEXT NOT NULL)'
            );
};

function openDB() {
    if (!db) {
        db = window.openDatabase(dbname, "1.0", "Social Paraiso", 200000);
    }
}

function errorCB(err) {
    console.log("Tenemos un error SQL: " + err.code);
}
function successCreateCB() {
    console.log("¡Base de datos " + dbname + " Creada full!");
}

function createDB() {
    openDB();
    db.transaction(createTables, errorCB, successCreateCB);
}

/*
 * insertSQL: Agrega las nuevos Metas en un arreglo y abre la conexión a la base de datos.
 * @param {type:array} row, value, table
 * @returns {rows, vals}
 */

function insertSQL(row, value, table) {
    openDB();

    this.rows = row;
    this.vals = value;
    this.tableSQL = table;
    db.transaction(insertDB, errorCB);
}

/*
 * insertDB: Inserta nuevas Metas desde arreglos con información de estos.
 * @param {type:db} tx
 * @returns {undefined}
 */

function insertDB(tx) {
    var sql = "INSERT INTO " + tableSQL + " "
            + "(" + rows.join(', ') + ") VALUES "
            + "(\"" + vals.join('", "') + "\");";
//    alert(sql);
    tx.executeSql(sql);
    console.log("Nueva insersión en " + tableSQL);
    window.localStorage.setItem('sync', true);
    console.log(sql);
}

/*
 * updateSQL: 
 * @param {type:array} row, value, table
 * @returns {rows, vals}
 */

function updateSQL(table) {
    openDB();

    this.tableSQL = table;
    db.transaction(updateDB, errorCB);
}

/*
 * updateDB:
 * @param {type:db} tx
 * @returns {undefined}
 */

function updateDB(tx) {
    var sql = tableSQL;
    tx.executeSql(sql);
    console.log("Se ejecutó la consulta " + tableSQL);
    window.localStorage.setItem('sync', true);
}

function loadComments(id) {
    openDB();
    db.transaction(queryDBComments, errorCB);
    id_actual = id;
}

/*
 * queryDBPlans: ejecuta la consulta SQL para buscar los eventos del usuario.
 * @param {type} tx
 * @returns {undefined}
 */

function queryDBComments(tx) {
    tx.executeSql('SELECT * FROM sp_comments WHERE dad = ' + id_actual, [], querySuccessComments, errorCB);
}

function querySuccessComments(tx, results) {
    if (results.rows.length > 0) {
        var comments = '<ul>';
        comments += '<li>Comentarios/Notas</li>';
        for (var i = 0; i < results.rows.length; i++) {
            comments += '<li style="width:100%;">' + results.rows.item(i).text + '</li>';
        }
        comments += '</ul>';
        if (typeof slide_event === 'function') {
            $('#coment_event' + id_actual).html(comments);
            slide_event('coment_event', id_actual);
        } else {
            $('#coment_budget' + id_actual).html(comments);
            budget.slide_budget('coment_budget', id_actual);
        }

    } else {
        if (typeof slide_event === 'function') {
            ToastL('Este evento no tiene comentarios.');
        } else {
            ToastL('Este concepto no tiene comentarios.');
        }

    }
}