<?php

function dexp_layerslider_form($slideid = 0) {
  $slideid = arg(2);
  if (is_numeric($slideid)) {
    $slide = db_select('{dexp_layerslider}', 'd')->fields('d')->condition('id', $slideid, '=')->execute()->fetchAssoc();
  } else {
    $slide = array('id' => 0, 'name' => '');
  }
  $form = array();
  $form['id'] = array(
      '#type' => 'hidden',
      '#default_value' => $slide['id']
  );
  $form['name'] = array(
      '#type' => 'textfield',
      '#title' => 'Name',
      '#default_value' => $slide['name']
  );
  $form['submit'] = array(
      '#type' => 'submit',
      '#value' => 'Save'
  );
  return $form;
}

function dexp_layerslider_form_submit($form, $form_state) {
  if ($form['id']['#value']) {
    $sid = db_update("dexp_layerslider")
            ->fields(array(
                'name' => $form['name']['#value'],
            ))
            ->condition('id', $form['id']['#value'])
            ->execute();
    drupal_set_message("Slide '{$form['name']['#value']}' has been updated");
  } else {
    $sid = db_insert("dexp_layerslider")
            ->fields(array(
                'name' => $form['name']['#value'],
                'settings' => '',
                'data' => ''
            ))
            ->execute();
    drupal_set_message("Slide '{$form['name']['#value']}' has been created");
  }
  drupal_goto('admin/dexp_layerslider');
}
