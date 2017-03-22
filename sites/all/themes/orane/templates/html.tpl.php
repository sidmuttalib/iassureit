<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
        <?php print $head; ?>
        <title><?php print $head_title; ?></title>
        <?php print $styles; ?>
        <?php print $scripts; ?>
    </head>
    <body class="<?php print $classes; ?>" <?php print $attributes; ?>>
        <div id="skip-link">
            <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
        </div>
        <?php print $page_top; ?>
        <?php print $page; ?>
        <?php print $page_bottom; ?>
        <div id="page-tools">
            <span class="fa fa-bars open-menu hidden-lg hidden-md"></span>&nbsp;<span class="fa fa-angle-double-up goto-top"></span>
        </div>
    </body>
</html>