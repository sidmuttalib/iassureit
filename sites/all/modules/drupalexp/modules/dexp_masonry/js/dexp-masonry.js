(function($){
  Drupal.behaviors.dexp_masonry = {
    attach: function(context,settings) {
      //if(context.location == null) return;
      $('.dexp-masonry').each(function(){
        var $grid = $(this),id=$grid.attr('id'),
        container_width = $(this).width(),
        options = settings.dexp_masonry[id],
        $filter = $('#'+settings.dexp_masonry[id].filter_id);
        
        options.columnWidth = dexp_masonry_col_width($grid, options);
        $grid.data('resize', true);
        $grid.shuffle({
          itemSelector: '.dexp-masonry-item',
          speed: 500,
          //columnWidth: options.columnWidth,
          //gutterWidth: options.grid_margin,
          sizer: $grid.find('.shuffle__sizer')
        }).shuffle('shuffle', 'all');
        //$grid.on('shrunk.shuffle',function(){alert('shuffle')});
        $(window).resize(function(){
          if($grid.data('resize') == true){
            dexp_masonry_col_width($grid, options);
            $grid.shuffle('update');
          }
        });
        if($filter.length > 0){
          $filter.find('a').click(function(){
            var $this = $(this), filter = $this.data('filter');
            //alert(filter);
            if(filter == '*'){
              $grid.shuffle('shuffle', 'all');
            }else{
              $grid.shuffle('shuffle', function($el, shuffle) {
                if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
                  return false;
                }
                return $el.find('>div').hasClass(filter);
              });
            }
            $filter.find('a').removeClass('active');
            $this.addClass('active');
            return false;
          });
        }
      });
    }
  }
  
  function dexp_masonry_col_width($container, options){
    //var w = $container.width(), 
    var ww = $(window).width(),
    w = $container.width(),
    columnNum = 1,
    columnWidth = 0,
    columnHeight = 0;
    if(ww < 768){
      columnNum = options.grid_cols_xs;
    } else if(ww >= 768 && ww < 992){
      columnNum = options.grid_cols_sm;
    } else if(ww >= 992 && ww < 1200){
      columnNum = options.grid_cols_md;
    } else if(ww >= 1200){
      columnNum = options.grid_cols_lg;
    }
    /*
    if (w > 1000) {
      columnNum  = 5;
    } else if (w > 900) {
      columnNum  = 4;
    } else if (w > 600) {
      columnNum  = 3;
    } else if (w > 300) {
      columnNum  = 2;
    }
    */
    columnWidth = Math.floor((w-options.grid_margin*(columnNum-1))/columnNum);
    columnHeight = columnWidth*options.grid_ratio;
    $container.find('.shuffle__sizer').css({
      width: columnWidth,
      margin: options.grid_margin
    });
    
    $container.find('.dexp-masonry-item').each(function() {
      var $item = $(this),
      multiplier_w = $item.attr('class').match(/item-w(\d)/),
      multiplier_h = $item.attr('class').match(/item-h(\d)/),
      width = columnNum==1?columnWidth:multiplier_w[1]*columnWidth + (multiplier_w[1]-1)*options.grid_margin,
      height = columnNum==1?columnHeight:multiplier_h[1]*columnHeight +(multiplier_h[1]-1)*options.grid_margin;
      $item.css({
        width: width,
        height: height,
        marginBottom: options.grid_margin
      });
    });
    return columnWidth;
  }
})(jQuery);