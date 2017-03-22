<div class="<?php print $classes;?>">
  <?php if ($icon): ?>
    <div class="box-icon"><span><i class="<?php print $icon; ?>"></i><br/><i class="<?php print $icon; ?>"></i></span></div>
  <?php endif; ?>
  <?php if ($title): ?>
    <h3 class="box-title"><?php print $title; ?></h3>
  <?php endif; ?>
  <?php if ($content): ?>
    <p class="box-content"><?php print $content; ?></p>
  <?php endif; ?>
</div>