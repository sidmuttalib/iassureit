<?php

function dexp_shortcodes_carousels_shortcode_info(&$shortcodes) {
  $shortcodes['carousels'] = array(
      'title' => t('Carousels wrapper'),
      'description' => t('Carousels wrapper shortcode'),
      'process callback' => 'dexp_shortcodes_carousels',
      'tips callback' => 'dexp_shortcodes_carousel_tips',
  );
}

function dexp_shortcodes_carousels($attrs, $text) {
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_carousels',$attrs);
}

function dexp_shortcodes_carousels_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_carousels'] = array(
      'template' => 'carousels',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_carousels',
      ),
      'variables' => array(
          'items' => 1,
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_carousels(&$vars) {
  $vars['carousel_id'] = drupal_html_id('dexp_carousels');
  $vars['theme_hook_suggestions'][] = 'shortcode__carousels';
}

function dexp_shortcodes_carousel_shortcode_info(&$shortcodes) {
  $shortcodes['carousel'] = array(
      'title' => t('Carousel Item'),
      'description' => t('Carousel item shortcode'),
      'process callback' => 'dexp_shortcodes_carousel',
  );
}

function dexp_shortcodes_carousel($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'sequence' =>'',
      'path' => '',
  ), $attrs);
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_carousel',$attrs);
}

function dexp_shortcodes_carousel_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_carousel'] = array(
      'template' => 'carousel',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_carousel',
      ),
      'variables' => array(
          'sequence' => '',
          'path' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_carousel(&$vars) {
  $vars['theme_hook_suggestions'][] = 'shortcode__carousel';
}

function dexp_shortcodes_carousel_tips ($format, $long) {
  $output = '[carousels items="TOTAL_ITEM"][carousel path="PATH_TO_IMAGE" sequence=""]CAPTION_HERE[/carousel][carousel path="PATH_TO_IMAGE" sequence=""]CAPTION_HERE[/carousel][carousel path="PATH_TO_IMAGE"]CAPTION_HERE[/carousel][/carousels]';
  return $output; 
}