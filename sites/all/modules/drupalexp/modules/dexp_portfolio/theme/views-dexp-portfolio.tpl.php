<?php
/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
?>
<?php if (!empty($title)): ?>
    <h3><?php print $title; ?></h3>
<?php endif; ?>
<?php
    $filter_cols = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
    $sort_cols = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
    if($options['dexp_portfolio_filter'] && $options['dexp_portfolio_sort']){
        $filter_cols = "col-lg-10 col-md-10 col-sm-8 col-xs-12";
        $sort_cols = "col-lg-2 col-md-2 col-sm-4 col-xs-12";
    }
?>
 <?php if($options['dexp_portfolio_filter'] || $options['dexp_portfolio_sort']):?>
<div class="row dexp-portfolio-toolbars">
<?php if ($options['dexp_portfolio_filter']): ?>
    <div class="<?php print $filter_cols;?>">
<?php if (isset($categories)): ?>
    <div class="portfolio-filters">
        <ul id="<?php print $filter_id; ?>" class="dexp-portfolio-filter clearfix" data-option-key="filter">
            <li><a class="active" href="#" data-filter="*"><span><?php print t('Show All') ?></span></a></li>
            <?php foreach ($categories as $key => $c): ?>
                <li>
                    <a href="#" class="<?php echo $key; ?>" data-filter="<?php echo $key; ?>"><span><?php echo $c; ?></span></a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php endif; ?>
    </div>
    <?php endif; ?>
    <?php if($options['dexp_portfolio_sort']):?>
    <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
        <div class="portfolio-sort">
    <div class="input-group">
<span class="input-group-addon"><?php print t('Sort by');?></span>
<select class="dexp-portfolio-sort form-control">
        <option value=""><?php print t('Default');?></option>
        <option value="title"><?php print t('Title');?></option>
        <option value="date"><?php print t('Date');?></option>
    </select>
</div>
</div>
    </div>
    <?php endif;?>
</div>
<?php endif;?>    
<?php
$padding = $options['dexp_portfolio_margin'] / 2;
?>
<div id="<?php print $view_id; ?>" data-padding="<?php print $padding;?>" class="custompadding dexp-grid-items row">
    <?php foreach ($rows as $row): ?>
        <?php print $row; ?>
    <?php endforeach; ?>
</div>