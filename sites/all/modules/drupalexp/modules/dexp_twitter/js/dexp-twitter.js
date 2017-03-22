jQuery(document).ready(function($){
  $.each(Drupal.settings.dexp_twitter,function(id, options){
    var $slider=$('#'+id);
    $slider.bxSlider(options);
  });
});