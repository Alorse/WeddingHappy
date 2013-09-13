/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var suppliers = new suppliers();

function favorites() {
    this.constructor = function() {
        index.loadMenu();
//        $('#favorites').on("swiperight", favorites.swiperight);
        favorites.loadInspiration();
        favorites.change_category();
    };

    this.swiperight = function() {
        $("#right-panel").panel("open");
    };

    this.change_category = function() {
        $('#categorys').change(function() {
            var val = $("#categorys option:selected").val();
            if (val === 'p') {
                favorites.loadSuppliers();
            } else if (val === 'i') {
                favorites.loadInspiration();
            }
        });

    };

    this.loadInspiration = function() {
        favorites.getSqlResultInspiration();
    };

    this.loadSuppliers = function() {
        favorites.getSqlResultSuppliers();
    };

    this.errorCB = function(err) {
        console.log("Tenemos un error SQL: " + err.code);
    };

    this.getSqlResultSuppliers = function() {
        openDB();
        db.transaction(favorites.queryDBSuppliers, favorites.errorCB);
    };

    /*
     * queryDBPlans: ejecuta la consulta SQL para buscar los budgetos del usuario.
     * @param {type} tx
     * @returns {undefined}
     */
    this.queryDBSuppliers = function(tx) {
        tx.executeSql('SELECT * FROM sp_suppliers', [], favorites.querySuccessSuppliers, favorites.errorCB);
    };

    this.querySuccessSuppliers = function(tx, results) {
        var suppliers = '';
        var items = '';
        if (results.rows.length > 0) {
            for (var i = results.rows.length - 1; i >= 0; i--) {

                suppliers += results.rows.item(i).name;
                items += '<div class="supp ' + results.rows.item(i).category + ' ' + results.rows.item(i).city + ' ">';
                items += '<h3>' + results.rows.item(i).name + '</h3>';
                items += '<img src="' + results.rows.item(i).img + '" />';
                items += '<div class="ico_contact"></div><div class="info_suppliers">';
                items += '<p>Tel: <a href="tel:' + results.rows.item(i).phone + '" >' + results.rows.item(i).phone + '</a></p>\n\
                                        <p><a href="mailto:' + results.rows.item(i).email + '" >' + results.rows.item(i).email + '</a></p>\n\
                                        <p><a href="#" onclick="go_(\'' + results.rows.item(i).url + '\', \'external\');" >' + results.rows.item(i).url + '</a></p><p>' + results.rows.item(i).city + '</p>';
                items += '</div><div class="ico_favorite ico_favorite_on" id="favorite_' + results.rows.item(i).id + '" onclick="suppliers.delFavorite(' + results.rows.item(i).id_drupal + '); $(\'.supp.' + results.rows.item(i).category + '.' + results.rows.item(i).city + '\').fadeToggle();"></div>';

                items += '</div>';
            }
            $('.lst_favorites').html(items);
        }
    };

    this.getSqlResultInspiration = function() {
        openDB();
        db.transaction(favorites.queryDBInspiration, favorites.errorCB);
    };

    /*
     * queryDBPlans: ejecuta la consulta SQL para buscar los budgetos del usuario.
     * @param {type} tx
     * @returns {undefined}
     */
    this.queryDBInspiration = function(tx) {
        tx.executeSql('SELECT * FROM sp_inspiration', [], favorites.querySuccessInspiration, favorites.errorCB);
    };

    this.querySuccessInspiration = function(tx, results) {
        var inspiration = '<div style="margin:5px;"></div>';
        if (results.rows.length > 0) {
            for (var i = results.rows.length - 1; i >= 0; i--) {
                if (results.rows.item(i).favorite === 1) {
                    inspiration += '<div class="pin" id="pin' + results.rows.item(i).id_pin + '">';
                    inspiration += '<img src="' + results.rows.item(i).url + '" class="imgpin" />';
                    inspiration += '<div class="pinsocial">';
                    inspiration += '<img src="img/ico_inspiracion/ico_favorite_on.png" class="iconfoll" style="padding: 3px 4px 5px 7px;" id="favorite' + results.rows.item(i).id_pin + '" />';
                    inspiration += '</div>';
                    inspiration += '</div>';
                }
            }
            $('.lst_favorites').html(inspiration);
        }

        $('.iconfoll').mousedown(function(e) {
            var id_pin = e.target.id.replace('favorite', '');
            updateSQL('UPDATE sp_inspiration SET favorite = 0 WHERE id_pin = "' + id_pin + '"');
            $('#pin' + id_pin).fadeToggle();
        });
    };
}


var favorites = new favorites();

$(document).ready(function()
{
    if (emulated)
        favorites.constructor();
    else if (ismobile)
        document.addEventListener("deviceready", favorites.constructor, true);
    else
        ToastL('Lo siento es un app mobile');
});