<?php

class dexp_views_bxslider_plugin_style_bxslide extends views_plugin_style_list {

  function option_definition() {
    $options = parent::option_definition();
    $options['mode'] = array('default' => 'horizontal');
    $options['speed'] = array('default' => 500);
    $options['touchEnabled'] = array('default' => 1);
    $options['auto'] = array('default' => 0);
    $options['pause'] = array('default' => 4000);
    $options['infiniteloop'] = array('default' => 1);
    $options['slidemargin'] = array('default' => 0);
    $options['startslide'] = array('default' => 0);
    $options['randomstart'] = array('default' => 0);

    $options['pager'] = array('default' => 1);
    $options['controls'] = array('default' => 1);
    $options['nexttext'] = array('default' => '<i class="fa fa-angle-right"></i>');
    $options['prevtext'] = array('default' => '<i class="fa fa-angle-left"></i>');

    $options['minslides'] = array('default' => 1);
    $options['maxslides'] = array('default' => 1);
    $options['moveslides'] = array('default' => 0);
    $options['slidewidth'] = array('default' => 0);
    $options['rows'] = array('default' => 1);

    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $form['mode'] = array(
        '#prefix' => '<h4>bxSlider Settings</h4>',
        '#type' => 'select',
        '#title' => t('Mode'),
        '#options' => array(
            'horizontal' => t('Horizontal'),
            'vertical' => t('Vertical'),
            'fade' => t('Fade'),
        ),
        '#default_value' => $this->options['mode'],
    );

    $form['rows'] = array(
        '#type' => 'textfield',
        '#title' => t('Rows'),
        '#default_value' => $this->options['rows'],
    );
    $form['speed'] = array(
        '#type' => 'textfield',
        '#title' => t('Speed'),
        '#description' => t('Slide transition duration (in ms)'),
        '#default_value' => $this->options['speed'],
    );
		
    $form['touchEnabled'] = array(
        '#type' => 'select',
        '#title' => t('Touch Enabled'),
        '#description' => t('If yes, slider will allow touch swipe transitions'),
        '#options' => array(
            true => 'Yes',
            false => 'No',
        ),
        '#default_value' => $this->options['touchEnabled'],
    );
		
		$form['auto'] = array(
        '#type' => 'select',
        '#title' => t('Auto'),
        '#description' => t('Slides will automatically transition.'),
        '#options' => array(
            true => 'Yes',
            false => 'No',
        ),
        '#default_value' => $this->options['auto'],
    );

    $form['pause'] = array(
        '#type' => 'textfield',
        '#title' => t('Pause'),
        '#description' => t('The amount of time (in ms) between each auto transition.'),
        '#default_value' => $this->options['pause'],
    );

    $form['infiniteloop'] = array(
        '#type' => 'select',
        '#title' => t('Infinite'),
        '#description' => t('If true, clicking "Next" while on the last slide will transition to the first slide and vice-versa'),
        '#options' => array(
            true => t('Yes'),
            false => t('No'),
        ),
        '#default_value' => $this->options['infiniteloop'],
    );

    $form['slidemargin'] = array(
        '#type' => 'textfield',
        '#title' => t('Slide Margin'),
        '#description' => t('Margin between each slide'),
        '#default_value' => $this->options['slidemargin'],
    );

    $form['startslide'] = array(
        '#type' => 'textfield',
        '#title' => t('Start Slide'),
        '#description' => t('Starting slide index (zero-based)'),
        '#default_value' => $this->options['startslide'],
    );

    $form['randomstart'] = array(
        '#type' => 'select',
        '#title' => t('Random Start'),
        '#options' => array(
            true => t('Yes'),
            false => t('No'),
        ),
        '#description' => t('Start slider on a random slide'),
        '#default_value' => $this->options['randomstart'],
    );

    $form['pager'] = array(
        '#type' => 'select',
        '#title' => t('Pager'),
        '#description' => t('If yes, a pager will be added.'),
        '#options' => array(
            true => 'Yes',
            false => 'No',
        ),
        '#default_value' => $this->options['pager'],
    );

    $form['controls'] = array(
        '#type' => 'select',
        '#title' => t('Controls'),
        '#description' => t('If yes, next/prev controls will be added.'),
        '#options' => array(
            true => 'Yes',
            false => 'No',
        ),
        '#default_value' => $this->options['controls'],
    );
    
    $form['nexttext'] = array(
        '#type' => 'textfield',
        '#title' => t('nextText'),
        '#description' => t('Text to be used for the "Next" control'),
        '#default_value' => $this->options['nexttext'],
    );
    
    $form['prevtext'] = array(
        '#type' => 'textfield',
        '#title' => t('prevText'),
        '#description' => t('Text to be used for the "Prev" control'),
        '#default_value' => $this->options['prevtext'],
    );
    
    $form['minslides'] = array(
        '#type' => 'textfield',
        '#title' => t('Min Slides'),
        '#description' => t('The minimum number of slides to be shown. Slides will be sized down if carousel becomes smaller than the original size.'),
        '#default_value' => $this->options['minslides'],
    );

    $form['maxslides'] = array(
        '#type' => 'textfield',
        '#title' => t('Max Slides'),
        '#description' => t('The maximum number of slides to be shown. Slides will be sized up if carousel becomes larger than the original size.'),
        '#default_value' => $this->options['maxslides'],
    );

    $form['moveslides'] = array(
        '#type' => 'textfield',
        '#title' => t('Move Slides'),
        '#description' => t('The number of slides to move on transition. This value must be >= minSlides, and <= maxSlides. If zero (default), the number of fully-visible slides will be used.'),
        '#default_value' => $this->options['moveslides'],
    );

    $form['slidewidth'] = array(
        '#type' => 'textfield',
        '#title' => t('Slide Width'),
        '#description' => t('The width of each slide. This setting is required for all horizontal carousels!'),
        '#default_value' => $this->options['slidewidth'],
    );
  }

}