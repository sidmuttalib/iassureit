<?php
$i = !empty($icon) ? "<i class=\"{$icon}\"></i> " : "";
?>
<?php if ($type == 'link'): ?><a role="button" class="<?php print $classes; ?>" href="<?php print $link; ?>"><?php print $i . $content; ?></a><?php else: ?><button type="button" class="<?php print $classes; ?>"><?php print $i . $content; ?></button><?php endif; ?>