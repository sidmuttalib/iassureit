<?php
  if (strtolower(trim($type)) == 'icon') {
    $place_holder = '<i class="'.$icon.'"></i>';
  } 
  if (strtolower(trim($type)) == 'img') {
    $place_holder = '<img alt="" src="'.$image.'">';
  }
?>

<div class="services-box services-box-animated">
  <div class="inner">
    <div class="front"><?php print $place_holder;?>
      <h3><?php print $title;?></h3>
    </div>
    <div class="back">
      <h3><?php print $title;?></h3>
      <p><?php print $content;?></p>
    </div> 
  </div> 
</div>
