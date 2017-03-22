<?php
/**
* @file field.tpl.php
* Default template implementation to display the value of a field.
*
* This file is not used and is here as a starting point for customization only.
* @see theme_field()
*
* Available variables:
* - $items: An array of field values. Use render() to output them.
* - $label: The item label.
* - $label_hidden: Whether the label display is set to 'hidden'.
* - $classes: String of classes that can be used to style contextually through
* CSS. It can be manipulated through the variable $classes_array from
* preprocess functions. The default values can be one or more of the
* following:
* - field: The current template type, i.e., "theming hook".
* - field-name-[field_name]: The current field name. For example, if the
* field name is "field_description" it would result in
* "field-name-field-description".
* - field-type-[field_type]: The current field type. For example, if the
* field type is "text" it would result in "field-type-text".
* - field-label-[label_display]: The current label position. For example, if
* the label position is "above" it would result in "field-label-above".
*
* Other variables:
* - $element['#object']: The entity to which the field is attached.
* - $element['#view_mode']: View mode, e.g. 'full', 'teaser'...
* - $element['#field_name']: The field name.
* - $element['#field_type']: The field type.
* - $element['#field_language']: The field language.
* - $element['#field_translatable']: Whether the field is translatable or not.
* - $element['#label_display']: Position of label display, inline, above, or
* hidden.
* - $field_name_css: The css-compatible field name.
* - $field_type_css: The css-compatible field type.
* - $classes_array: Array of html class attribute values. It is flattened
* into a string within the variable $classes.
*
* @see template_preprocess_field()
* @see theme_field()
*
* @ingroup themeable
*/
?>

<?php if ($element['#view_mode'] == 'default' || $element['#view_mode'] == 'node_full') :?>
  <?php $path = drupal_get_path('theme', 'orane');
  drupal_add_js($path.'/assets/js/jquery.elevateZoom-3.0.8.min.js');?>
<ul id="gal1">
<?php

  $first_image = "";
  foreach ($items as $delta => $item): ?>
    <?php $path_image = file_create_url($item['#item']['uri']); ?>
      <?php if ($delta == 0) {
        $first_image = $path_image;
      } ?>
      <li>
        <a class="<?php if ($delta == 0) print "active"; ?>" href="#" data-image="<?php print $path_image;?>" data-zoom-image="<?php print $path_image;?>"> 
          <img id="img_<?php print $delta;?>" src="<?php print $path_image;?>" alt="" /> 
        </a>
      </li>
  <?php endforeach; ?>
</ul>
<div class="shop-single">
  <img id="zoom" src="<?php print $first_image;?>" data-zoom-image="<?php print $first_image;?>" alt="">
</div>
<script>
(function($) {
  Drupal.behaviors.orane_zoom = {
    attach: function (context, settings) {
      jQuery("#zoom").elevateZoom({gallery:'gal1', cursor: 'pointer', galleryActiveClass: 'active', });
    }
  };
})(jQuery);
</script>
<?php else: ?>
<?php print render($items[0]); ?>
<?php endif; ?>

