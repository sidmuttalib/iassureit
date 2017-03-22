<?php 
global  $base_url;
$twitter_username = $settings['widget_twitter_username'];
?>
<script type="text/javascript">
  var $html = '';
  jQuery(document).ready(function(){
    jQuery('#twitter_update_list').html('Loading...');
        jQuery.getJSON('<?php print $base_url;?>/twitter.php', function(data){
        for(var i=0; i < data.length; i++){
          $html += '<li>'+data[i].text+'</li>';
        }
        jQuery('#twitter_update_list').html($html);
    });
  });
</script>
<div class="drupalexp_tweet_widget widget_twitter tweet">
  <ul id="twitter_update_list">
      
  </ul>
</div>