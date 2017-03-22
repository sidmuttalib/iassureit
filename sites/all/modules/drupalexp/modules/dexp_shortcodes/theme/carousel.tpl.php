<div class="item <?php if ($sequence == 0) print 'active'; ?>"><?php if (strpos($path, "public://") !== false) {
    $path = file_create_url($uri);
} ?><img src="<?php print $path; ?>"/></div>