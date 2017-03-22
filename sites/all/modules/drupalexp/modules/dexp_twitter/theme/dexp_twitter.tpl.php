<?php if (empty($tweets)): ?>
    <?php print t('Sorry, twitter is currently unavailable.'); ?>
<?php else: ?>
    <div class="dexp-twitter" id="<?php print $block_id; ?>">
        <?php foreach ($tweets as $tweet): ?>
            <div class="dexp-tweet clearfix">
                <?php if ($settings['dexp_twitter_block_avatar'] == 'icon'): ?>
                    <i class="fa fa-twitter left"></i>
                <?php elseif ($settings['dexp_twitter_block_avatar'] == 'profile'): ?>
                    <span class="sp-avatar left"><img src="<?php print $tweet->avatar; ?>" alt=""></span>
                <?php endif; ?>
                <div class="content">		
                    <div class="sp-text">
                        <?php print $tweet->text; ?>
                    </div>
                    <div class="author">
                        <span class="sp-user">
                            <a target="_blank" href="http://www.twitter.com/<?php print $settings['name']; ?>" style="text-decoration: none;"><?php print $tweet->name; ?></a>
                        </span> 
                        <span class="sp-created" style="font-size: smaller;">(<?php print $tweet->created; ?>)</span>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>