<?php

function dexp_layerslider_import_form() {
  $form['title'] = array(
      '#type' => 'textfield',
      '#title' => t('Title')
  );
  $form['data'] = array(
      '#name' => 'data',
      '#type' => 'textarea',
      '#title' => t('Import code'),
      '#description' => t('Paste the export code here'),
  );
  $form['submit'] = array(
      '#type' => 'submit',
      '#value' => 'Import'
  );
  return $form;
}

function dexp_layerslider_import_form_submit(&$form, $form_state) {
  $title = $form['title']['#value'];
  $data = $form['data']['#value'];
  $json = base64_decode($data);
  $slideshow = json_decode($json);
  for ($i = 0; $i < count($slideshow->slides); $i++) {
    if (!empty($slideshow->slides[$i]->background_image_uri)) {
			if (isset($slideshow->slides[$i]->image_content)) {
				dexp_layerslider_base64toimage($slideshow->slides[$i]->image_content, $slideshow->slides[$i]->background_image_uri);
        unset($slideshow->slides[$i]->image_content);
      }
    }
    for ($j = 0; $j < count($slideshow->slides[$i]->layers); $j++) {
      if ($slideshow->slides[$i]->layers[$j]->type == 'image' && !empty($slideshow->slides[$i]->layers[$j]->image_uri)) {
        if (isset($slideshow->slides[$i]->layers[$j]->image_content)) {
          dexp_layerslider_base64toimage($slideshow->slides[$i]->layers[$j]->image_content, $slideshow->slides[$i]->layers[$j]->image_uri);
          unset($slideshow->slides[$i]->layers[$j]->image_content);
        }
      }
    }
  }
	db_insert('dexp_layerslider')->fields(array(
      'name' => $title,
      'settings' => base64_encode(json_encode($slideshow->settings)),
      'data' => base64_encode(json_encode($slideshow->slides)),
  ))->execute();
  drupal_set_message('Import was successful');
  drupal_goto('admin/dexp_layerslider');
}

function dexp_layerslider_base64toimage($str, $file) {
	$str = base64_decode($str);
  file_unmanaged_save_data($str, $file, FILE_EXISTS_REPLACE);
	return $file;
}