<?php
if (strtolower(trim($type)) == 'icon') {
    $place_holder = '<i class="' . $icon . '"></i>';
}
if (strtolower(trim($type)) == 'img') {
    $place_holder = '<img alt="" src="' . $image . '">';
}
if ($link != "") {
    $place_holder = "<a href=" . $link . ">" . $place_holder . "</a>";
}
?>
<div class="<?php print $classes; ?>"><?php if ($icon): ?><div class="box-icon"><?php print $place_holder; ?></div><?php endif; ?><?php if ($title): ?><h3 class="box-title"><?php print $title; ?></h3><?php endif; ?><?php if ($content): ?><p class="box-content"><?php print $content; ?></p><?php endif; ?></div>