<div<?php print $attributes;?>>
<div class="layerslider-banner" style="opacity:0; max-height:<?php print $settings->startheight;?>px; height:<?php print $settings->startheight;?>px;">
<ul>
<?php print $content;?>
</ul>
<?php if($settings->timer):?>
<div class="tp-bannertimer tp-<?php print $settings->timer;?>"></div>
<?php endif;?>
</div>
</div>
<?php
$slidesetting = new stdClass();
$slidesetting->delay = $settings->delay;
$slidesetting->startheight = $settings->startheight;
$slidesetting->startwidth = $settings->startwidth;
$slidesetting->hideThumbs = $settings->hideThumbs;
$slidesetting->thumbWidth = $settings->thumbWidth;
$slidesetting->thumbHeight = $settings->thumbHeight;
$slidesetting->thumbAmount = $settings->thumbAmount;
$slidesetting->navigationType = $settings->navigationType;
$slidesetting->navigationArrows = $settings->navigationArrows;
$slidesetting->navigationStyle = $settings->navigationStyle;
$slidesetting->navigationHAlign = $settings->navigationHAlign;
$slidesetting->navigationVAlign = $settings->navigationVAlign;
$slidesetting->navigationHOffset = 0;
$slidesetting->navigationVOffset = 20;
$slidesetting->soloArrowLeftHalign = "left";
$slidesetting->soloArrowLeftValign = "center";
$slidesetting->soloArrowLeftHOffset = 0;
$slidesetting->soloArrowLeftVOffset = 0;
$slidesetting->soloArrowRightHalign = "right";
$slidesetting->soloArrowRightValign = "center";
$slidesetting->soloArrowRightHOffset = 0;
$slidesetting->soloArrowRightVOffset = 0;
$slidesetting->touchenabled = "on";
$slidesetting->onHoverStop = $settings->onHoverStop;
$slidesetting->stopAtSlide = -1;
$slidesetting->stopAfterLoops = -1;
$slidesetting->hideCaptionAtLimit = 0;
$slidesetting->hideAllCaptionAtLilmit = 0;
$slidesetting->hideSliderAtLimit = 0;
$slidesetting->shadow = $settings->shadow;
$slidesetting->fullWidth = $settings->fullWidth;
$slidesetting->fullScreen = $settings->fullScreen;
$slidesetting->fullScreenOffsetContainer = $settings->fullScreenOffsetContainer;
$slidesetting->lazyLoad = 'on';
$slidesetting->soloArrowLeftHOffset =20;
$slidesetting->soloArrowRightHOffset =20;
$slidesetting->timer =$settings->timer;
$slidesetting->shuffle = 'off';
$slidesetting->dottedOverlay = $settings->dottedOverlay;
$slidesetting = json_encode($slidesetting);
$js = "jQuery(document).ready(function($){if($.fn.cssOriginal!=undefined)$.fn.css = $.fn.cssOriginal;$('#{$id} .layerslider-banner').css({opacity:1}).revolution({$slidesetting});})";
?>
<script type="text/javascript">
<!--//--><![CDATA[//><!--
<?php print $js; ?>
//--><!]]>
</script>
