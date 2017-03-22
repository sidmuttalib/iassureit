<?php

/**
 * Implements hook_views_plugins
 */
function dexp_grid_views_plugins() {
  return array(
      'style' => array(
          'dexp_grid2' => array(
              'title' => t('Dexp Responsive Grid'),
              'help' => t('Display content in a responsive grid.'),
              'handler' => 'dexp_grid_plugin_style_grid',
              //'path' => drupal_get_path('module', 'dexp_portfolio') . '/views',
              'uses options' => TRUE,
              'uses row plugin' => TRUE,
              'uses row class' => TRUE,
              'type' => 'normal',
              'theme' => 'views_dexp_grid',
              //'theme path' => drupal_get_path('module', 'dexp_portfolio') . '/theme',
              //'theme file' => 'dexp_grid.theme.inc',
          ),
      ),
  );
}