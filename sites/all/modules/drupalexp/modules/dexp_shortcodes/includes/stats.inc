<?php

function dexp_shortcodes_stats_shortcode_info(&$shortcodes) {
  $shortcodes['stats'] = array(
      'title' => t('Stats'),
      'description' => t('Js Stats shortcode'),
      'process callback' => 'dexp_shortcodes_stats',
      'tips callback' => 'dexp_shortcodes_stats_tips',
  );
}

function dexp_shortcodes_stats($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'class' => '',
      'icon' => '',
      'timer' => '',
      'number' => ''), $attrs);
  $attrs['content'] = $text;
  return trim(theme('dexp_shortcodes_stats', $attrs));
}

function dexp_shortcodes_stats_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_stats'] = array(
      'template' => 'stats',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_stats',
      ),
      'variables' => array(
          'class' => '',
          'icon' => '',
          'timer' => '',
          'number' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_stats(&$vars) {
  $vars['stats_id'] = drupal_html_id("dexp_stats");
  $vars['theme_hook_suggestions'][] = 'shortcode__stats';
}

function dexp_shortcodes_stats_tips($format,$long) {
  $output = "[stats number='' icon='' class='']Title[/stats]";
  return $output;
}