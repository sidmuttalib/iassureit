<?php 
  if ($view_name != '') {
    print views_embed_view($view_name,$block_id); 
  } else {
    if ($module_name != '') {
      $block = block_load($module_name, $block_id);
      $output = drupal_render(_block_get_renderable_array(_block_render_blocks(array($block))));
      print $output;
    }
  }
?>