<?php

function dexp_shortcodes_button_shortcode_info(&$shortcodes) {
  $shortcodes['button'] = array(
      'title' => t('Button'),
      'description' => t('Create button'),
      'process callback' => 'dexp_shortcodes_button',
      'tips callback' => 'dexp_shortcodes_button_tips',
  );
}

function dexp_shortcodes_button($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'size' => '', //lg,sm,xs
      'type' => 'default', //default, primary, success, info, warning, danger, link
      'class' => '',
      'icon' => '',
      'link' => ''), $attrs);
  $attrs['content'] = $text;
  return trim(theme('dexp_shortcodes_button', $attrs));
}

function dexp_shortcodes_button_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_button'] = array(
      'template' => 'button',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_button',
      ),
      'variables' => array(
          'size' => '',
          'type' => 'default',
          'class' => '',
          'icon' => '',
          'link' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_button(&$vars) {
  $size = $vars['size'];
  $type = $vars['type'];
  $vars['classes_array'][] = 'btn';
  if($size){
    $vars['classes_array'][] = 'btn-'.$size;
  }
  if ($vars['class']) {
    $vars['classes_array'][] = $vars['class'];
  }
  if($type!="" && $type!="link"){
  $vars['classes_array'][] = 'btn-'.$type;
  }
  $vars['theme_hook_suggestions'][] = 'shortcode__button';
}

function dexp_shortcodes_button_tips($format, $long) {
  $output = "[button size='' type='' icon='' link='' class='']Button Name[/button]";
  return $output;
}