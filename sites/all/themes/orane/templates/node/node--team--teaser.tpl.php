<div id="node-<?php print $node->nid; ?>" class="team <?php print $classes; ?> clearfix"<?php print $attributes; ?>>
    <div class="content"<?php print $content_attributes; ?>>
        <?php print render($title_prefix); ?>
        <?php print render($title_suffix); ?>
        <?php
// We hide the comments and links now so that we can render them later.
        hide($content['comments']);
        hide($content['links']);
        ?>
        <div class="member">
            <?php print render($content['field_team_image']); ?>
            <div class="member-intro">
                <div class="member-name"><?php print $title; ?></div>
                <div class="member-position"><?php print render($content['field_team_position']); ?></div>
                <div class="member-social-links">
                    <?php print render($content['field_team_social']); ?>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</div>