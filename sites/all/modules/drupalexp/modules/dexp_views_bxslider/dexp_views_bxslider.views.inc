<?php

/**
 * Implements hook_views_plugins()
 */
function dexp_views_bxslider_views_plugins() {
  return array(
      'style' => array(
          'dexp_bxslider' => array(
              'title' => t('Dexp bxSlider'),
              'help' => t('Display the results as a bxslider'),
              'handler' => 'dexp_views_bxslider_plugin_style_bxslide',
              'uses options' => TRUE,
              'uses row plugin' => TRUE,
              'uses row class' => TRUE,
              'type' => 'normal',
              'theme' => 'views_bxslider',
              'theme path' => drupal_get_path('module', 'dexp_views_bxslider') . '/theme',
              'theme file' => 'dexp_views_bxslider.theme.inc',
          ),
      ),
  );
}