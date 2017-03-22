/*!Copyright (c) 2014 Drual Exp (http://drupalexp.com)*/

jQuery(document).ready(function($) {
    $('.dexp-parallax').each(function() {
        var $this = $(this),
                element_h = $this.outerHeight(),
                background_w = $this.data('background-width'),
                background_h = $this.data('background-height'),
                speedFactor = $this.data('background-ratio'),
                ratio = background_w / background_h;

        var adjustbackground = function() {
            window_height = $(window).height();
            element_h = $this.outerHeight();
            background_h = element_h + window_height * (1 - speedFactor);
            background_w = background_h * ratio;
            if (background_w < $this.width()) {
                background_w = $this.width();
                background_h = background_w / ratio;
            }
            $this.css({
                backgroundSize: 'auto ' + background_h + 'px'
            });
        };
        var doScroll = function() {
            if ($(window).width() < 768) {
                return;
            }
            var delta = Math.round(isappears($this) * (1 - speedFactor));
            if (delta > 0) {
                var background_y = $this.outerHeight() - background_h + delta;
                $this.css({
                    backgroundPosition: '50% ' + background_y + 'px'
                });
            }
        };
        adjustbackground();
        doScroll();
        $(window).bind({
            scroll: function() {
                doScroll();
            },
            load: function() {
                adjustbackground();
                doScroll();
            },
            resize: function(){
                adjustbackground();
            }
        });
    });

    function isappears(element) {
        var scrolltop = $(window).scrollTop(),
                top = $(element).offset().top;
        if (top < $(window).height()) {
            return scrolltop;
        }
        if ((scrolltop + $(window).height()) >= ($(element).offset().top)) {
            return scrolltop + $(window).height() - $(element).offset().top;
        }
        return 0;
    }
});
