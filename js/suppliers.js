/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var idss = [];

function suppliers() {
    this.constructor = function() {
        index.loadMenu();
        $('#suppliers').on("swiperight", suppliers.swiperight);
        $('div#loadmoreajaxloader').show();
        suppliers.getSuppliers();
        setTimeout("suppliers.loadsuppliers()", 10);
        suppliers.categories();
    };

    this.swiperight = function() {
        $("#right-panel").panel("open");
    };

    this.loadsuppliers = function() {
        if (navigator.onLine) {
            var _page = "json-proveedores";
            var ArrCity = [];
            var ArrCats = [];
            $.ajax({
                type: 'GET',
                url: _hostf + _page,
                dataType: "json",
                success: function(data) {
                    var items = '';
                    $.each(data.proveedores, function(key, val) {

                        $.each(val, function(name, value) {
                            ArrCats.push(value.Categoria);
                            ArrCity.push(value.Ciudad);

                            items += '<div class="supp ' + value.Categoria.replace(' ', '_') + ' ' + value.Ciudad + ' ">';
                            var nose = [value.ID, "'" + value.Nombre + "'", "'" + value.Direccion + "'", "'" + value.Ciudad + "'", "'" + value.Logotipo + "'", "'" + value.URL + "'", "'" + value.Telefono + "'", "'" + value.Categoria + "'", "'" + value.Correo + "'"];
                            items += '<h3>' + value.Nombre + '</h3>';
                            items += '<img src="' + value.Logotipo + '" />';
                            items += '<div class="ico_contact"></div><div class="info_suppliers">';
                            items += '<p>Tel: <a href="tel:' + value.Telefono + '" >' + value.Telefono + '</a></p>\n\
                                        <p><a href="mailto:' + value.Correo + '" >' + value.Correo + '</a></p>\n\
                                        <p><a href="#" onclick="go_(\'' + value.URL + '\', \'external\');" >' + value.URL + '</a></p><p>' + value.Ciudad + '</p>';
                            if ($.inArray(parseInt(value.ID), idss) === -1) {
                                items += '</div><div class="ico_favorite" id="favorite_' + value.ID + '" onclick="suppliers.newFavorite(' + nose + ');"></div>';
                            } else {
                                items += '</div><div class="ico_favorite ico_favorite_on" id="favorite_' + value.ID + '" onclick="suppliers.delFavorite(' + value.ID + ');"></div>';
                            }
                            items += '</div>';
                        });
                    });
                    $.unique(ArrCats);
                    $.unique(ArrCity);
                    $.each(ArrCats, function(key, value)
                    {
                        $("#category").append(new Option(value, value.replace(' ', '_')));
                    });
                    $.each(ArrCity, function(key, value)
                    {
                        $("#city").append(new Option(value, value.replace(' ', '_')));
                    });
                    $('div#loadmoreajaxloader').hide();
                    $('#lst_suppliers').html(items);
                },
                error: function() {
                    ToastL("Falló la conexión al servidor.");
                    $('#lst_suppliers').html("Problemas con la conexión al servidor.");
                }
            });
        } else {
            $('div#loadmoreajaxloader').hide();
            ToastL('No hay conexión a internet');
        }
    };

    this.newFavorite = function(id_drupal, name, address, city, img, url, phone, category, email) {
        var supplier_info = [];
        var supplier_data = ['id_drupal', 'name', 'address', 'city', 'img', 'url', 'phone', 'category', 'email'];
        supplier_info.push(id_drupal, name, address, city, img, url, phone, category, email);
        insertSQL(supplier_data, supplier_info, 'sp_suppliers');

        $('#favorite_' + id_drupal).css('background-image', 'url(img/menu_botton/ico_favoritos.png)');
        ToastL('Tienes un nuevo Favorito.');
    };

    this.delFavorite = function(id_drupal) {
        updateSQL("DELETE FROM sp_suppliers WHERE id_drupal = " + id_drupal);
        $('#favorite_' + id_drupal).css('background-image', 'url(img/menu_botton/ico_favoritos_on.png)');
    };

    this.errorCB = function(err) {
        console.log("Tenemos un error SQL: " + err.code);
    };

    this.getSuppliers = function() {
        openDB();
        db.transaction(suppliers.querySuppliers, suppliers.errorCB);
    };

    /*
     * queryInspiration: ejecuta la consulta SQL para buscar la información de las imagenes de pinterest.
     * @param {type} tx
     * @returns {undefined}
     */
    this.querySuppliers = function(tx) {
        tx.executeSql('SELECT * FROM sp_suppliers', [], suppliers.querySuccessSuppliers, errorCB);
    };

    /*
     * querySuccessInspiration: retorna un listado con la información de las imagenes de pinterest.
     * @param {type} tx
     * @param {type} results
     * @returns {events}
     */
    this.querySuccessSuppliers = function(tx, results) {
        if (results.rows.length > 0) {
            for (var i = 0; i < results.rows.length; i++) {
                idss.push(results.rows.item(i).id_drupal);
            }
        }
    };

    this.categories = function() {
        var cate;
        var city;

        $('#city').change(function() {
            cate = $("#category option:selected").val();
            city = $("#city option:selected").val();
            $('.supp').hide();
            $('.' + cate + '.' + city).show();
            if (city === '0') {
                $('.supp.' + cate).show();
            }
            if (cate === '0') {
                $('.supp.' + city).show();
            }
            if (cate === '0' && city === '0') {
                $('.supp').show();
            }
        });

        $('#category').change(function() {
            cate = $("#category option:selected").val();
            city = $("#city option:selected").val();
            $('.supp').hide();
            $('.' + cate + '.' + city).show();
            if (cate === '0') {
                $('.supp.' + city).show();
            }
            if (cate === '0' && city === '0') {
                $('.supp').show();
            }
            if (city === '0') {
                $('.supp.' + cate).show();
            }
        });
    };
}

if (filename === 'suppliers.html') {
    var suppliers = new suppliers();
    $(document).ready(function()
    {
        if (emulated)
            suppliers.constructor();
        else if (ismobile)
            document.addEventListener("deviceready", suppliers.constructor, true);
        else
            ToastL('Lo siento es un app mobile');
    });
}