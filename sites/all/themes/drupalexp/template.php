<?php

require_once dirname(__FILE__) . '/includes/core.php';
require_once dirname(__FILE__) . '/includes/lessc.php';
require_once dirname(__FILE__) . '/includes/form.inc';

function drupalexp_default_layouts() {
  return 'W3sia2V5IjoiZGVmYXVsdCIsInRpdGxlIjoiRGVmYXVsdCIsInNlY3Rpb25zIjpbeyJrZXkiOiJoZWFkZXIiLCJ0aXRsZSI6IkhlYWRlciIsIndlaWdodCI6MCwiZnVsbHdpZHRoIjoibm8iLCJiYWNrZ3JvdW5kY29sb3IiOiIiLCJzdGlja3kiOmZhbHNlLCJ2cGhvbmUiOmZhbHNlLCJ2dGFibGV0IjpmYWxzZSwidmRlc2t0b3AiOmZhbHNlLCJocGhvbmUiOmZhbHNlLCJodGFibGV0IjpmYWxzZSwiaGRlc2t0b3AiOmZhbHNlLCJyZWdpb25zIjpbeyJrZXkiOiJoZWFkZXIiLCJ0aXRsZSI6IkhlYWRlciIsIndlaWdodCI6MCwiY29seHMiOiIxMiIsImNvbHNtIjoiMTIiLCJjb2xtZCI6IjEyIiwiY29sbGciOiIxMiJ9XX0seyJrZXkiOiJoaWdobGlnaHRlZCIsInRpdGxlIjoiSGlnaGxpZ2h0ZWQiLCJ3ZWlnaHQiOjEsImZ1bGx3aWR0aCI6Im5vIiwiYmFja2dyb3VuZGNvbG9yIjoiIiwic3RpY2t5IjpmYWxzZSwidnBob25lIjpmYWxzZSwidnRhYmxldCI6ZmFsc2UsInZkZXNrdG9wIjpmYWxzZSwiaHBob25lIjpmYWxzZSwiaHRhYmxldCI6ZmFsc2UsImhkZXNrdG9wIjpmYWxzZSwicmVnaW9ucyI6W3sia2V5IjoiaGlnaGxpZ2h0ZWQiLCJ0aXRsZSI6IkhpZ2hsaWdodGVkIiwid2VpZ2h0IjowLCJjb2x4cyI6IjEyIiwiY29sc20iOiIxMiIsImNvbG1kIjoiMTIiLCJjb2xsZyI6IjEyIn1dfSx7ImtleSI6Im1haW4tY29udGVudCIsInRpdGxlIjoiTWFpbiBDb250ZW50Iiwid2VpZ2h0IjoyLCJmdWxsd2lkdGgiOiJubyIsImJhY2tncm91bmRjb2xvciI6IiIsInN0aWNreSI6ZmFsc2UsInZwaG9uZSI6ZmFsc2UsInZ0YWJsZXQiOmZhbHNlLCJ2ZGVza3RvcCI6ZmFsc2UsImhwaG9uZSI6ZmFsc2UsImh0YWJsZXQiOmZhbHNlLCJoZGVza3RvcCI6ZmFsc2UsInJlZ2lvbnMiOlt7ImtleSI6InNpZGViYXJfZmlyc3QiLCJ0aXRsZSI6IkxlZnQgc2lkZWJhciIsIndlaWdodCI6MCwiY29seHMiOiIxMiIsImNvbHNtIjoiMTIiLCJjb2xtZCI6IjMiLCJjb2xsZyI6IjMifSx7ImtleSI6ImNvbnRlbnQiLCJ0aXRsZSI6IkNvbnRlbnQiLCJ3ZWlnaHQiOjEsImNvbHhzIjoiMTIiLCJjb2xzbSI6IjEyIiwiY29sbWQiOiI2IiwiY29sbGciOiI2In0seyJrZXkiOiJzaWRlYmFyX3NlY29uZCIsInRpdGxlIjoiUmlnaHQgc2lkZWJhciIsIndlaWdodCI6MiwiY29seHMiOiIxMiIsImNvbHNtIjoiMTIiLCJjb2xtZCI6IjMiLCJjb2xsZyI6IjMifV19LHsia2V5IjoiZm9vdGVyIiwidGl0bGUiOiJGb290ZXIiLCJ3ZWlnaHQiOjMsImZ1bGx3aWR0aCI6Im5vIiwiYmFja2dyb3VuZGNvbG9yIjoiIiwic3RpY2t5IjpmYWxzZSwidnBob25lIjpmYWxzZSwidnRhYmxldCI6ZmFsc2UsInZkZXNrdG9wIjpmYWxzZSwiaHBob25lIjpmYWxzZSwiaHRhYmxldCI6ZmFsc2UsImhkZXNrdG9wIjpmYWxzZSwicmVnaW9ucyI6W3sia2V5IjoiZm9vdGVyIiwidGl0bGUiOiJGb290ZXIiLCJ3ZWlnaHQiOjAsImNvbHhzIjoiMTIiLCJjb2xzbSI6IjEyIiwiY29sbWQiOiIxMiIsImNvbGxnIjoiMTIifV19LHsia2V5IjoidW5hc3NpZ25lZCIsInRpdGxlIjoiVW5hc3NpZ25lZCIsIndlaWdodCI6NCwiZnVsbHdpZHRoIjoibm8iLCJiYWNrZ3JvdW5kY29sb3IiOiIiLCJzdGlja3kiOmZhbHNlLCJ2cGhvbmUiOmZhbHNlLCJ2dGFibGV0IjpmYWxzZSwidmRlc2t0b3AiOmZhbHNlLCJocGhvbmUiOmZhbHNlLCJodGFibGV0IjpmYWxzZSwiaGRlc2t0b3AiOmZhbHNlLCJyZWdpb25zIjpbeyJrZXkiOiJoZWxwIiwidGl0bGUiOiJIZWxwIiwid2VpZ2h0IjowLCJjb2x4cyI6MTIsImNvbHNtIjoxMiwiY29sbWQiOjYsImNvbGxnIjo2fSx7ImtleSI6InBhZ2VfdG9wIiwidGl0bGUiOiJQYWdlIHRvcCIsIndlaWdodCI6MSwiY29seHMiOjEyLCJjb2xzbSI6MTIsImNvbG1kIjo2LCJjb2xsZyI6Nn0seyJrZXkiOiJwYWdlX2JvdHRvbSIsInRpdGxlIjoiUGFnZSBib3R0b20iLCJ3ZWlnaHQiOjIsImNvbHhzIjoxMiwiY29sc20iOjEyLCJjb2xtZCI6NiwiY29sbGciOjZ9LHsia2V5IjoiZGFzaGJvYXJkX21haW4iLCJ0aXRsZSI6IkRhc2hib2FyZCAobWFpbikiLCJ3ZWlnaHQiOjMsImNvbHhzIjoxMiwiY29sc20iOjEyLCJjb2xtZCI6NiwiY29sbGciOjZ9LHsia2V5IjoiZGFzaGJvYXJkX3NpZGViYXIiLCJ0aXRsZSI6IkRhc2hib2FyZCAoc2lkZWJhcikiLCJ3ZWlnaHQiOjQsImNvbHhzIjoxMiwiY29sc20iOjEyLCJjb2xtZCI6NiwiY29sbGciOjZ9LHsia2V5IjoiZGFzaGJvYXJkX2luYWN0aXZlIiwidGl0bGUiOiJEYXNoYm9hcmQgKGluYWN0aXZlKSIsIndlaWdodCI6NSwiY29seHMiOjEyLCJjb2xzbSI6MTIsImNvbG1kIjo2LCJjb2xsZyI6Nn1dfV19XQ==';
}

