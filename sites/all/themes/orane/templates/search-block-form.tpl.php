<span class="fa fa-search search-toggle"></span>
<div class="search-form-block-wrapper">  
    <?php if (empty($variables['form']['#block']->subject)): ?>
        <h2 class="element-invisible"><?php print t('Search form'); ?></h2>
    <?php endif; ?>
    <?php print $search_form; ?>
    <div class="clear"></div>
</div>