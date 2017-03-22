<?php

function dexp_shortcodes_tabs_shortcode_info(&$shortcodes) {
  $shortcodes['tabs'] = array(
      'title' => t('Tabs'),
      'description' => t('Tabs wrapper'),
      'process callback' => 'dexp_shortcodes_tabs',
      'tips callback' => 'dexp_shortcodes_tab_tips',
  );
}

/**
 * Shortcode tab group definition
 */
function dexp_shortcodes_tabs( $attrs, $content = null ) {
   extract(shortcode_attrs(array('class' => '',), $attrs));
   global $shortcode_tabs_stack;
   $tab_wrapper_id = "dexp_tab_wrapper_";
   $tab_wrapper_id .= rand();
//   if ($class == "" || ($class != "noboder" && $class != "vertical")) {
//      $class = "default";
//   }
   $output = '<div id="'.$tab_wrapper_id.'" class="dexp_tab_wrapper '.$class.' clearfix"> <ul class="nav nav-tabs">';
   $tabCount = 1;
   $xclass="";
   foreach ($shortcode_tabs_stack as $tab) {   
      if($tabCount == 1) { 
        $output .= '<li class="active first"><a href="#'.$tab["id"].'" data-toggle="tab"><i class="tab-icon fa '.$tab["icon"].'"></i>'.$tab["title"].'</a></li>';
      } else {
	  if($tabCount==Count($shortcode_tabs_stack)){$xclass="last";}
        $output .= '<li class="'.$xclass.'"><a href="#'.$tab["id"].'" data-toggle="tab"><i class="tab-icon fa '.$tab["icon"].'"></i>'.$tab["title"].'</a></li>';  
      }
      $tabCount = $tabCount + 1;
   }      
   $output .= '</ul>';
   $output .='<div class="tab-content">';
   
   $tabCount = 1;
   foreach ($shortcode_tabs_stack as $tab) {
      if($tabCount == 1) {  
        $output .= '<div id="'.$tab["id"].'" class="active tab-pane">';
      } else {
        $output .= '<div id="'.$tab["id"].'" class="tab-pane"><p>';  
      }
      $tabCount = $tabCount + 1;
      $output .= $tab["contents"]["#markup"].'</p></div>';
   }
   $output .='</div></div>';
   $shortcode_tabs_stack = null;
   return $output;  
}

function dexp_shortcodes_tab_shortcode_info(&$shortcodes) {
  $shortcodes['tab'] = array(
      'title' => t('Tab'),
      'description' => t('Tab item'),
      'process callback' => 'dexp_shortcodes_tab',
  );
}

/**
 * Shortcode tab item definition
 */
function dexp_shortcodes_tab( $attrs, $content = null ) {
  extract(shortcode_attrs(array('title' => '', 'icon' => '',), $attrs));
  $id_tab_item = "dexp_tab_item_";
  $id_tab_item .= rand();
  global $shortcode_tabs_stack;
  if (!is_array($shortcode_tabs_stack)) $shortcode_tabs_stack = array();
  $tabPane = array(
    'title' => $title,
    'icon'  => $icon,
    'id'    => $id_tab_item,
    'contents' => array(
      '#markup' => $content,
    ),
    'weight' => count($shortcode_tabs_stack),
  );
  $shortcode_tabs_stack[] = $tabPane;
}

function dexp_shortcodes_tab_tips($format, $long) {
  $output = '[tabs class="horizontal OR vertical"][tab title="Tab Title 1" icon="Icon name 1"] Your content1 here [/tab][tab title="Tab Title 2" icon="icon name 2"] Your content2 here [/tab][/tabs]';
  return $output;
}