function drupalexp_default_presets() {
  return 'W3sia2V5IjoiQmx1ZSIsImJhc2VfY29sb3IiOiIjMDA3MmI5IiwidGV4dF9jb2xvciI6IiM0OTQ5NDkiLCJsaW5rX2NvbG9yIjoiIzAyN2FjNiIsImxpbmtfaG92ZXJfY29sb3IiOiIjMDI3YWM2IiwiaGVhZGluZ19jb2xvciI6IiMyMzg1YzIifSx7ImtleSI6IkFzaCIsImJhc2VfY29sb3IiOiIjNDY0ODQ5IiwidGV4dF9jb2xvciI6IiM0OTQ5NDkiLCJsaW5rX2NvbG9yIjoiIzJmNDE2ZiIsImxpbmtfaG92ZXJfY29sb3IiOiIjMmY0MTZmIiwiaGVhZGluZ19jb2xvciI6IiMyYTJiMmQifSx7ImtleSI6IkFxdWFtYXJpbmUiLCJiYXNlX2NvbG9yIjoiIzU1YzBlMiIsInRleHRfY29sb3IiOiIjNjk2OTY5IiwibGlua19jb2xvciI6IiMwMDAwMDAiLCJsaW5rX2hvdmVyX2NvbG9yIjoiIzAwMDAwMCIsImhlYWRpbmdfY29sb3IiOiIjMDg1MzYwIn0seyJrZXkiOiJCZWxnaWFuIENob2NvbGF0ZSIsImJhc2VfY29sb3IiOiIjZDViMDQ4IiwidGV4dF9jb2xvciI6IiM0OTQ5NDkiLCJsaW5rX2NvbG9yIjoiIzZjNDIwZSIsImxpbmtfaG92ZXJfY29sb3IiOiIjNmM0MjBlIiwiaGVhZGluZ19jb2xvciI6IiMzMzE5MDAifSx7ImtleSI6IkJsdWFtYXJpbmUiLCJiYXNlX2NvbG9yIjoiIzNmM2YzZiIsInRleHRfY29sb3IiOiIjMDAwMDAwIiwibGlua19jb2xvciI6IiMzMzY2OTkiLCJsaW5rX2hvdmVyX2NvbG9yIjoiIzMzNjY5OSIsImhlYWRpbmdfY29sb3IiOiIjNjU5OGNiIn0seyJrZXkiOiJDaXRydXMgQmxhc3QiLCJiYXNlX2NvbG9yIjoiI2QwY2I5YSIsInRleHRfY29sb3IiOiIjNDk0OTQ5IiwibGlua19jb2xvciI6IiM5MTc4MDMiLCJsaW5rX2hvdmVyX2NvbG9yIjoiIzkxNzgwMyIsImhlYWRpbmdfY29sb3IiOiIjZWZkZTAxIn1d';
}

