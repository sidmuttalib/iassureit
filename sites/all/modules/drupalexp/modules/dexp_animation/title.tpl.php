<?php if($title):?>
<h2 class="block-title <?php if(!$subtitle){print ' no-subtitle';}?>"><?php print $title;?></h2>
<?php if($subtitle):?>
<p class="block-subtitle"><?php print $subtitle;?></p>
<?php endif;?>
<?php endif;?>
