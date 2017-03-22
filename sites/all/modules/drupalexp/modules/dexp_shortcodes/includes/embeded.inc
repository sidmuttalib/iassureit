<?php

function dexp_shortcodes_embeded_shortcode_info(&$shortcodes) {
  $shortcodes['embeded'] = array(
      'title' => t('Embeded content'),
      'description' => t('Embeded content view block '),
      'process callback' => 'dexp_shortcodes_embeded',
      'tips callback' => 'dexp_shortcodes_embeded_tips',
      'cache' => DRUPAL_NO_CACHE,
  );
}

function dexp_shortcodes_embeded($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'view_name' => '',
      'module_name' =>'',
      'block_id' => '', 
  ), $attrs);
  return theme('dexp_shortcodes_embeded', $attrs);
}

function dexp_shortcodes_embeded_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_embeded'] = array(
      'template' => 'embeded',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_embeded',
      ),
      'variables' => array(
          'view_name' => '',
          'module_name' =>'',
          'block_id' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_embeded(&$vars) {
  $vars['theme_hook_suggestions'][] = 'shortcode__embeded';
}

function dexp_shortcodes_embeded_tips($long, $format) {
  $output = "[embeded view_name='' module_name ='' block_id =''][/embeded]";
  return $output;
}