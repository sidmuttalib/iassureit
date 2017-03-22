<?php

function dexp_shortcodes_3dtestimonials_shortcode_info(&$shortcodes) {
    $shortcodes['3dtestimonials'] = array(
        'title' => t('3D Testimonials wrapper'),
        'description' => t('3D Testimonials wrapper shortcode'),
        'process callback' => 'dexp_shortcodes_3dtestimonials',
        'tips callback' => 'dexp_shortcodes_3dtestimonial_tips',
    );
}

function dexp_shortcodes_3dtestimonials($attrs, $text) {
    $attrs = shortcode_attrs(array(
        'class' => '',
        'interval'=>'5000',), $attrs);
    $attrs['content'] = $text;
    return theme('dexp_shortcodes_3dtestimonials', $attrs);
}

function dexp_shortcodes_3dtestimonials_theme(&$themes) {
    $path = drupal_get_path('module', 'dexp_shortcodes');
    $themes['dexp_shortcodes_3dtestimonials'] = array(
        'template' => '3dtestimonials',
        'path' => $path . '/theme',
        'pattern' => 'shortcode__',
        'preprocess functions' => array(
            'template_preprocess',
            'dexp_shortcodes_preprocess_shortcode_3dtestimonials',
        ),
        'variables' => array(
            'class' => '',
			'interval'=>'5000'
        )
    );
}

function dexp_shortcodes_preprocess_shortcode_3dtestimonials(&$vars) {
    $vars['testimonial_wapper_id'] = drupal_html_id("dexp_3dtestimonial_wrapper_" . $_SERVER['REQUEST_TIME']);
    $vars['theme_hook_suggestions'][] = 'shortcode__3dtestimonials';   
}

function dexp_shortcodes_3dtestimonial_shortcode_info(&$shortcodes) {
    $shortcodes['3dtestimonial'] = array(
        'title' => t('3D Testimonial Item'),
        'description' => t('3D Testimonial item shortcode'),
        'process callback' => 'dexp_shortcodes_3dtestimonial',
    );
}

function dexp_shortcodes_3dtestimonial($attrs, $text) {
    $attrs = shortcode_attrs(array(
        'name' => '',
        'image' => '',        
        'position' => '',
		'site'=>''), $attrs);
    $attrs['content'] = $text;
    return theme('dexp_shortcodes_3dtestimonial', $attrs);
}

function dexp_shortcodes_3dtestimonial_theme(&$themes) {
    $path = drupal_get_path('module', 'dexp_shortcodes');
    $themes['dexp_shortcodes_3dtestimonial'] = array(
        'template' => '3dtestimonial',
        'path' => $path . '/theme',
        'pattern' => 'shortcode__',
        'preprocess functions' => array(
            'template_preprocess',
            'dexp_shortcodes_preprocess_shortcode_3dtestimonial',
        ),
        'variables' => array(
            'name' => '',
            'image' => '',           
			'position' => '',
			'site'=>''
        )
    );
}

function dexp_shortcodes_preprocess_shortcode_3dtestimonial(&$vars) {
    $vars['theme_hook_suggestions'][] = 'shortcode__3dtestimonial';
}

function dexp_shortcodes_3dtestimonial_tips($format, $long) {
    $output = '[3dtestimonials class="" interval=""][3dtestimonial name="NAME" image="" position="" site=""]CONTENT[/3dtestimonial][3dtestimonial name="NAME" link="" position="" site=""]CONTENT[/3dtestimonial][3dtestimonial name="NAME" image="" position="" site=""]CONTENT[/3dtestimonial][/3dtestimonials]';
    return $output;
}
