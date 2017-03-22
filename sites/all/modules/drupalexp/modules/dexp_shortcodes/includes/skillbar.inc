<?php

function dexp_shortcodes_skillbar_shortcode_info(&$shortcodes) {
  $shortcodes['skillbar'] = array(
      'title' => t('Skill bar'),
      'description' => t('Skill bar shortcode'),
      'process callback' => 'dexp_shortcodes_skillbar',
      'tips callback' => 'dexp_shortcodes_skillbar_tips',
  );
}

function dexp_shortcodes_skillbar($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'percent' => '',
      'class' => '',
   ), $attrs);
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_skillbar',$attrs);
}

function dexp_shortcodes_skillbar_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_skillbar'] = array(
      'template' => 'skillbar',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_skillbar',
      ),
      'variables' => array(
          'percent' => '',
          'class' => '',
          'content' => '',      
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_skillbar(&$vars) {
  $vars['element_id'] = drupal_html_id('skill_bar');
  $vars['theme_hook_suggestions'][] = 'shortcode__skillbar';
}

function dexp_shortcodes_skillbar_tips($format, $long) {
  $output = "[skillbar class='' percent='']Title[/skillbar]";
  return $output;
}