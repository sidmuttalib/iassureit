<div id="node-<?php print $node->nid; ?>" class="portfolio-details <?php print $classes; ?> clearfix"<?php print $attributes; ?>>
    <?php print render($title_prefix); ?>
    <?php print render($title_suffix); ?>
    <?php
    // We hide the comments and links now so that we can render them later.
    hide($content['comments']);
    hide($content['links']);
    hide($content['field_portfolio_images']);
    $language=$node->language;
    ?>
    <div class="content row"<?php print $content_attributes; ?>>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <?php
            if (isset($node->field_portfolio_media[$language])) {
                print render($content['field_portfolio_media']);
            } else {
                print render($content['field_portfolio_images']);
            }
            ?>
          <div class="like-button">
            <?php print render($content['links']); ?>
          </div>  
        </div>
        <div class="col-lg-6 col-md-6 -col-sm-6 col-xs-12">
            <h3 class="portfolio-detail"><?php print t('Description'); ?></h3>

            <?php print $node->body[$language][0]["value"]; ?>
            <ul class="item-details">
                <li><span><?php print t('Date Published');?>:</span> <?php print date('m/d/Y', $node->created); ?></li>
                <li><span><?php print t('Categories');?>:</span> <?php print render($content['field_portfolio_categories']); ?></li>
                <?php if (isset($node->field_portfolio_client[$language])): ?>
                    <li><span><?php print t('Client');?>:</span> <?php print $node->field_portfolio_client[$language][0]["value"]; ?></li>
                <?php endif; ?>
                <?php if (isset($node->field_portfolio_skills[$language])): ?>
                    <li><span><?php print t('Skills');?>:</span> <?php print $node->field_portfolio_skills[$language][0]["value"]; ?></li>
                <?php endif; ?>
                <?php if (isset($node->field_portfolio_website[$language])): ?>
                    <li><span><?php print t('Website');?>:</span> <a href="#"><?php print $node->field_portfolio_website[$language][0]["value"]; ?></a></li>
                <?php endif; ?>
            </ul>
            <br/>
            <?php if (isset($node->field_portfolio_url[$language])): ?>
                <a class="btn btn-lager" href="<?php print $node->field_portfolio_url[$language][0]["value"]; ?>">LAUNCH PROJECT</a>
            <?php endif; ?>
        </div>
    </div>
    
    <?php print render($content['comments']); ?>
</div>