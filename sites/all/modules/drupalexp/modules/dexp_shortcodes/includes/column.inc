<?php

function dexp_shortcodes_column_shortcode_info(&$shortcodes) {
  $shortcodes['column'] = array(
      'title' => t('Column'),
      'description' => t('Column shortcode'),
      'process callback' => 'dexp_shortcodes_column',
      'tips callback' => 'dexp_shortcodes_columns_tips',
  );
}

function dexp_shortcodes_column($attrs, $content = null ) {
    extract(shortcode_attrs(array('cols' => '','begin'=>'','end'=>'','class'=>'',), $attrs));
    if($cols!=''){
    $col_default = intval($cols);
    if ($col_default < 1 && $col_default > 12) {
      $col_default = 12;
    }
    $class_pattern = "col-xs-12 col-sm-SPAN_I col-md-SPAN_I col-lg-SPAN_I ";
    $class_generated = str_replace("SPAN_I", $col_default, $class_pattern);
    $class_generated.=$class;
    }else{
        $class_generated =$class;
    }
    $output  = '';
    if($begin == "1") {
        $output .= '<div class="row">';
    }
    $output .= '<div class="'.$class_generated.'">';
    $output .= $content;
    $output .= '</div>';
    if($end == "1") {
        $output .= '</div>';
    }
    return $output;
}

function dexp_shortcodes_columns_tips ($format, $long) {
  $output = '[column cols="" begin="0-OR-1" end="0-OR-1"]TEXT_HERE[/column][column cols="" begin="0-OR-1" end="0-OR-1"]TEXT_HERE[/column]';
  return $output;
}