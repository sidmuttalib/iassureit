<?php if ($link == ""):?>
<i class="<?php print $class; ?>"></i> <?php print $content;?>
<?php else: ?>
<a href="<?php print $link;?>"><i class="<?php print $class;?>"></i> <?php print $content;?></a>
<?php endif;?>
    
