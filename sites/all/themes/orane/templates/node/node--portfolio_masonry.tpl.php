<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
  <?php print render($title_prefix); ?>
  <?php print render($title_suffix); ?>
  <div class="content"<?php print $content_attributes; ?>>
    <?php
// We hide the comments and links now so that we can render them later.
    hide($content['comments']);
    hide($content['links']);
    hide($content['field_portfolio_images']);
    $lightboxrel = 'portfolio_' . $nid;
    $portfolio_images = field_get_items('node', $node, 'field_portfolio_images');
    $first_image = '';
    if ($portfolio_images) {
      foreach ($portfolio_images as $k => $portfolio_image) {
        if ($k == 0) {
          $first_image = file_create_url($portfolio_image['uri']);
        } else {
          $image_path = file_create_url($portfolio_image['uri']);
          print '<a href="' . $image_path . '" rel="lightbox[' . $lightboxrel . ']" style="display:none">&nbsp;</a>';
        }
      }
    }
    ?>
    <div class="portfolio-masonry-image" style="background-image: url('<?php print $first_image;?>');">
        <div class="portfolio-overlay">
            <div class="portfolio-info">
                <div class="portfolio-tools">
                    <a href="<?php print $node_url;?>"><span class="fa fa-link"></span></a> <a href="<?php print $first_image;?>" rel="lightbox[masonry]"><span class="fa fa-search"></span></a>
                </div>
                <h3><a href="<?php print $node_url;?>"><?php print $title;?></a></h3>
                <?php print render($content);?>
            </div>
        </div>
    </div>
  </div>
</div> 