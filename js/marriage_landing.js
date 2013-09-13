/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function landing() {
    this.constructor = function() {
        $('#nameme').html(window.localStorage.getItem("nameme"));
        $('#nameaf').html(window.localStorage.getItem("nameaf"));

        $('#photobf').html('<img src="' + window.localStorage.getItem("photo") + '" class="photobf" />');
        $(".photobf").rotate(value);

        $('#photobf').height($(document).height());

        $('#right-panel').height($(document).height());

        $('#landing').on("swiperight", landing.swiperight);
        document.addEventListener("backbutton", index.onBackbutton, false);
    };

    this.swiperight = function() {
        index.loadMenu();
        $("#right-panel").panel("open");
    };
}

var landing = new landing();

$(document).ready(function()
{
    if (emulated)
        landing.constructor();
    else if (ismobile)
        document.addEventListener("deviceready", landing.constructor, true);
    else
        ToastL('Lo siento es un app mobile');
});

$(function() {
    var date = window.localStorage.getItem("datema").split('-');
    var ts = new Date(date[0], date[1] - 1, date[2]);
    if ((new Date()) > ts) {
        ts = (new Date()).getTime() + 10 * 24 * 60 * 60 * 1000;
    }
    $('#countdown').countdown({
        timestamp: ts
    });
});