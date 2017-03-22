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
}(jQuery));