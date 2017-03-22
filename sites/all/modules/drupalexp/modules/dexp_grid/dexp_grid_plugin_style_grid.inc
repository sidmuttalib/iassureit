<?php

/**
 * @file
 * Defines the style plugin for the Dexp Portfolio
 */
class dexp_grid_plugin_style_grid extends views_plugin_style {

  function option_definition() {
    $options = parent::option_definition();
    $options['grid_bootstrap'] = array('default' => 0);
    $options['grid_cols_lg'] = array('default' => 3);
    $options['grid_cols_md'] = array('default' => 3);
    $options['grid_cols_sm'] = array('default' => 6);
    $options['grid_cols_xs'] = array('default' => 12);
    $options['grid_margin'] = array('default' => 10);
    $options['grid_itemWidth'] = array('default' => 360);
    $options['grid_itemHeight'] = array('default' => 220);
    $options['grid_phoneWidth'] = array('default' => 768);
    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    $form['grid_bootstrap'] = array(
        '#type' => 'select',
        '#title' => t('Use bootstrap grid?'),
        '#options' => array(
          0 => 'No',
          1 => 'Yes'
        ),
        '#default_value' => $this->options['grid_bootstrap']
    );
    $form['grid_cols_lg'] = array(
        '#type' => 'select',
        '#title' => t('Large Desktop Columns'),
        '#options' => array(1=>'1',2=>'2',3=>'3',4=>'4',5=>'5',6=>'6',7=>'7',8=>'8',9=>'9',10=>'10',11=>'11',12=>'12'),
        '#default_value' => $this->options['grid_cols_lg']
    );
		$form['grid_cols_md'] = array(
        '#type' => 'select',
        '#title' => t('Desktop Columns'),
        '#options' => array(1=>'1',2=>'2',3=>'3',4=>'4',5=>'5',6=>'6',7=>'7',8=>'8',9=>'9',10=>'10',11=>'11',12=>'12'),
        '#default_value' => $this->options['grid_cols_md']
    );
		$form['grid_cols_sm'] = array(
        '#type' => 'select',
        '#title' => t('Tablet Columns'),
        '#options' => array(1=>'1',2=>'2',3=>'3',4=>'4',5=>'5',6=>'6',7=>'7',8=>'8',9=>'9',10=>'10',11=>'11',12=>'12'),
        '#default_value' => $this->options['grid_cols_sm']
    );
		$form['grid_cols_xs'] = array(
        '#type' => 'select',
        '#title' => t('Phone Columns'),
        '#options' => array(1=>'1',2=>'2',3=>'3',4=>'4',5=>'5',6=>'6',7=>'7',8=>'8',9=>'9',10=>'10',11=>'11',12=>'12'),
        '#default_value' => $this->options['grid_cols_xs']
    );
    $form['grid_itemWidth'] = array(
        '#type' => 'textfield',
        '#title' => t('Item width'),
        '#default_value' => $this->options['grid_itemWidth']
    );
    $form['grid_itemHeight'] = array(
        '#type' => 'textfield',
        '#title' => t('Item width'),
        '#default_value' => $this->options['grid_itemHeight']
    );
    $form['grid_margin'] = array(
        '#type' => 'textfield',
        '#title' => t('Margin'),
        '#default_value' => $this->options['grid_margin']
    );
    $form['grid_phoneWidth'] = array(
        '#type' => 'textfield',
        '#title' => t('Small screen size'),
        '#description' => t('On small screen, the grid cols will set to 1.'),
        '#default_value' => $this->options['grid_phoneWidth']
    );
  }

}