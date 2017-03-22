<div id="dg-container" class="dg-container">
    <div class="container">
        <div id="<?php print $testimonial_wapper_id; ?>" class="dg-wrapper <?php print $class; ?>">
            <?php print $content; ?>
        </div>
        <nav>	
            <span class="dg-prev">&lt;</span>
            <span class="dg-next">&gt;</span>
        </nav>
    </div>
</div>
<?php 
  global $base_url;
  $module_path = drupal_get_path('module', 'dexp_shortcodes'); 
?>
<script src="<?php print $base_url.'/'.$module_path.'/asset/js/jquery.3dgallery.js';?>"></script>
<script src="<?php print $base_url.'/'.$module_path.'/asset/js/modernizr-latest.js';?>"></script>
<!-- End Wrapper for slides --><!-- Carousel indicators -->
<script type="text/javascript">
    jQuery('#dg-container').gallery({
        current: 0,
        // index of current item
        autoplay: true,
        // slideshow on / off
        interval: <?php print $interval;?>
                // time between transitions
    });
</script>