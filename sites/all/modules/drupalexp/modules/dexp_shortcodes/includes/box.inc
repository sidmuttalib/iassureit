<?php
function dexp_shortcodes_box_shortcode_info(&$shortcodes) {
  $shortcodes['box'] = array(
      'title' => t('Boxes'),
      'description' => t('Create a block content with icon'),
      'process callback' => 'dexp_shortcodes_box',
      'tips callback' => 'dexp_shortcodes_box_tips',
  );
}

function dexp_shortcodes_box($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'title' => '',
      'border' => 'none',//none,square,circle
      'background' => 'no',
      'align' => 'center',//left,center,right
      'type' => 'icon',
      'icon' => '',
      'image'=>'',
      'class'=>'',
      'link'=>''), $attrs
  );
  $attrs['content'] = $text;
  return theme('dexp_shortcodes_box', $attrs);
}

function dexp_shortcodes_box_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_box'] = array(
      'template' => 'box',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_box',
      ),
      'variables' => array(
          'title' => '',
          'border' => 'none',
          'background' =>'no',
          'align' => 'center',
          'type' => 'icon',
          'icon' =>'',
          'image'=>'',
          'link'=>'',
          'class'=>'',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_box(&$vars) {
  $border = $vars['border'];
  $align = $vars['align'];
  $class=$vars['class'];
  if($vars['background'] == 'yes'){
    $vars['classes_array'][] = 'box-background';
  }
  $vars['classes_array'][] = $class;
  $vars['classes_array'][] = 'box-'.$border;
  $vars['classes_array'][] = 'box-'.$align;
  $vars['theme_hook_suggestions'][] = 'shortcode__box__' . $align;
  $vars['theme_hook_suggestions'][] = 'shortcode__box__' . $align.'__'.$border;
}

function dexp_shortcodes_box_tips($long, $format) {
  $output = "[box class='' title='' border='circle|square|diamond|hexagon' background='yes|no', align='left|center|right|top|custom' icon='fa fa-ICON' link='']Content here[/box]";
  return $output;
}