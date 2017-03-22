<?php

function dexp_shortcodes_accordions_shortcode_info(&$shortcodes) {
  $shortcodes['accordions'] = array(
      'title' => t('Accordions wrapper'),
      'description' => t('Accordions wrapper shortcode'),
      'process callback' => 'dexp_shortcodes_accordions',
      'tips callback' => 'dexp_shortcodes_accordion_tips',
  );
}

function dexp_shortcodes_accordions($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'class' => '',
      ), $attrs
  );
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_accordions', $attrs);
}

function dexp_shortcodes_accordions_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_accordions'] = array(
      'template' => 'accordions',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_accordions',
      ),
      'variables' => array(
          'class' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_accordions(&$vars) {
  $vars['accordion_wapper_id'] = drupal_html_id("dexp_accordions_wrapper_".$_SERVER['REQUEST_TIME']);
  $vars['content'] = str_replace('ACCORDION_WRAPPER_ID', $vars['accordion_wapper_id'], $vars['content']);
  $vars['theme_hook_suggestions'][] = 'shortcode__accordions';
}

function dexp_shortcodes_accordion_shortcode_info(&$shortcodes) {
  $shortcodes['accordion'] = array(
      'title' => t('Accordion item'),
      'description' => t('Accordion item shortcode'),
      'process callback' => 'dexp_shortcodes_accordion',
  );
}

function dexp_shortcodes_accordion($attrs, $text) {
  shortcode_attrs(array('title'=>'',
      'icon' =>'',
      'expand' => ''
      ), $attrs);
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_accordion', $attrs);
}

function dexp_shortcodes_accordion_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_accordion'] = array(
      'template' => 'accordion',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_accordion',
      ),
      'variables' => array(
          'title' => '',
          'icon' =>'',
          'expand' => '',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_accordion(&$vars) {
  
  $vars['accordion_item_id'] = drupal_html_id("dexp_accordion_item_".$_SERVER['REQUEST_TIME']);
  $vars['item_collapse'] = 'collapsed';
  if ($vars['expand'] == "true") {
    $vars['item_active'] = 'in';
    $vars['item_collapse'] = '';
  } else {
    $vars['item_active'] = '';
  }
  $vars['theme_hook_suggestions'][] = 'shortcode__accordions';
}

function dexp_shortcodes_accordion_tips($format, $long) {
  $output = '[accordions][accordion title="Title1" icon="" expand="true|false"] Your content1 here [/accordion][accordion title="Title2" icon="" expand="true|false"] Your content2 here [/accordion][/accordions]';
  return $output;
}