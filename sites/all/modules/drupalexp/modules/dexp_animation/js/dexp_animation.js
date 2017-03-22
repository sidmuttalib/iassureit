jQuery(document).ready(function($) {
    $(".dexp-animate").each(function() {
        var $this = $(this);
        var animate_class = $this.data('animate'), delay = $this.data('animate-delay') || 0;
        $this.appear(function() {
            setTimeout(function() {
                $this.addClass('animated').addClass(animate_class);
                $this.unbind('appear');
            }, delay);
        }, {
            accX: 0,
            accY: 0,
            one: false
        });
    });
})
