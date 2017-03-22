<?php

function dexp_shortcodes_social_shortcode_info(&$shortcodes) {
  $shortcodes['social'] = array(
      'title' => t('Social'),
      'description' => t('Create Social shortcode'),
      'process callback' => 'dexp_shortcodes_social',
      'tips callback' => 'dexp_shortcodes_social_tips',
  );
}

function dexp_shortcodes_social($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'class' => '', // Social name class 
      'icon' => '', // font awesome class 
      'tooltip'=>'',
      'link' => '#'), $attrs);
  $attrs['content'] = $text;
  return trim(theme('dexp_shortcodes_social', $attrs));
}

function dexp_shortcodes_social_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_social'] = array(
      'template' => 'social',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_social',
      ),
      'variables' => array(
          'class' => '',
          'icon' => '',
          'tooltip'=>'',
          'link' => '#',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_social(&$vars) {
  $vars['theme_hook_suggestions'][] = 'shortcode__social';
}

function dexp_shortcodes_social_tips($format, $long) {
  $output = "[social class='' icon='' tooltip='' link='']TEXT_HERE[/social]";
  return $output;
}