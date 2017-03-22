<?php

/**
 * Preprocess function to build the dexp views masonry
 * template_preprocess_views_dexp_masonry
 */
function template_preprocess_views_dexp_masonry(&$vars) {
  $view = $vars['view'];
  $options = $view->style_plugin->options;
  $vars['options'] = $options;
  $vars['view_id'] = drupal_html_id($view->name . '-' . $view->current_display);
  $vars['filter_id'] = null;
  if ($options['grid_filter']) {
    $vars['filter_id'] = drupal_html_id('dexp-masonry-filter');
    $vocab = $options['grid_filter_vocabulary'];
    $categories = array();
    $taxonomies = taxonomy_get_tree($vocab);
    foreach ($taxonomies as $tax) {
      if ($tax->parents[0] == 0) {
        $key = drupal_html_class($tax->name);
        $categories[$key] = $tax->name;
      }
    }
    $vars['categories'] = $categories;
  }
  //drupal_add_js(array('dexp_masonry'=>array('b'=>'c')), 'setting');
  //return;
  $js = array(
      'dexp_masonry' => array(
          $vars['view_id'] => array(
              'grid' => null,
              'filter_id' => $vars['filter_id'],
              'grid_cols_lg' => $options['grid_cols_lg'],
              'grid_cols_md' => $options['grid_cols_md'],
              'grid_cols_sm' => $options['grid_cols_sm'],
              'grid_cols_xs' => $options['grid_cols_xs'],
              'grid_margin' => (int) $options['grid_margin'],
              'grid_ratio' => (float) $options['grid_ratio']
          ),
      ),
  );
  drupal_add_js($js, 'setting');
  $library = libraries_get_libraries();
  if (isset($library['shuffle'])) {
    $path = $library['shuffle'];
    drupal_add_js($path . '/jquery.shuffle.min.js');
  }
  drupal_add_js(drupal_get_path('module', 'dexp_masonry') . '/js/dexp-masonry.js');
  if (user_access('administer dexpmasonry')) {
    drupal_add_library('system', 'ui.resizable');
    drupal_add_js(drupal_get_path('module', 'dexp_masonry') . '/js/dexp-masonry.admin.js');
  }
  drupal_add_css(drupal_get_path('module', 'dexp_masonry') . '/css/dexp-masonry.css');
}