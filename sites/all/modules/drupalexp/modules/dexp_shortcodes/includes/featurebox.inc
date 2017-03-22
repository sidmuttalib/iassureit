<?php

function dexp_shortcodes_featurebox_shortcode_info(&$shortcodes) {
  $shortcodes['featurebox'] = array(
      'title' => t('Feature box'),
      'description' => t('Feature box shortcode for service'),
      'process callback' => 'dexp_shortcodes_featurebox',
      'tips callback' => 'dexp_shortcodes_featurebox_tips',
  );
}

function dexp_shortcodes_featurebox($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'title' => ''), $attrs);
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_featurebox', $attrs);
}

function dexp_shortcodes_featurebox_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_featurebox'] = array(
      'template' => 'featurebox',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_featurebox',
      ),
      'variables' => array(
          'title' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_featurebox(&$vars) {
  $vars['theme_hook_suggestions'][] = 'shortcode__featurebox';
}

function dexp_shortcodes_featurebox_tips($format, $long) {
  $output = "[featurebox title='']Content[/featurebox]";
  return $output;
}