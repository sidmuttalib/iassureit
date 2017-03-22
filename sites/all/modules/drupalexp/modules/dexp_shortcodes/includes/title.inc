<?php

function dexp_shortcodes_title_shortcode_info(&$shortcodes) {
  $shortcodes['title'] = array(
      'title' => t('Title'),
      'description' => t('Title shortcode'),
      'process callback' => 'dexp_shortcodes_title',
      'tips callback' => 'dexp_shortcodes_title_tips',
  );
}

function dexp_shortcodes_title($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'class' => '',
      'under_line' => '',
  ), $attrs);
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_title', $attrs);
}

function dexp_shortcodes_title_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_title'] = array(
      'template' => 'title',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_title',
      ),
      'variables' => array(
          'class' => '',
          'under_line' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_title(&$vars) {
  $vars['theme_hook_suggestions'][] = 'shortcode__title';
}

function dexp_shortcodes_title_tips($format, $long) {
  $output = '[title class =""]TITLE HERE[/title]';
  return $output;
}