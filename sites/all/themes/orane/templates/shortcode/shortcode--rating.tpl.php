<div id="<?php print $rating_id; ?>" class="item testimonial <?php if ($class) print $class; ?>">
    <div class="carousel-inner">
        <p class="testimonial-content"><?php print $content; ?></p>
        <div class="testimonial-client">
            <div class="pull-left">
                <img alt="" src="<?php if ($image) print $image; ?>" />
                    <div class="testimonial-name"><?php if ($name) print $name; ?></div><div class="testimonial-position"><?php if ($position) print $position; ?></div>
            </div>
            <div class="pull-right">
                <div class="testimonial-site"><?php if ($site) print $site; ?></div>
                <div class="testimonial-rate">
                    <?php if ($stars): ?>
                        <div class="rating text-right">
                            <?php for ($i = 0; $i < $stars; $i++): ?><i class="fa fa-star">&nbsp;</i><?php endfor; ?><?php for ($i = 0; $i < 5 - $stars; $i++): ?><i class="fa fa-star-o">&nbsp;</i><?php endfor; ?></div><!-- rating -->
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>