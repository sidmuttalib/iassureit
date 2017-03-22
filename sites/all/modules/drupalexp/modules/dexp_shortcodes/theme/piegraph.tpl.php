<div class="progress-overall object-square-left" aria-valuenow="<?php print $percent;?>">
	<div class="progress-overall-right">
		<div class="progress-rotate"></div>
	</div>
	<div class="progress-overall-left">
		<div class="progress-rotate"></div>
	</div>
	<div class="progress-overall-content">
		<div class="progress-overall-inner">
			<span class="percent">0</span><span><?php print $title;?></span>
		</div>
	</div>
</div>
<div class="progress-overall-content-right">
<?php print $content;?>
</div>
<script type="text/javascript">
  jQuery(document).ready(function($){
    $('.progress-overall', $container).each(function(){
			var percent = $(this).attr('aria-valuenow');
			
			$('.percent', $(this)).html(percent);
			
			if(percent > 50) {
				$('.progress-overall-right .progress-rotate', $(this)).css({
					'-webkit-transform' : 'rotate(180deg)',
					'-ms-transform' : 'rotate(180deg)',
					'-moz-transform' : 'rotate(180deg)',
				});
				$('.progress-overall-left .progress-rotate', $(this)).css({
					'-webkit-transform' : 'rotate('+ ((percent-50)*360/100) +'deg)',
					'-ms-transform' : 'rotate('+ ((percent-50)*360/100) +'deg)',
					'-moz-transform' : 'rotate('+ ((percent-50)*360/100) +'deg)',
				});
			} else {
				$('.progress-overall-right .progress-rotate', $(this)).css({
					'-webkit-transform' : 'rotate('+ (percent*360/100) +'deg)',
					'-ms-transform' : 'rotate('+ (percent*360/100) +'deg)',
					'-moz-transform' : 'rotate('+ (percent*360/100) +'deg)',
				});
			}
		});
  });
</script>
