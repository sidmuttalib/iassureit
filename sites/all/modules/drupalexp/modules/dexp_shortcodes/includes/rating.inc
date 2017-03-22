<?php

function dexp_shortcodes_rating_shortcode_info(&$shortcodes) {
    $shortcodes['rating'] = array(
        'title' => t('Rating'),
        'description' => t('Js Rating shortcode'),
        'process callback' => 'dexp_shortcodes_rating',
        'tips callback' => 'dexp_shortcodes_rating_tips',
    );
}

function dexp_shortcodes_rating($attrs, $text) {
    $attrs = shortcode_attrs(array(
        'class' => '',
        'name' => '',
        'position' => '',
        'image' => '',
        'site' => '',
        'stars' => ''), $attrs);
    $attrs['content'] = $text;
    return theme('dexp_shortcodes_rating', $attrs);
}

function dexp_shortcodes_rating_theme(&$themes) {
    $path = drupal_get_path('module', 'dexp_shortcodes');
    $themes['dexp_shortcodes_rating'] = array(
        'template' => 'rating',
        'path' => $path . '/theme',
        'pattern' => 'shortcode__',
        'preprocess functions' => array(
            'template_preprocess',
            'dexp_shortcodes_preprocess_shortcode_rating',
        ),
        'variables' => array(
            'class' => '',
            'name' => '',
            'position' => '',
            'image' => '',
            'site' => '',
            'stars' => '',
            'content' => '',
        )
    );
}

function dexp_shortcodes_preprocess_shortcode_rating(&$vars) {
    $vars['rating_id'] = drupal_html_id("dexp_rating");
    $vars['theme_hook_suggestions'][] = 'shortcode__rating';
}

function dexp_shortcodes_rating_tips($format, $long) {
    $output = "[rating name='' position='' image='' stars='' site='' class='']CONTENT[/rating]";
    return $output;
}
