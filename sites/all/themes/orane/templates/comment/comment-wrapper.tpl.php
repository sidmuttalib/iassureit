<?php

/**
 * @file
 * Default theme implementation to provide an HTML container for comments.
 *
 * Available variables:
 * - $content: The array of content-related elements for the node. Use
 *   render($content) to print them all, or
 *   print a subset such as render($content['comment_form']).
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default value has the following:
 *   - comment-wrapper: The current template type, i.e., "theming hook".
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * The following variables are provided for contextual information.
 * - $node: Node object the comments are attached to.
 * The constants below the variables show the possible values and should be
 * used for comparison.
 * - $display_mode
 *   - COMMENT_MODE_FLAT
 *   - COMMENT_MODE_THREADED
 *
 * Other variables:
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 *
 * @see template_preprocess_comment_wrapper()
 *
 * @ingroup themeable
 */
?>
<div id="comments_wrapper" class="<?php print $classes; ?>"<?php print $attributes; ?>>
   
  <?php if($node->type === "product_display") :?>
    <?php print render($content['comments']); ?>
    <?php if ($content['comment_form']): ?>
     <hr/>
     <h3 class="text-center"><?php print t('SUBMIT YOUR REVIEW');?></h3>
     <?php print render($content['comment_form']); ?>
    <?php endif; ?> 
  <?php else: ?>      
    <?php if ($content['comments']): ?> 
      <h3><i class="fa fa-comments fa"></i><?php print t(' Comments'); ?><?php print ' ('.$node->comment_count.')' ?></h3>
      <div class="comments">
        <?php print render($content['comments']); ?>
      </div>  
    <?php endif; ?>

    <?php if ($content['comment_form']): ?>
      <h3>Leave a comment</h3>
      <?php print render($content['comment_form']); ?>
    <?php endif; ?>
  <?php endif;?>      
</div>
