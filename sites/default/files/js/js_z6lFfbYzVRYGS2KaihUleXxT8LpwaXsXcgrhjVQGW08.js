(function ($) {
    $.fn.dexpPieChart = function () {
        return this.each(function () {
            var $this = $(this),
                percent = $this.data('percent'),
                start = 0;
            $this.append('<div class="ppc-progress"><div class="ppc-progress-fill"></div></div><div class="ppc-percents"><div class="pcc-percents-wrapper"><span>%</span></div></div>');
            var i = setInterval(function () {
                if (start <= percent) {
                    var deg = parseInt(start) * 3.6;
                    if (start > 50) {
                        $this.addClass('gt-50');
                    }
                    $this.find('.ppc-progress-fill').css('transform', 'rotate(' + deg + 'deg)');
                    $this.find('.ppc-percents span').html(start + '%');
                    start++;
                } else {
                    clearInterval(i);
                }
            }, 20);
        });
    };
    $(document).ready(function () {
        if ($.isFunction($.fn.appear)) {
            $('.dexp-pie-chart').each(function(){
                var $char = $(this);
                $char.appear(function () {
                    $char.dexpPieChart();
                    $char.unbind('appear');
                }, {
                    accX: 0,
                    accY: 0,
                    one: false
                });
            });
        }else{
            $('.dexp-pie-chart').dexpPieChart();
        }
    });
}(jQuery));;
/* Switcher grid view and list view shop product*/
(function($) {
    Drupal.behaviors.orane_theme = {
        attach: function(context, settings) {
        $('#block-views-blog-block-1 .dexp-grid-item .text-readmore').hide();
            if ($('.view-products-shop .dexp-grid-items').attr('class') && $('.view-products-shop .dexp-grid-item').attr('class')) {
                var classGridList = $('.view-products-shop .dexp-grid-items').attr('class').split(/\s+/);
                var gridClasses = "";
                $.each(classGridList, function(index, item) {
                    if (item.match("grid-")) {
                        gridClasses = gridClasses + item + " ";
                    }
                });

                var colClassList = $('.view-products-shop .dexp-grid-item').attr('class').split(/\s+/);
                var colClasses = "";
                $.each(colClassList, function(index, item) {
                    if (item.match("col-")) {
                        colClasses = colClasses + item + " ";
                    }
                });
                $('.list-filter').click(function() {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active');
                        $('.grid-filter').removeClass('active');
                    }
                    if ($('.view-products-shop').hasClass('product-grid-view')) {
                        $('.view-products-shop').addClass('product-list-view');
                        $('.view-products-shop').removeClass('product-grid-view');
                        $('.view-products-shop .dexp-grid-items').removeClass(gridClasses);
                        $('.view-products-shop .dexp-grid-item').removeClass(colClasses);
                        $('.view-products-shop .dexp-grid-item').addClass('dexp-list-item');
                        $('.view-products-shop .dexp-grid-item').removeClass('dexp-grid-item');
                    }
                });
                $('.grid-filter').click(function() {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active');
                        $('.list-filter').removeClass('active');
                    }
                    if ($('.view-products-shop').hasClass('product-list-view')) {
                        $('.view-products-shop').removeClass('product-list-view');
                        $('.view-products-shop').addClass('product-grid-view');

                        $('.view-products-shop .dexp-list-item').addClass('dexp-grid-item');
                        $('.view-products-shop .dexp-list-item').removeClass('dexp-list-item');
                        $('.view-products-shop .dexp-grid-items').addClass(gridClasses);
                        $('.view-products-shop .dexp-grid-item').addClass(colClasses);
                    }
                });
            }
        }
    };
    var orane_scrolltotop = function() {
        $('html, body').animate({
            scrollTop: '0'
        }, 800);
    };
    $(document).ready(function() {
        $('.goto-top').click(function(e) {
            e.preventDefault();
            orane_scrolltotop();
        });
        $('.open-menu').click(function(e) {
            e.preventDefault();
            orane_scrolltotop();
            setTimeout(function() {
                $('.dexp-menu-toggler').trigger('click');
            }, 800);
        });
        //Go to top
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('#page-tools').css({
                    bottom: "10px"
                });
            } else {
                $('#page-tools').css({
                    bottom: "-100px"
                });
            }
        });

        //EasyPieChart
        $('.chart').each(function() {
            $(this).easyPieChart({
                easing: 'easeOutBounce',
                size: 200,
                animate: 2000,
                lineWidth: 10,
                lineCap: 'square',
                barColor: Drupal.settings.drupalexp.base_color,
                trackColor: '#F5F5F5',
                scaleColor: false,
                onStep: function(a, b, c) {
                    $(this.el).find('span.percent').text(Math.round(a) + '%');
                }
            });
        });
        if(detectIE()>1)
        {
            $("body").addClass('ie');
        }
    });
    
})(jQuery);

jQuery(document).ready(function($) {
    $('.grid-filter').tooltip();
    $('.list-filter').tooltip();
    /* Counter */
    $(".stat-count").each(function() {
        $(this).data('count', parseInt($(this).html(), 10));
        $(this).html('0');
        count($(this));
    });
    /*tooltips*/
    $('.dtooltip').tooltip({
        container: 'body'
    });
    /*
     $('.region-navigation').click(function(e) {
     if ($(e.target).hasClass('region-navigation')) {
     $('body').removeClass('menu-open');
     }
     });
     */
    $('.search-toggle').click(function() {
        $(this).closest('.region').toggleClass('open');
        $(this).find('input[type=text]').focus();
        return false;
    });
    $(document).click(function(event) {
        var $target = $(event.target);
        if (!$target.hasClass('.search-toggle') && $target.parents('.search-form-block-wrapper').length === 0) {
            $('.search-form-block-wrapper').closest('.region').removeClass('open');
        }
    }).keyup(function(e) {
        if (e.keyCode === 27) {
            $('.search-form-block-wrapper').closest('.region').removeClass('open');
        }
    });
});


function count($this) {
    var current = parseInt($this.html(), 10);
    current = current + 1; /* Where 50 is increment */

    $this.html(++current);
    if (current > $this.data('count')) {
        $this.html($this.data('count'));
    } else {
        setTimeout(function() {
            count($this)
        }, 50);
    }
}
function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    // other browser
    return false;
}
;
