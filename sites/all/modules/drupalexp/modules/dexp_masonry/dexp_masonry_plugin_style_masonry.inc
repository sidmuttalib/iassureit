<?php

/**
 * @file
 * Defines the style plugin for the Dexp Masonry
 */
class dexp_masonry_plugin_style_masonry extends views_plugin_style {

  function option_definition() {
    $options = parent::option_definition();
    $options['grid_filter'] = array('default' => 0);
    $options['grid_filter_vocabulary'] = array('default' => 0);
    $options['grid_margin'] = array('default' => 0);
    $options['grid_cols_lg'] = array('default' => 12);
    $options['grid_cols_md'] = array('default' => 12);
    $options['grid_cols_sm'] = array('default' => 6);
    $options['grid_cols_xs'] = array('default' => 1);
    $options['grid_ratio'] = array('default' => 1);
    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    $form['grid_filter'] = array(
        '#type' => 'checkbox',
        '#title' => t('Use Filter'),
        '#default_value' => $this->options['grid_filter']
    );

    $opts = array('- Select -');
    $tmp = array();
    foreach (taxonomy_vocabulary_get_names() as $vocab) {
      $tmp[$vocab->vid] = $vocab->name;
    }
    $opts += $tmp;
    $form['grid_filter_vocabulary'] = array(
        '#type' => 'select',
        '#title' => t('Filter Vocabulary'),
        '#options' => $opts,
        '#description' => t('Which taxonomy vocabulary do you want to use for the filter'),
        '#default_value' => $this->options['grid_filter_vocabulary'],
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
    $form['grid_margin'] = array(
        '#type' => 'textfield',
        '#title' => t('Grid item margin'),
        '#default_value' => $this->options['grid_margin']
    );
    $form['grid_ratio'] = array(
        '#type' => 'textfield',
        '#title' => t('Aspect ratio'),
        '#description' => t('The ratio of width to height'),
        '#default_value' => $this->options['grid_ratio']
    );
  }

}