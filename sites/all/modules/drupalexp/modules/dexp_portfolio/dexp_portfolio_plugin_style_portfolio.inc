<?php

/**
 * @file
 * Defines the style plugin for the Dexp Portfolio
 */
class dexp_portfolio_plugin_style_portfolio extends views_plugin_style {

  function option_definition() {
    $options = parent::option_definition();
    $options['dexp_portfolio_filter'] = array('default' => 0);
    $options['dexp_portfolio_filter_vocabulary'] = array('default' => 0);
    $options['dexp_portfolio_sort'] = array('default' => 0);
    $options['dexp_portfolio_col_lg'] = array('default' => 3);
    $options['dexp_portfolio_col_md'] = array('default' => 3);
    $options['dexp_portfolio_col_sm'] = array('default' => 2);
    $options['dexp_portfolio_col_xs'] = array('default' => 1);
    $options['dexp_portfolio_margin'] = array('default' => 30);
    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    
    $form['dexp_portfolio_col_lg'] = array(
        '#type' => 'select',
        '#title' => t('Large desktop columns'),
        '#options' => array(1=>1,2=>2,3=>3,4=>4,6=>6,12=>12),
        '#default_value' => $this->options['dexp_portfolio_col_lg']
    );
    $form['dexp_portfolio_col_md'] = array(
        '#type' => 'select',
        '#title' => t('Desktop columns'),
        '#options' => array(1=>1,2=>2,3=>3,4=>4,6=>6,12=>12),
        '#default_value' => $this->options['dexp_portfolio_col_md']
    );
    $form['dexp_portfolio_col_sm'] = array(
        '#type' => 'select',
        '#title' => t('Tablet columns'),
        '#options' => array(1=>1,2=>2,3=>3,4=>4,6=>6,12=>12),
        '#default_value' => $this->options['dexp_portfolio_col_sm']
    );
    $form['dexp_portfolio_col_xs'] = array(
        '#type' => 'select',
        '#title' => t('Phone columns'),
        '#options' => array(1=>1,2=>2,3=>3,4=>4,6=>6,12=>12),
        '#default_value' => $this->options['dexp_portfolio_col_xs']
    );
    $form['dexp_portfolio_margin'] = array(
        '#type' => 'textfield',
        '#title' => t('Margin'),
        '#default_value' => $this->options['dexp_portfolio_margin']
    );
    $form['dexp_portfolio_filter'] = array(
        '#type' => 'checkbox',
        '#title' => t('Use Filter'),
        '#description' => t('Determines whether the filter is used on the portfolio.'),
        '#default_value' => $this->options['dexp_portfolio_filter']
    );
    $form['dexp_portfolio_sort'] = array(
        '#type' => 'checkbox',
        '#title' => t('Enable Sort'),
        '#description' => t('Sort item by Date and Title.'),
        '#default_value' => $this->options['dexp_portfolio_sort']
    );
    $opts = array('- Select -');
    $tmp = array();
    foreach (taxonomy_vocabulary_get_names() as $vocab) {
      $tmp[$vocab->vid] = $vocab->name;
    }
    $opts += $tmp;
    $form['dexp_portfolio_filter_vocabulary'] = array(
        '#type' => 'select',
        '#title' => t('Filter Vocabulary'),
        '#options' => $opts,
        '#description' => t('Which taxonomy vocabulary do you want to use for the filter'),
        '#default_value' => $this->options['dexp_portfolio_filter_vocabulary'],
    );
  }

}