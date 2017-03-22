jQuery(document).ready(function($){
  //alert(Drupal.settings.dexp_masonry.view);
  var masonry_item_width = 110;
  var masonry_item_height = 110;
  var $grid = $('.view-portfolio-masonry .view-content');
  $grid.shuffle({
    itemSelector: '.dexp-masonry-item',
    speed: 500
  });
  $grid.shuffle('shuffle', 'all');
  $('.dexp-masonry-item').resizable({
    grid: [110, 110],
    resize:function(){
      $grid.shuffle('shuffle', 'all');
    },
    stop: function( event, ui ){
      var w = ui.size.width/masonry_item_width;
      var h = ui.size.height/masonry_item_height;
      var url = Drupal.settings.basePath+'drupalexp/masonry/save/'+Drupal.settings.dexp_masonry.view+'/'+0+'/'+w+'/'+h;
      $.ajax({
        url: url,
        success: function(){
          $grid.shuffle('shuffle', 'all');
        }
      });
      //alert(JSON.stringify(ui.size.width));
    }
  });
});