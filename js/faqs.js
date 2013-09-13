/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function faqs() {
    this.constructor = function() {
        index.loadMenu();
        $('#faqs').on("swiperight", faqs.swiperight);
        $('.wrap').css("height", $('body').height());
        setTimeout("faqs.lst_faqs()", 100);
    };

    this.swiperight = function() {
        index.loadMenu();
        $("#right-panel").panel("open");
    };


    this.lst_faqs = function() {
        if (navigator.onLine) {
            var _page = "feed-faq";

            $.ajax({
                type: 'GET',
                url: _hostf + _page,
                dataType: "xml",
                success: function(data) {
                    var faqs = '';
                    var f = 1, g = 0;
                    $(data).find('nodes').each(function() {
                        $(this).find('node').each(function() {
                            var res = $(this).find('Respuesta').text().replace("<![CDATA[", "");
                            res = res.replace("]]>", "");
                            faqs += '<div class="faq" onclick="faqs.slide_faq(' + f + ')">';
                            faqs += '<h4>' + $(this).find('Titulo').text() + '</h4>';
                            faqs += res;
                            faqs += '</div>';
                            f++;
                        });
                    });
                    $('.content_faqs').html(faqs);
                    $('p').each(function() {
                        var $this = $(this);
                        if ($this.html().replace(/\s|&nbsp;/g, '').length === 0)
                            $this.remove();
                        else {
                            $this.attr('id', 'answer' + g);
                            g++;
                        }
                    });
                },
                error: function() {
                    ToastL("Falló la conexión al servidor.");
                    $('.content_faqs').html("Problemas con la conexión al servidor.");
                }
            });
        } else {
            ToastS('No hay conexión a Internet');
            $('.content_faqs').html('No hay conexión a Internet');
        }
    };

    this.slide_faq = function(id) {
        $('#answer' + id).slideFadeToggle();
    };
}

var faqs = new faqs();

$(document).ready(function()
{
    if (emulated)
        faqs.constructor();
    else if (ismobile)
        document.addEventListener("deviceready", faqs.constructor, true);
    else
        ToastL('Lo siento es un app mobile');
});