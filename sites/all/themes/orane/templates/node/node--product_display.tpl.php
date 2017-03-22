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
<div id="node-<?php print $node->nid; ?>" class="product-single <?php print $classes; ?> clearfix"<?php print $attributes; ?>>
    <?php print render($title_prefix); ?>
    <?php print render($title_suffix); ?>

    <div class="row">
        <div class="col-ld-8 col-md-8 col-sm-8 col-xs-12">
          <div class="product-images">
            <?php print render($content['product:field_product_images']);?>
          </div>  
        </div>

        <div class="col-ld-4 col-md-4 col-sm-4 col-xs-12 product-details">
            <h3 class="pull-left"> <?php print $node->title;?></h3>
            <h3 class="price pull-right">
              <?php print render($content['product:commerce_price']); ?>
            </h3>
            
            <div style="clear:both"></div>
            <div class='product-category pull-left'>
              <?php print render($content['field_product_catalog']);?>
            </div>
            <div class='product-availbility pull-right'>
              <div style='display:inline-block'><?php print render($content['field_availbility']);?></div>
            </div>
            <div style="clear:both"></div>
            
            <div class="shop-divider"></div>
            
            <div class="rating">
                  <?php print render($content['field_product_rating']);?>
                 <span class="count-review"><?php print $comment_count;?> Reviews</span> 
            </div>
            <div class="shop-divider"></div>
            <p><?php print substr(strip_tags(render($content['body'])), 0, 200);?></p>
            
            <div class="shop-divider"></div>
            
            <?php print render($content['field_product']);?>
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
            <div class="shop-divider"></div>
        </div>
    </div>
    
    <div class="dexp_tab_wrapper default clearfix" id="dexp_tab_wrapper_product_detail" style="padding-top:20px"> 
        <ul class="nav nav-tabs">
            <li class="first active"><a data-toggle="tab" href="#product_description">
                <i class="tab-icon fa "></i>Description</a></li>
            <li class=""><a data-toggle="tab" href="#product_additional">
                <i class="tab-icon fa "></i>Specification</a></li>
            <li class="last"><a data-toggle="tab" href="#product_review">
                <i class="tab-icon fa "></i>Review (<?php print $comment_count;?>)</a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="product_description"> 
                <?php print render($content['body']);?>
            </div>
            <div class="tab-pane" id="product_additional">
                <table class="table table-bordered table-hover">
                    <tbody><tr>
                      <th>Product</th>
                      <th>Description</th>
                    </tr>
                    <tr>
                      <td>Size</td>
                      <td><?php print render($content['product:field_size']);?></td>
                    </tr>
                    <tr>
                      <td>Color</td>
                      <td><?php print render($content['product:field_color']);?></td>
                    </tr>
                  </tbody>
                </table>
            </div>
            <div class="tab-pane" id="product_review">
                 <?php print render ($content['comments']); ?>    
            </div>
        </div>
    </div>
    
    <div class="b60"></div>
</div>
