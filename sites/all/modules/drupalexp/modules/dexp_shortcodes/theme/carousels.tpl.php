<div id="<?php print $carousel_id; ?>" class="carousel slide dexp_carousel" data-ride="carousel">
    <!-- Wrapper for slides -->
    <?php if ($items > 1) : ?>
        <!-- Carousel indicators -->
        <ol class="carousel-indicators">
            <?php for ($i = 0; $i < $items; $i++): ?>
                <li data-target="#<?php print $carousel_id; ?>" data-slide-to="<?php print $i; ?>" <?php print $i == 0 ? 'class=active' : ''; ?>></li>
            <?php endfor; ?>
        </ol>   
    <?php endif; ?>
    <div class="carousel-inner">
        <?php print $content; ?>
    </div>
    <!-- Controls -->
    <a class="left carousel-control" href="#<?php print $carousel_id; ?>" data-slide="prev"><span class="fa fa-angle-left"></span></a>
    <a class="right carousel-control" href="#<?php print $carousel_id; ?>" data-slide="next"><span class="fa fa-angle-right"></span></a>
</div>

