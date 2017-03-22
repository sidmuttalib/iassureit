<?php if(count($items) == 1):?>
  
    <?php foreach ($items as $delta => $item): ?>

        <div class="field-item <?php print $delta % 2 ? 'odd' : 'even'; ?>"<?php print $item_attributes[$delta]; ?>><?php print render($item); ?>
        </div>
    
    <?php endforeach; ?>
  
<?php else: ?>
   
  <?php if(count($items) > 1):?>
    <?php $carousel_id = drupal_html_id('dexp_carousel');?>
    <div id="<?php print $carousel_id;?>" class="carousel slide dexp_carousel <?php print $classes; ?>"<?php print $attributes; ?> data-ride="carousel">
    <!-- Wrapper for slides -->
    <div class="carousel-inner">
      <?php foreach ($items as $delta => $item): ?>
      <div class="item field-item <?php print $delta == 0?'active':'';?>"<?php print $item_attributes[$delta]; ?>><?php print render($item); ?></div>
      <?php endforeach; ?>
    </div>

    <!-- Controls -->
    <a class="left carousel-control" href="#<?php print $carousel_id;?>" data-slide="prev">
      <span class="fa fa-angle-left"></span>
    </a>
    <a class="right carousel-control" href="#<?php print $carousel_id;?>" data-slide="next">
      <span class="fa fa-angle-right"></span>
    </a>
    </div>
  <?php else: ?>  
    <?php foreach ($items as $delta => $item): ?>
      <div class="item field-item <?php print $delta == 0?'active':'';?>"<?php print $item_attributes[$delta]; ?>><?php print render($item); ?></div>
      <?php endforeach; ?>
  <?php endif;?>
<?php endif; ?>