/**
 * Implements hook_theme
 */
function drupalexp_theme($existing, $type, $theme, $path) {
  return array(
      'dexp-section' => array(
          'template' => 'section',
          'path' => $path . '/templates/base',
          'render element' => 'elements',
          'pattern' => 'section__',
          'preprocess functions' => array(
              'template_preprocess',
              'template_preprocess_section',
          ),
          'process functions' => array(
              'template_process',
              'template_process_section',
          ),
      )
  );
}

function template_preprocess_section(&$vars) {
  $theme = drupalexp_get_theme();
  $section = $vars['section'];
  $vars['theme_hook_suggestions'][] = 'section__' . $theme->theme;
  $vars['theme_hook_suggestions'][] = 'section__' . $section->key;
  if (isset($section->sticky) && $section->sticky) {
    $vars['classes_array'][] = 'dexp-sticky';
    drupal_add_js(drupal_get_path('theme', 'drupalexp') . '/assets/js/drupalexp-sticky.js');
  }
  if (isset($section->colpadding) && $section->colpadding != '' && $section->colpadding != 15 && $section->colpadding >= 0) {
    $vars['attributes_array']['data-padding'] = $section->colpadding;
    $vars['classes_array'][] = 'custompadding';
  }
  if (isset($section->custom_class) && $section->custom_class != '') {
    $vars['classes_array'][] = $section->custom_class;
  }
  if (isset($section->hphone) && $section->hphone) {
    $vars['classes_array'][] = 'hidden-xs';
  }
  if (isset($section->htablet) && $section->htablet) {
    $vars['classes_array'][] = 'hidden-sm';
  }
  if (isset($section->hdesktop) && $section->hdesktop) {
    $vars['classes_array'][] = 'hidden-md';
    $vars['classes_array'][] = 'hidden-lg';
  }
  if (isset($section->vphone) && $section->vphone) {
    $vars['classes_array'][] = 'visible-xs';
  }
  if (isset($section->vtablet) && $section->vtablet) {
    $vars['classes_array'][] = 'visible-sm';
  }
  if (isset($section->vdesktop) && $section->vdesktop) {
    $vars['classes_array'][] = 'visible-md';
    $vars['classes_array'][] = 'visible-lg';
  }
  $vars['container_class'] = $section->fullwidth == 'no' ? 'container' : 'dexp-container';
  $vars['attributes_array']['class'] = $vars['classes_array'];
  $vars['attributes_array']['id'] = drupal_html_id('section-' . $section->key);
  $vars['html_id'] = $vars['attributes_array']['id'];
  if (isset($section->backgroundcolor) && $section->backgroundcolor) {
    $vars['attributes_array']['style'] = "background-color:{$section->backgroundcolor}";
  }
  drupal_add_js(drupal_get_path('theme', 'drupalexp') . '/assets/js/jquery.slimscroll.min.js');

}
/**
 * Implement hook_page_alter
 */
