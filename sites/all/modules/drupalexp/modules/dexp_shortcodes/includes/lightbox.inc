<?php

function dexp_shortcodes_lightbox_shortcode_info(&$shortcodes) {
  $shortcodes['lightbox'] = array(
      'title' => t('Lightbox'),
      'description' => t('Create Lightbox shortcode'),
      'process callback' => 'dexp_shortcodes_lightbox',
      'tips callback' => 'dexp_shortcodes_lightbox_tips',
  );
}

function dexp_shortcodes_lightbox($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'class' => '', // Social name class 
      'image' => '', // font awesome class 
      ), $attrs);
  $attrs['content'] = $text;
  return trim(theme('dexp_shortcodes_lightbox', $attrs));
}

function dexp_shortcodes_lightbox_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_lightbox'] = array(
      'template' => 'lightbox',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_lightbox',
      ),
      'variables' => array(
          'class' => '',
          'image' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_lightbox(&$vars) {
  $vars['theme_hook_suggestions'][] = 'shortcode__lightbox';
}

function dexp_shortcodes_lightbox_tips($format, $long) {
  $output = "[lightbox class='' image=''][/lightbox]";
  return $output;
}