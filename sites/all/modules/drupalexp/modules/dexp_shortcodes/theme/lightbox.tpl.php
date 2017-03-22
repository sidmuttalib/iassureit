<?php $lightboxrel=drupal_html_id('lightbox');?>
<div class="hover-box">
    <figure class="<?php if($class) print $class;?>">
        <a rel="lightbox[<?php print $lightboxrel; ?>]" href="<?php if($image) print $image;?>" class="fancybox" data-rel="portfolio">
            <div class="text-overlay"><div class="info"><span><i class="icon-picons-search-2">&nbsp;</i></span></div></div>
            <img alt="" src="<?php if($image) print $image;?>" typeof="foaf:Image">
        </a>
    </figure>
</div>