<div class="testimonial-item">
    <img class="dg-img shadow-1" src="<?php print $image; ?>" alt="image01">
    <div class="qt"><span class="name"><?php print $name; ?></span>
        <p class="item-content"><?php print $content; ?></p>		
        <?php if($position!=''):?><p class="item-position"><?php print $position; ?></p><?php endif;?>
		<?php if($site!=''):?><p class="item-site"><?php print $site; ?></p><?php endif;?>		
    </div>
</div>