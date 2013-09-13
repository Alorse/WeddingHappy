/**
 * @name		jQuery Countdown Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
 * @license		MIT License
 */

(function($) {

    // Number of seconds in every time division
    var months = 30 * 24 * 60 * 60,
            days = 24 * 60 * 60,
            hours = 60 * 60,
            minutes = 60;

    // Creating the plugin
    $.fn.countdown = function(prop) {

        var options = $.extend({
            callback: function() {
            },
            timestamp: 0
        }, prop);

        var left, mo, d, h, m, s, positions;

        // Initialize the plugin
        init(this, options);

        positions = this.find('.position');

        (function tick() {

            // Time left
            left = Math.floor((options.timestamp - (new Date())) / 1000);

            if (left < 0) {
                left = 0;
            }

            // Number of days left
            mo = Math.floor(left / months);
            updateDuo(0, 1, mo);
            left -= mo * months;

            // Number of days left
            d = Math.floor(left / days);
            updateDuo(2, 3, d);
            left -= d * days;

            // Number of hours left
            h = Math.floor(left / hours);
            updateDuo(4, 5, h);
            left -= h * hours;

            // Number of minutes left
            m = Math.floor(left / minutes);
            updateDuo(6, 7, m);
            left -= m * minutes;

            // Number of seconds left
            s = left;
            updateDuo(8, 9, s);

            // Calling an optional user supplied callback
            options.callback(mo, d, h, m, s);

            // Scheduling another call of this function in 1s
            setTimeout(tick, 1000);
        })();

        // This function updates two digit positions at once
        function updateDuo(minor, major, value) {
            switchDigit(positions.eq(minor), Math.floor(value / 10) % 10);
            switchDigit(positions.eq(major), value % 10);
        }

        return this;
    };


    function init(elem, options) {
        elem.addClass('countdownHolder');

        // Creating the markup inside the container
        
        $.each(['Meses', 'Días', 'Horas', 'Minutos', 'Segundos'], function(i) {
            var con = '';
            con += '<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>';
            if (this == 'Minutos' || this == 'Segundos')
                con += '<div class="infolabel" style="padding-left: 18.5px;"><label>' + this + '</label></div>';
            else
                con += '<div class="infolabel"><label>' + this + '</label></div>';

            $('<span class="count' + this + '">').html(con).appendTo(elem);
        });

    }

    // Creates an animated transition between the two numbers
    function switchDigit(position, number) {

        var digit = position.find('.digit')

        if (digit.is(':animated')) {
            return false;
        }

        if (position.data('digit') == number) {
            // We are already showing this number
            return false;
        }

        position.data('digit', number);

        var replacement = $('<span>', {
            'class': 'digit',
            css: {
                top: '-1.5em',
                opacity: 0
            },
            html: number
        });

        // The .static class is added when the animation
        // completes. This makes it run smoother.

        digit
                .before(replacement)
                .removeClass('static')
                .animate({top: '2.5em', opacity: 0}, 'fast', function() {
            digit.remove();
        })

        replacement
                .delay(100)
                .animate({top: 0, opacity: 1}, 'fast', function() {
            replacement.addClass('static');
        });
    }
})(jQuery);