function drupalexp_page_alter(&$page) {
  $regions = system_region_list($GLOBALS['theme'], REGIONS_ALL);
  foreach ($regions as $region => $name) {
    switch ($region) {
      case 'title':
        if (empty($page[$region])) {
          $page[$region] = array(
              'block_title' => array(
                  '#markup' => ''
              ),
              '#region' => $region,
              '#theme_wrappers' => array('region')
          );
        }
        break;
    }
  }
}

/**
 * Implement hook_preprocess_page
 */
function drupalexp_preprocess_page(&$page) {
  if (isset($_GET['ajax']) && $_GET['ajax'] == 1) {
    $page['theme_hook_suggestions'][] = 'page__ajax';
  }
  $theme = drupalexp_get_theme();
  $theme->page = &$page;
}

/**
 * Implement hook_preprocess_html
 */
function drupalexp_preprocess_html(&$vars) {
  if (isset($_GET['ajax']) && $_GET['ajax'] == 1) {
    $vars['theme_hook_suggestions'][] = 'html__ajax';
  }
  drupal_add_css(drupal_get_path('theme', 'drupalexp') . '/assets/css/drupalexp.css');
  drupal_add_css(drupal_get_path('theme', 'drupalexp') . '/vendor/bootstrap/css/bootstrap.min.css');
  drupal_add_css(drupal_get_path('theme', 'drupalexp') . '/vendor/font-awesome/css/font-awesome.min.css');
  drupal_add_js(drupal_get_path('theme', 'drupalexp') . '/assets/js/plugins.js',array('weight'=>-1));
  drupal_add_js(drupal_get_path('theme', 'drupalexp') . '/vendor/bootstrap/js/bootstrap.min.js');
  drupal_add_js(drupal_get_path('theme', 'drupalexp') . '/assets/js/drupalexp-custompadding.js');
  drupal_add_js(drupal_get_path('theme', 'drupalexp') . '/assets/js/drupalexp.js');
  require_once dirname(__FILE__) . '/includes/lessc.php';
  $theme = drupalexp_get_theme();
  if($theme->get('drupalexp_smoothscroll')){
    drupal_add_js(drupal_get_path('theme', 'drupalexp') . '/assets/js/dexp-smoothscroll.js');
  }else{
    drupal_add_js(drupal_get_path('theme', 'drupalexp') . '/assets/js/smoothscroll.js');
  }
  $direction = isset($_SESSION['drupalexp_default_direction'])?$_SESSION['drupalexp_default_direction']:null;
  if (empty($direction)) {
    $direction = $theme->get('drupalexp_direction');
  }
  if (empty($direction)) {
    $direction = 'default';
  }
  if($direction == 'default'){
    global $language;
    $direction = $language->dir;
  }
  if ($direction == 'rtl' || module_exists('dexp_quicksettings')) {
    drupal_add_css(drupal_get_path('theme', 'drupalexp') . '/assets/css/drupalexp-rtl.css');
  }
  $vars['classes_array'][] = $direction;
  $vars['classes_array'][] = $theme->style; //boxed/wide
  $vars['classes_array'][] = $theme->get('drupalexp_wrapper_class');
  $less = new drupalexp_lessc($theme);
  $preset_key = strtolower($theme->presets[$theme->preset]->key);
  $js = array(
      'drupalexp' => $theme->presets[$theme->preset],
  );
  drupal_add_js($js, 'setting');
  $preset_class = drupal_html_class('preset-' . $preset_key);
  $vars['classes_array'][] = $preset_class;
  $preset_key = preg_replace('/[^a-z0-9]/s', '', $preset_key);
  $css_dir = 'public://drupalexp/css';
  file_prepare_directory($css_dir, FILE_CREATE_DIRECTORY);
  $css_file = $css_dir.'/style-' . $preset_key . '.css';
  $less->complie($css_file);
  drupal_add_css($css_file);
  //Google Analytics
  $ga_code = $theme->get('drupalexp_ga_analytics');
  if (!empty($ga_code)) {
    drupal_add_js($ga_code, 'inline');
  }
}

