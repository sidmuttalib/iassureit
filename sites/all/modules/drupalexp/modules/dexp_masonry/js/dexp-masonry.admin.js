jQuery(document).ready(function($){
  $('.dexp-masonry').each(function(){
    var $grid = $(this),
    options = Drupal.settings.dexp_masonry[$grid.attr('id')];
    $grid.find('.dexp-masonry-item').resizable({
      grid:[options.columnWidth+options.grid_margin,options.columnWidth*options.grid_ratio+options.grid_margin],
      autoHide: true,
      start:function(){
        $grid.data('resize', false);
      },
      resize:function(){
        $grid.shuffle('update');
      },
      stop: function( event, ui ){
        $grid.data('resize', true);
        var w = Math.floor(ui.size.width/options.columnWidth),
        h = Math.floor(ui.size.height/options.columnWidth*2),
        item = $(ui.element).data('index');
        var url = Drupal.settings.basePath+'?q=drupalexp/masonry/save/'+$grid.attr('id')+'/'+item+'/'+w+'/'+h;
        $.ajax({
          url: url,
          success: function(){
            
          }
        });
      }
    });
  });  
});