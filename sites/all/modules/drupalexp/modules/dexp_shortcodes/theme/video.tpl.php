<div id="<?php print $html_id; ?>" class="dexp_shortcode_video <?php if($class){print $class;}?>">
  <iframe src="<?php print $url; ?>" frameborder="0" width="<?php print $width;?>" height="<?php print $height;?>" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
</div>
<script type="text/javascript">
  jQuery(document).ready(function ($) {
    var videoRatio = <?php print $ratio; ?>, $video = $('#<?php print $html_id; ?>');
    $video.find('iframe').width($video.width()).height($video.width() / videoRatio);
    $(window).bind('resize', function () {
      var videoRatio = <?php print $ratio; ?>, $video = $('#<?php print $html_id; ?>');
      $video.find('iframe').width($video.width()).height($video.width() / videoRatio);
    });
  });
</script>