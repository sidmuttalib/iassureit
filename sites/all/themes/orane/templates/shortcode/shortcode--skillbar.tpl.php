<div id="<?php print $element_id; ?>" class="skill-bar <?php print $class;?>" data-percent="<?php print $percent; ?>">    
    <?php if ($percent): ?>
        <div data-progress="<?php print $percent; ?>" class="progress progress-success progress-striped">
            <div class="bar"><small><?php print $content.' - '.$percent . '%'; ?></small></div>
        </div>
    <?php endif; ?>
</div>
<script type="text/javascript">
    jQuery(document).ready(function($) {
        var $skillbar = $('#<?php print $element_id; ?>');
        var percent = $skillbar.data('percent');
        //Make sure appear plugin is loaded
        if (typeof $.fn.appear == 'function') {
            $skillbar.appear(function() {
                $skillbar.find('.bar').css({width: percent + '%'});
            });
        } else {
            $skillbar.find('.bar').css({width: percent + '%'});
        }
    });
</script>