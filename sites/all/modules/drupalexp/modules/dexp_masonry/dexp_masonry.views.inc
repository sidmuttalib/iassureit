<?php

/**
 * Implements hook_views_plugins
 */
function dexp_masonry_views_plugins() {
  return array(
      'style' => array(
          'dexp_masonry' => array(
              'title' => t('Dexp Masonry Grid'),
              'help' => t('Display content in a masonry grid.'),
              'handler' => 'dexp_masonry_plugin_style_masonry',
              'uses options' => TRUE,
              'uses row plugin' => TRUE,
              'uses row class' => TRUE,
              'type' => 'normal',
              'theme' => 'views_dexp_masonry',
              'theme path' => drupal_get_path('module', 'dexp_masonry') . '/theme',
              'theme file' => 'dexp_masonry.theme.inc',
          ),
      ),
  );
}