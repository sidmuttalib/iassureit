<?php

require_once dirname(__FILE__) . '/lessc.php';

class druplexp_theme extends stdClass {

  var $theme;
  var $layouts;
  var $layout = 0;
  var $lessc;
  var $lessc_vars = array();
  var $presets;
  var $preset;
  var $style = 'wide';
  var $page;
  var $content;
  var $tmpcontent = array();

  function __construct($theme = NULL) {
    if ($theme == NULL) {
      $theme = $GLOBALS['theme_key'];
    }
    $this->theme = $theme;
    $this->init();
  }

  function init() {
    $this->layouts();
    $p = $this->get('drupalexp_presets');
    $init_presets = 6;
    if (empty($p)) {
      $func = $this->theme . '_default_presets';
      if (function_exists($func)) {
        $p = $func();
      }
    }
    $this->presets = json_decode(base64_decode($p));
		$infunc = $this->theme . '_init_presets';
		if(function_exists($infunc)){
			$init_presets = $infunc();
		}
		$this->presets = array_slice($this->presets, 0, $init_presets);
		for($i=0; $i<$init_presets; $i++){
			if(!isset($this->presets[$i])){
				$newpreset = new stdClass();
				$newpreset->key = 'Preset '.($i+1);
				$newpreset->base_color = '#666666';
				$newpreset->base_color_opposite = '#666666';
				$newpreset->link_color = '#666666';
				$newpreset->link_hover_color = '#666666';
				$newpreset->text_color = '#666666';
				$newpreset->heading_color = '#666666';
				$this->presets[] = $newpreset;
			}
		}
    if(module_exists('dexp_quicksettings')){
      $this->style = isset($_SESSION['drupalexp_layout']) ? $_SESSION['drupalexp_layout'] : $this->get('drupalexp_layout');
      $this->preset = isset($_SESSION['drupalexp_default_preset']) ? $_SESSION['drupalexp_default_preset'] : $this->get('drupalexp_default_preset');
      $this->direction = isset($_SESSION['drupalexp_default_direction']) ? $_SESSION['drupalexp_default_direction'] : $this->get('drupalexp_direction');
    }else{
      $this->style = $this->get('drupalexp_layout');
      $this->preset = $this->get('drupalexp_default_preset');
      $this->direction = $this->get('drupalexp_direction');
    }
    $this->setPresetVars();
    $this->lessc = $this->getThemeInfo('lessc');
  }

  function setPresetVars($preset = null) {
    $pagewidth = $this->get('drupalexp_pagewidth');
    if(empty($pagewidth)) $pagewidth = 1170;
    $this->lessc_vars['container_width'] = $pagewidth.'px';
    if ($preset == null) {
      $preset = empty($this->preset)?0:$this->preset;
    }
    $default_preset = $this->presets[$preset];
    if ($default_preset) {
      $this->lessc_vars['base_color'] = $default_preset->base_color;
      $this->lessc_vars['base_color_opposite'] = isset($default_preset->base_color_opposite)?$default_preset->base_color_opposite:$default_preset->base_color;
      $this->lessc_vars['link_color'] = $default_preset->link_color;
      $this->lessc_vars['link_hover_color'] = $default_preset->link_hover_color;
      $this->lessc_vars['text_color'] = $default_preset->text_color;
      $this->lessc_vars['heading_color'] = $default_preset->heading_color;
    }
  }

  function layouts() {
    $theme_regions = $this->getThemeInfo('regions');
    $l = $this->get('drupalexp_layouts');
    if (!empty($l)) {
      $this->layouts = json_decode(base64_decode($l));
      $this->__addRegions();
      $this->__removeRegions();
    } else {
      $func = $this->theme . '_default_layouts';
      if (function_exists($func)) {
        $default_layout = $func();
        $this->layouts = json_decode(base64_decode($default_layout));
        $this->__addRegions();
        $this->__removeRegions();
        return;
      }
      $theme_regions = $this->getThemeInfo('regions');
      $regions = array();
      $weight = 0;
      foreach ($theme_regions as $key => $title) {
        $region = new stdClass();
        $region->key = $key;
        $region->title = $title;
        $region->size = 6;
        $regions[] = $region;
      }
      $unassignedsection = new stdClass();
      $unassignedsection->key = 'unassigned';
      $unassignedsection->title = 'Unassigned';
      $unassignedsection->regions = $regions;
      $layout = new stdClass();
      $layout->key = 'default';
      $layout->title = 'Default';
      $layout->sections = array($unassignedsection);
      $this->layouts = array($layout);
    }
  }

  function getRegions() {
    $themes = list_themes();
    if (!empty($themes[$this->theme]->info['regions'])) {
      return $themes[$this->theme]->info['regions'];
    }
    return array();
  }

  function get($key) {
    return theme_get_setting($key, $this->theme);
  }

  /*
   * * Retrieve content from .info file
   */

  function getThemeInfo($key) {
    $themes = list_themes();
    if (!empty($themes[$this->theme]->info[$key])) {
      return $themes[$this->theme]->info[$key];
    }
    return array();
  }

