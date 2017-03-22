<?php

function dexp_shortcodes_testimonials_shortcode_info(&$shortcodes) {
    $shortcodes['testimonials'] = array(
        'title' => t('Testimonials wrapper'),
        'description' => t('Testimonials wrapper shortcode'),
        'process callback' => 'dexp_shortcodes_testimonials',
        'tips callback' => 'dexp_shortcodes_testimonial_tips',
    );
}

function dexp_shortcodes_testimonials($attrs, $text) {
    $attrs = shortcode_attrs(array(
        'class' => '',
        'total_items' => '0',
        'sequence' => '',
            ), $attrs);
    $attrs['content'] = $text;
    return theme('dexp_shortcodes_testimonials', $attrs);
}

function dexp_shortcodes_testimonials_theme(&$themes) {
    $path = drupal_get_path('module', 'dexp_shortcodes');
    $themes['dexp_shortcodes_testimonials'] = array(
        'template' => 'testimonials',
        'path' => $path . '/theme',
        'pattern' => 'shortcode__',
        'preprocess functions' => array(
            'template_preprocess',
            'dexp_shortcodes_preprocess_shortcode_testimonials',
        ),
        'variables' => array(
            'class' => '',
            'total_items' => '0',
            'content' => '',
        )
    );
}

function dexp_shortcodes_preprocess_shortcode_testimonials(&$vars) {
    $vars['testimonial_wapper_id'] = drupal_html_id("dexp_testimonial_wrapper_" . $_SERVER['REQUEST_TIME']);
    $vars['theme_hook_suggestions'][] = 'shortcode__testimonials';
}

function dexp_shortcodes_testimonial_shortcode_info(&$shortcodes) {
    $shortcodes['testimonial'] = array(
        'title' => t('Testimonial Item'),
        'description' => t('Testimonial item shortcode'),
        'process callback' => 'dexp_shortcodes_testimonial',
    );
}

function dexp_shortcodes_testimonial($attrs, $text) {
    $attrs = shortcode_attrs(array(
        'name' => '',
        'image' => '',
        'position' => '',
        'sequence' => '',
        'site' => '',
        'rate' => '0'), $attrs);
    $attrs['content'] = $text;
    return theme('dexp_shortcodes_testimonial', $attrs);
}

function dexp_shortcodes_testimonial_theme(&$themes) {
    $path = drupal_get_path('module', 'dexp_shortcodes');
    $themes['dexp_shortcodes_testimonial'] = array(
        'template' => 'testimonial',
        'path' => $path . '/theme',
        'pattern' => 'shortcode__',
        'preprocess functions' => array(
            'template_preprocess',
            'dexp_shortcodes_preprocess_shortcode_testimonial',
        ),
        'variables' => array(
            'name' => '',
            'image' => '',
            'position' => '',
            'sequence' => '',
            'content' => '',
            'site' => '',
            'rate' => '0'
        )
    );
}

function dexp_shortcodes_preprocess_shortcode_testimonial(&$vars) {
    $vars['theme_hook_suggestions'][] = 'shortcode__testimonial';
}

function dexp_shortcodes_testimonial_tips($format, $long) {
    $output = '[testimonials total_items="0" class=""][testimonial name="NAME" position="" sequence = "" image="" site="" rate=""]CONTENT[/testimonial][testimonial name="NAME" position="" sequence = "" image="" site="" rate=""]CONTENT[/testimonial][testimonial name="NAME" position="" sequence = "" image="" site="" rate=""]CONTENT[/testimonial][/testimonials]';
    return $output;
}
