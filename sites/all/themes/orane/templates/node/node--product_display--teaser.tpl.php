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
<article id="node-<?php print $node->nid; ?>" class="product-teaser <?php print $classes; ?> clearfix"<?php print $attributes; ?>>
  <?php print render($title_prefix); ?>
  <?php print render($title_suffix); ?>
  <?php $cart = $content['field_product'];?>
  <div class='thumbnail_container'>
    <div class="ribbon-wrapper">
      <?php if (isset($content['product:field_sale_event'][0])):?>
        <div class="left-ribbon"><?php print ($content['product:field_sale_event'][0]['#markup']);?></div>
      <?php endif; ?>
      <?php if (isset($content['product:field_product_characteristics'][0])):?>  
        <div class="right-ribbon"><?php print_r ($content['product:field_product_characteristics'][0]['#title']);?></div>    
      <?php endif; ?>
    </div>
    <?php
    if (isset($content['product:field_product_images'])) {
      print render($content['product:field_product_images']);
    }
    ?>
    <div class='product-overlay'>
      
        <?php print render($cart); ?>
      
      <a role="button" class="dexp-shortcodes-button btn btn-xs style01" href="<?php print $node_url; ?>">View Large</a>
    </div>
  </div>
  
  <section class="product-content">
    <div class="col-xs-7 no-padd">
      <h5 class='title'>
        <a href="<?php print $node_url; ?>"><?php print $title; ?></a>
      </h5>
      <div class='product-category hide-list-view'>
        <?php print render($content['field_product_catalog']);?>
      </div>
    </div>
    <div class="col-xs-5 no-padd">
      <div class="rating text-right hide-list-view">
          <?php print render($content['field_product_rating']); ?>
      </div>
      <div class="price text-right">
        <?php print render($content['product:commerce_price']); ?>
      </div>
    </div>
    
    <div class="col-xs-7 no-padd">
      <div class='product-category hide-grid-view'>
        <?php print render($content['field_product_catalog']);?>
      </div>
    </div>
    
    <div class="col-xs-5 no-padd">
      <div class='product-availbility hide-grid-view text-right'>
          Availbility: <div style='display:inline-block'><?php print render($content['field_availbility']);?></div>
      </div>
    </div>
    
    <div class="col-xs-12 no-padd">
      <div class='short-desc'>
        <?php print substr(strip_tags(render($content['body'])), 0, 200);?>
      </div>
      
    </div>
    
    <div class="hide-grid-view">
      <div class="pull-left">
        <div class="rating">
          <?php print render($content['field_product_rating']); ?>
        </div>
        <div class="count-review"><?php print $comment_count;?> Reviews
        </div>
      </div>  
      
      <div class="pull-right">
        <?php //print render($cart); ?>
        <div class='wishlist'>
        <?php
          if (isset($node->field_product[$node->language])) {
            $product = $node->field_product[$node->language][0]['product_id'];
          } else {
            $product = $node->field_product['und'][0]['product_id'];
          }
          print flag_create_link('wishlist', $product);
        ?>
        </div>  
      </div>  
    </div>
    <div style='clear:both'/>
  </section>
</article>