  private function __addRegions() {
    $theme_regions = $this->getThemeInfo('regions');
    foreach ($theme_regions as $key => $title) {
      foreach ($this->layouts as $k => $layout) {
        $region_exists = false;
        $unassigned_section = 0;
        foreach ($layout->sections as $section_index => $section) {
          if ($section->key == 'unassigned') {
            $unassigned_section = $section_index;
          }
          foreach ($section->regions as $region_index => $region) {
            if (!isset($region->key)) {
              unset($section->regions[$region_index]);
              continue;
            }
            if ($region->key == $key) {
              //Update title
              $this->layouts[$k]->sections[$section_index]->regions[$region_index]->title = $title;
              $region_exists = true;
            }
          }
          $section->regions = array_values($section->regions);
        }
        if (!$region_exists) {
          $newregion = new stdClass();
          $newregion->key = $key;
          $newregion->title = $title;
          $newregion->size = 6;
          $this->layouts[$k]->sections[$unassigned_section]->regions[] = $newregion;
        }
      }
    }
  }

  private function __removeRegions() {
    $theme_regions = $this->getThemeInfo('regions');
    $theme_regions_keys = array();
    foreach ($theme_regions as $key => $region) {
      $theme_regions_keys[] = $key;
    }
    foreach ($this->layouts as $k => $layout) {
      $region_exists = false;
      foreach ($layout->sections as $section_index => $section) {
        foreach ($section->regions as $region_index => $region) {
          if (!in_array($region->key, $theme_regions_keys)) {
            unset($this->layouts[$k]->sections[$section_index]->regions[$region_index]);
          }
        }
        $this->layouts[$k]->sections[$section_index]->regions = array_values($this->layouts[$k]->sections[$section_index]->regions);
      }
    }
  }

  function pageRender($ajax = false) {
    if($ajax){
      return render($this->page['page']['content']);
    }
    $this->layout = $this->get_layout();
    if (!isset($this->layouts[$this->layout])) {
      $this->layout = 0;
    }
    $html = "";
    foreach ($this->layouts[$this->layout]->sections as $section) {
      $html .= $this->sectionRender($section);
    }
    return '<div class="dexp-body-inner ' . $this->layouts[$this->layout]->key . '">' . $html . '</div>';
  }

  function sectionRender($section) {
    if (empty($section->regions) || $section->key == 'unassigned') {
      return '';
    }
    $content = '';
    foreach ($section->regions as $region) {
      if ($region_content = $this->regionRender($region)) {
        $content .= $region_content;
      }
    }
    if ($content) {
      return theme('dexp-section', array(
                  'content' => $content,
                  'section' => $section,
              ));
    }
    return "";
  }

  function regionRender($region) {
    $drupal_static = &drupal_static(__FUNCTION__);
    if (!isset($drupal_static[$region->key])) {
        if ($region->key == 'logo') {
            $content = '<div class="col-xs-' . $region->colxs . ' col-sm-' . $region->colsm . ' col-md-' . $region->colmd . ' col-lg-' . $region->collg . '">' . l('<img src="' . $this->page['logo'] . '" alt=""/>', '<front>', array('html' => true, 'attributes' => array('class' => array('site-logo')))) . '</div>';
          } else {
            $content = render($this->page['page'][$region->key]);
          }
        if($content){
            $region_class = drupal_html_class('region-'.$region->key);
            $drupal_static[$region->key] =  '<!-- .'.$region_class.'-->'.PHP_EOL.$content.'<!-- END .'.$region_class.'-->'.PHP_EOL;
        }else{
            $drupal_static[$region->key] = '';
        }
    }
    return $drupal_static[$region->key];
  }

  function getRegion($region_key) {
    $ret = null;
    if (!isset($this->layouts[$this->layout])) {
      $this->layout = 0;
    }
    foreach ($this->layouts[$this->layout]->sections as $section_index => $section) {
      foreach ($section->regions as $region_index => $region) {
        if ($region->key == $region_key) {
          $ret = $region;
          if ($region_key == 'content') {
            drupalexp_calculate_primary($section_index, $region_index);
          }
        }
      }
    }
    return $ret;
  }

  function get_layout() {
    $alias = drupal_get_path_alias($_GET['q']);
    foreach ($this->layouts as $k => $layout) {
      if ($k == 0)
        continue;
      $page_list = isset($layout->pages)?$layout->pages:'';
      if (empty($page_list))
        continue;
      if (drupal_match_path($_GET['q'], $page_list) || drupal_match_path($alias, $page_list)) {
        return $k;
      }
    }
    return 0;
  }

}

function drupalexp_get_theme() {
  $drupal_static = &drupal_static(__FUNCTION__);

  $key = $GLOBALS['theme_key'];
  if (!isset($drupal_static[$key])) {
    $drupal_static[$key] = new druplexp_theme($key);
  }
  return $drupal_static[$key];
}

/**
 * Calculate primary column width
 */
function drupalexp_calculate_primary($section_index, $primary_region_index) {
  $theme = drupalexp_get_theme();
  $devices = array('colxs', 'colsm', 'colmd', 'collg');
  foreach ($devices as $device) {
    $theme->layouts[$theme->layout]->sections[$section_index]->regions[$primary_region_index]->$device = 12;
    foreach ($theme->layouts[$theme->layout]->sections[$section_index]->regions as $region_index => $region) {
      if ($region_index != $primary_region_index) {
        if (element_children($theme->page['page'][$region->key])) {
          $theme->layouts[$theme->layout]->sections[$section_index]->regions[$primary_region_index]->$device -= $theme->layouts[$theme->layout]->sections[$section_index]->regions[$region_index]->$device;
          if ($theme->layouts[$theme->layout]->sections[$section_index]->regions[$primary_region_index]->$device <= 0) {
            $theme->layouts[$theme->layout]->sections[$section_index]->regions[$primary_region_index]->$device = 12;
          }
        }
      }
    }
  }
}