/**
 * Implement hook_preprocess_region
 */
function drupalexp_preprocess_region(&$vars) {
  $theme = drupalexp_get_theme();
  $region_key = $vars['elements']['#region'];
  $region = $theme->getRegion($region_key);
  if ($region) {
    $vars['classes_array'][] = 'col-xs-' . $region->colxs;
    $vars['classes_array'][] = 'col-sm-' . $region->colsm;
    $vars['classes_array'][] = 'col-md-' . $region->colmd;
    $vars['classes_array'][] = 'col-lg-' . $region->collg;
    if (isset($region->custom_class) && $region->custom_class) {
      $vars['classes_array'][] = $region->custom_class;
    }
  }
}

/**
 * Implement hook_process_region
 */
function drupalexp_process_region(&$vars) {
  $theme = drupalexp_get_theme();
  switch ($vars['elements']['#region']) {
    case 'content':
      $vars['messages'] = $theme->page['messages'];
      $vars['title_prefix'] = $theme->page['title_prefix'];
      $vars['title'] = $theme->page['title'];
      $vars['title_suffix'] = $theme->page['title_suffix'];
      $vars['tabs'] = $theme->page['tabs'];
      $vars['action_links'] = $theme->page['action_links'];
      $vars['feed_icons'] = $theme->page['feed_icons'];
      $vars['breadcrumb'] = $theme->page['breadcrumb'];
      break;
    case 'logo':
      $vars['logo'] = $theme->page['logo'];
      $vars['logo_img'] = !is_null($vars['logo']) ? '<img src="' . $vars['logo'] . '" id="logo"/>' : '';
      $vars['linked_logo'] = !is_null($vars['logo']) ? l($vars['logo_img'], '<front>', array('html' => TRUE, 'attributes' => array('rel' => 'home'))) : '';
      break;
    case 'title':
      $vars['title_prefix'] = $theme->page['title_prefix'];
      $vars['title'] = $theme->page['title'];
      $vars['title_suffix'] = $theme->page['title_suffix'];
      break;
  }
}

/**
 * Implement hook_menu_local_tasks
 */
function drupalexp_menu_local_tasks(&$vars) {
  $output = '';

  if (!empty($vars['primary'])) {
    $vars['primary']['#prefix'] = '<h2 class="element-invisible">' . t('Primary tabs') . '</h2>';
    $vars['primary']['#prefix'] = '<ul class="nav nav-tabs">';
    $vars['primary']['#suffix'] = '</ul>';
    $output .= drupal_render($vars['primary']);
  }

  if (!empty($vars['secondary'])) {
    $vars['primary']['#prefix'] = '<h2 class="element-invisible">' . t('Primary tabs') . '</h2>';
    $vars['secondary']['#prefix'] = '<ul class="nav nav-pills">';
    $vars['secondary']['#suffix'] = '</ul>';
    $output .= drupal_render($vars['secondary']);
  }

  return $output;
}

/**
 * Implement hook_preprocess_node
 */
function drupalexp_preprocess_node(&$vars) {
  $node = $vars['node'];
  if ($vars['view_mode'] != 'full') {
    $vars['theme_hook_suggestions'][] = 'node__' . $vars['view_mode'];
    $vars['theme_hook_suggestions'][] = 'node__' . $node->type . '__' . $vars['view_mode'];
    $vars['theme_hook_suggestions'][] = 'node__' . $node->nid . '__' . $vars['view_mode'];
    $vars['classes_array'][] = 'view-mode-'.$vars['view_mode'];
  }
}

/**
 * Pager
 */
