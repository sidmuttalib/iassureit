<?php

/**
 * @file
 * Defines portfolio views styles
 */

/**
 * Implements hook_views_plugins
 */
function dexp_portfolio_views_plugins() {
  return array(
      'style' => array(
          'dexp_portfolio' => array(
              'title' => t('Dexp Portfolio'),
              'help' => t('Display content in a portfolio grid.'),
              'handler' => 'dexp_portfolio_plugin_style_portfolio',
              'uses options' => TRUE,
              'uses row plugin' => TRUE,
              'uses row class' => TRUE,
              'type' => 'normal',
              'theme' => 'views_dexp_portfolio',
              'theme path' => drupal_get_path('module', 'dexp_portfolio') . '/theme',
              'theme file' => 'dexp_portfolio.theme.inc',
          ),
      ),
  );
}