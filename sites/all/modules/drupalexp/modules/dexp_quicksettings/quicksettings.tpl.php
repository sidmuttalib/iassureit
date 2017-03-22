<?php
  $backgrounds = array('bg1','bg2','bg3','bg4','bg5','bg6','bg7','bg8');
  $current_path = current_path();
?>
<span class="quicksettings_toggle"></span>
<div class="dexp_settings">
  <h3>Layout Style</h3>
  <select class="dexp_layout form-select" name="setting_layout">
    <option value="wide">Wide</option>
    <option value="boxed">Boxed</option>
  </select>
  <!--
  <h3>Header</h3>
  <select class="dexp_header form-select" name="setting_header">
    <option value="">Header White</option>
    <option value="header-color">Header Color</option>
    <option value="header-dark">Header Dark</option>
  </select>
  -->
  <h3>Direction</h3>
  <select class="dexp_direction form-select" name="setting_direction">
    <option value="ltr">LTR</option>
    <option value="rtl">RTL</option>
  </select>
  <h3>Predefined Colors</h3>
  <ul class="presets">
    <?php foreach ($presets as $k => $preset): ?>
    <li class="<?php print drupal_html_class($preset->key);?>"><?php print l('<span style="background-color:' . $preset->link_color . '"></span>', 'drupalexp/preset/' . ($k + 1), array('html' => true,'query'=>array('destination'=>$current_path))); ?></li>
    <?php endforeach; ?>
  </ul>
  <h3>Background</h3>
  <ul class="dexp_background">
    <?php foreach ($backgrounds as $background): ?>
      <li><span class="<?php print $background;?>"></span></li>
    <?php endforeach; ?>
  </ul>
  <div class="clearfix"></div>
</div>
<script type="text/javascript">
  jQuery(document).ready(function($){
    $('.quicksettings_toggle').click(function(){
      $('#block-dexp-quicksettings-dexp-quicksettings').toggleClass('open');
    })
    $('select.dexp_layout').change(function(){
      $('body').removeClass('boxed wide').addClass($(this).val());
      $(window).trigger('resize');
    });
    if($('body').hasClass('boxed')){
      $('select.dexp_layout').val('boxed').trigger('change');
    }else{
      $('select.dexp_layout').val('wide').trigger('change');
    }
    $('select.dexp_direction').change(function(){
      $('body').removeClass('ltr rtl').addClass($(this).val());
    });
    $('select.dexp_header').change(function(){
      $('body').removeClass('header-color header-dark').addClass($(this).val());
    });
    $('ul.dexp_background span').click(function(){
      if($('select.dexp_layout').val()=='wide'){
        alert('Please select boxed layout');
        return;
      }
      $('body').removeClass('bg1 bg2 bg3 bg4 bg5 bg6 bg7 bg8').addClass($(this).attr('class'));
    })
  })
</script>