function drupalexp_pager($variables) {
  $tags = $variables['tags'];
  $element = $variables['element'];
  $parameters = $variables['parameters'];
  $quantity = $variables['quantity'];
  global $pager_page_array, $pager_total;

  // Calculate various markers within this pager piece:
  // Middle is used to "center" pages around the current page.
  $pager_middle = ceil($quantity / 2);
  // current is the page we are currently paged to
  $pager_current = $pager_page_array[$element] + 1;
  // first is the first page listed by this pager piece (re quantity)
  $pager_first = $pager_current - $pager_middle + 1;
  // last is the last page listed by this pager piece (re quantity)
  $pager_last = $pager_current + $quantity - $pager_middle;
  // max is the maximum page number
  $pager_max = $pager_total[$element];
  // End of marker calculations.
  // Prepare for generation loop.
  $i = $pager_first;
  if ($pager_last > $pager_max) {
    // Adjust "center" if at end of query.
    $i = $i + ($pager_max - $pager_last);
    $pager_last = $pager_max;
  }
  if ($i <= 0) {
    // Adjust "center" if at start of query.
    $pager_last = $pager_last + (1 - $i);
    $i = 1;
  }
  // End of generation loop preparation.

  $li_first = theme('pager_first', array('text' => (isset($tags[0]) ? $tags[0] : t('« first')), 'element' => $element, 'parameters' => $parameters));
  $li_previous = theme('pager_previous', array('text' => (isset($tags[1]) ? $tags[1] : t('‹ previous')), 'element' => $element, 'interval' => 1, 'parameters' => $parameters));
  $li_next = theme('pager_next', array('text' => (isset($tags[3]) ? $tags[3] : t('next ›')), 'element' => $element, 'interval' => 1, 'parameters' => $parameters));
  $li_last = theme('pager_last', array('text' => (isset($tags[4]) ? $tags[4] : t('last »')), 'element' => $element, 'parameters' => $parameters));

  if ($pager_total[$element] > 1) {
    if ($li_first) {
      $items[] = array(
          'class' => array('pager-first'),
          'data' => $li_first,
      );
    }
    if ($li_previous) {
      $items[] = array(
          'class' => array('pager-previous'),
          'data' => $li_previous,
      );
    }

    // When there is more than one page, create the pager list.
    if ($i != $pager_max) {
      if ($i > 1) {
        $items[] = array(
            'class' => array('pager-ellipsis'),
            'data' => '…',
        );
      }
      // Now generate the actual pager piece.
      for (; $i <= $pager_last && $i <= $pager_max; $i++) {
        if ($i < $pager_current) {
          $items[] = array(
              'class' => array('pager-item'),
              'data' => theme('pager_previous', array('text' => $i, 'element' => $element, 'interval' => ($pager_current - $i), 'parameters' => $parameters)),
          );
        }
        if ($i == $pager_current) {
          $items[] = array(
              'class' => array('pager-current'),
              'data' => '<a href="#" title="Current page">' . $i . '</a>',
          );
        }
        if ($i > $pager_current) {
          $items[] = array(
              'class' => array('pager-item'),
              'data' => theme('pager_next', array('text' => $i, 'element' => $element, 'interval' => ($i - $pager_current), 'parameters' => $parameters)),
          );
        }
      }
      if ($i < $pager_max) {
        $items[] = array(
            'class' => array('pager-ellipsis'),
            'data' => '<a href="#">…</a>',
        );
      }
    }
    // End generation.
    if ($li_next) {
      $items[] = array(
          'class' => array('pager-next'),
          'data' => $li_next,
      );
    }
    if ($li_last) {
      $items[] = array(
          'class' => array('pager-last'),
          'data' => $li_last,
      );
    }
    return '<h2 class="element-invisible">' . t('Pages') . '</h2>' . theme('item_list', array(
                'items' => $items,
                'attributes' => array('class' => array('pagination')),
            ));
  }
}

function drupalexp_css_alter(&$css){
  foreach($css as $k=>$v){
    if(strpos($k, 'admin_menu-rtl.css') !== false){
      unset($css[$k]);
    }
  }
}

function drupalexp_menu_link(array $variables) {
  $element = $variables['element'];
$icon = "";
    if(isset($element['#localized_options']['link_icon'])){
            $element['#title'] = '<i class="fa '.$element['#localized_options']['link_icon'].'"></i> '.$element['#title'];
        $element['#localized_options']['html'] = true;
}
  $sub_menu = '';

  if ($element['#below']) {
    $sub_menu = drupal_render($element['#below']);
  }
  $output = l($element['#title'], $element['#href'], $element['#localized_options']);
  return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
}
