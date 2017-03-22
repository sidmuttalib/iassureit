<?php

function dexp_views_bxslider_preprocess_views_bxslider(&$vars) {
  template_preprocess_views_view_unformatted($vars);
  $options = $vars['options'];
  $view = $vars['view'];

  $view_id = drupal_html_id($view->name . '-' . $view->current_display);
  $vars['view_id'] = $view_id;
  $vars['sliderows'] = $options['rows'];
  $js_settings = array(
      'dexpbxsliders' => array(
          $view_id => array(
              'mode' => $options['mode'],
              'speed' => $options['speed'],
              'auto' => ($options['auto']) ? true : false,
              'pause' => $options['pause'],
              'infiniteLoop' => ($options['infiniteloop']) ? true : false,
              'slideMargin' => ($options['slidemargin']) ? (int) $options['slidemargin'] : 0,
              'startSlide' => $options['startslide'],
              'randomStart' => ($options['randomstart']) ? true : false,
              'pager' => ($options['pager']) ? true : false,
              'controls' => ($options['controls']) ? true : false,
              'minSlides' => $options['minslides'],
              'maxSlides' => $options['maxslides'],
              'moveSlides' => $options['moveslides'],
              'slideWidth' => $options['slidewidth'],
              'prevText' => $options['prevtext'],
              'nextText' => $options['nexttext'],
              'touchEnabled' => ($options['touchEnabled'])?true:false,
          ),
      ),
  );
  $library = libraries_get_libraries();
  if (isset($library['bxslider'])) {
		$path = $library['bxslider'];
		drupal_add_css($path . '/jquery.bxslider.css');
		drupal_add_js($path . '/jquery.bxslider.min.js');
    $module_path = drupal_get_path('module', 'dexp_views_bxslider');
    drupal_add_js($js_settings, 'setting');
    drupal_add_js($module_path . '/js/dexp_bxslider.js');
    drupal_add_css($module_path . '/css/dexp_bxslider.css');
	}
}