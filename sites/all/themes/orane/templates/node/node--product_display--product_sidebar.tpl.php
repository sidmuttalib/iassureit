<?php
/**
 * @file
 * Default theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 * or print a subset such as render($content['field_example']). Use
 * hide($content['field_example']) to temporarily suppress the printing of a
 * given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 * calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct URL of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 * template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 * CSS. It can be manipulated through the variable $classes_array from
 * preprocess functions. The default values can be one or more of the
 * following:
 * - node: The current template type; for example, "theming hook".
 * - node-[type]: The current node type. For example, if the node is a
 * "Blog entry" it would result in "node-blog". Note that the machine
 * name will often be in a short form of the human readable label.
 * - node-teaser: Nodes in teaser form.
 * - node-preview: Nodes in preview mode.
 * The following are controlled through the node publishing options.
 * - node-promoted: Nodes promoted to the front page.
 * - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 * listings.
 * - node-unpublished: Unpublished nodes visible only to administrators.
 * - $title_prefix (array): An array containing additional output populated by
 * modules, intended to be displayed in front of the main title tag that
 * appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 * modules, intended to be displayed after the main title tag that appears in
 * the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type; for example, story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 * into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 * teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode; for example, "full", "teaser".
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 * main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined; for example, $node->body becomes $body. When needing to
 * access a field's raw values, developers/themers are strongly encouraged to
 * use these variables. Otherwise they will have to explicitly specify the
 * desired field language; for example, $node->body['en'], thus overriding any
 * language negotiation rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
 *
 * @ingroup themeable
 */
?>
<div id="node-<?php print $node->nid; ?>" class="product_sidebar <?php print $classes; ?> clearfix"<?php print $attributes; ?>>
  <?php print render($title_prefix); ?>
  <?php print render($title_suffix); ?>
  <div class="row">
    <div class="col-ld-4 col-lg-4 col-sm-4 col-xs-4">
      <div class="icon-overlay">
        <?php
        if (isset($content['product:field_product_images'][0])) {
          print render($content['product:field_product_images'][0]);
        }
        ?>

        <?php
        $lightboxrel = 'product_teaser_alt_2_' . $node->nid;
        if (isset($content['product:field_product_images']['#object']->field_product_images[$node->language])) {
          $product_images = $content['product:field_product_images']['#object']->field_product_images[$node->language];
        } else {
          $product_images = $content['product:field_product_images']['#object']->field_product_images['und'];
        }
        if ($product_images) {
          $image_path = '';
          foreach ($product_images as $k => $product_image) {
            if (isset($product_image['uri'])) {
              $image_path = file_create_url($product_image['uri']);
            }
            if ($k == 0) {
              print '<a href="' . $image_path . '" rel="lightbox[' . $lightboxrel . ']"><i class="fa fa-plus"></i></a>';
            } else {
              print '<a href="' . $image_path . '" rel="lightbox[' . $lightboxrel . ']" style="display:none">&nbsp;</a>';
            }
          }
        }
        ?>
      </div>
    </div>
    <div class="col-ld-8 col-lg-8 col-sm-8 col-xs-8">
      <div class="title">
        <a href="<?php print $node_url; ?>"><?php print $node->title; ?></a>   
      </div>
      <div class="product-category">
        <?php print render($content['field_product_catalog']); ?>
      </div>  
      <div class="rating">
        <?php print render($content['field_product_rating']); ?>
      </div>    
      <div class="price">  
        <?php print render($content['product:commerce_price']); ?>
      </div>  
    </div>  
  </div>  
</div>
