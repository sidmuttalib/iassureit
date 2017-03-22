<div id ="<?php print $stats_id;?>" class="stats <?php if($class) print $class;?>">
    <div data-num="<?php print $timer;?>" data-content="<?php print $number;?>" class="num"><?php print $number;?></div>
    <?php if ($content):?>
    <div class="type"><?php print $content;?></div>
    <?php endif; ?>
</div>
<script type="text/javascript">
jQuery(document).ready(function($){
  function number(num, content, target, duration) {
    if (duration) {
        var count = 0;
        var speed = parseInt(duration / num);
        var interval = setInterval(function() {
            if (count - 1 < num) {
                target.html(count);
            }
            else {
                target.html(content);
                clearInterval(interval);
            }
            count++;
        }, speed);
    } else {
        target.html(content);
    }
  }

  function stats(duration) {
       $('#<?php print $stats_id;?> .num, .stats-alt .num').each(function() {
          $(this).appear(function(){
            var container = $(this);
            var num = container.data('num');
            var content = container.data('content');
            number(num, content, container, duration);
          });
      });
  }
  stats(300);
  });
</script>