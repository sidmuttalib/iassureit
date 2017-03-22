<?php

function dexp_shortcodes_flipbox_shortcode_info(&$shortcodes) {
  $shortcodes['flipbox'] = array(
      'title' => t('Flip box'),
      'description' => t('Flip box shortcode for service'),
      'process callback' => 'dexp_shortcodes_flipbox',
      'tips callback' => 'dexp_shortcodes_flipbox_tips',
  );
}

function dexp_shortcodes_flipbox($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'type' => '',
      'icon' => '', 
      'image' => '',
      'title' => ''), $attrs);
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_flipbox', $attrs);
}

function dexp_shortcodes_flipbox_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_flipbox'] = array(
      'template' => 'flipbox',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_flipbox',
      ),
      'variables' => array(
          'type' => '',
          'icon' => '',
          'image' => '',
          'title' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_flipbox(&$vars) {
  $vars['theme_hook_suggestions'][] = 'shortcode__flipbox';
}

function dexp_shortcodes_flipbox_tips($format, $long) {
  $output = "[flipbox type='icon OR img' icon='FONT AWESOME CLASS or SS-GIZMO' image='' title='']Content[/flipbox]";
  return $output;
}