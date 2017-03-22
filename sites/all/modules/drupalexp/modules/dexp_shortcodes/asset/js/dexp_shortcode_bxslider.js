jQuery(document).ready(function($){
  var bxsliderProperties = ["mode","speed","slideMargin","startSlide","randomStart","slideSelector","infiniteLoop","hideControlOnEnd","easing","captions","ticker","tickerHover","adaptiveHeight","adaptiveHeightSpeed","video","responsive","useCSS","preloadImages","touchEnabled","swipeThreshold","oneToOneTouch","preventDefaultSwipeX","preventDefaultSwipeY","pager","pagerType","pagerShortSeparator","pagerSelector","pagerCustom","buildPager","controls","nextText","prevText","nextSelector","prevSelector","autoControls","startText","stopText","autoControlsCombine","autoControlsSelector","auto","pause","autoStart","autoDirection","autoHover","autoDelay","minSlides","maxSlides","moveSlides","slideWidth"];
  $('.dexp-shortcode-bxslider').each(function(){
    var $this = $(this);
    var options = {};
    $(bxsliderProperties).each(function(){
      if($this.data(this.toString().toLowerCase()) != 'undefined'){
        options[this.toString()] = $this.data(this.toString().toLowerCase());
      }
    });
    if(!$this.data('controls')){
      options.nextSelector = null;
      options.prevSelector = null;
    }
    var container_width = $this.parents('.view-content').css({position:'relative'}).width();
    var newoptions = adjustOptions(options, container_width);
    //alert(container_width);
    var slide = $this.bxSlider(newoptions);
    $(window).resize(function(){
      var container_width = $this.parents('.view-content').width();
      var newoptions = adjustOptions(options, container_width);
      slide.destroySlider();
      slide = $this.bxSlider(newoptions);
    });
  })
  function adjustOptions(options, container_width){
    var _options = {};
    $.extend(_options, options);
    if((_options.slideWidth*_options.maxSlides + (_options.slideMargin*(_options.maxSlides-1))) < container_width){
      _options.slideWidth = (container_width-(_options.slideMargin*(_options.maxSlides-1)))/_options.maxSlides;
    }else{
      _options.maxSlides = Math.floor((container_width-(_options.slideMargin*(_options.maxSlides-1)))/_options.slideWidth);
      _options.maxSlides = _options.maxSlides == 0?1:_options.maxSlides;
      _options.slideWidth = (container_width-(_options.slideMargin*(_options.maxSlides-1)))/_options.maxSlides;
      //alert(_options.slideWidth)
    }
    return _options;
  }
});