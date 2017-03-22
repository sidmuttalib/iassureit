<?php global $base_url;?>
<div id="slidedesign" style="margin:0 auto;width:960px; height: 400px; border: 1px solid #ccc; list-style: none;position: relative;">

</div>
<div id="preview" style="margin: 0 auto; display: none">
  <iframe style="overflow: hidden" src="" width="100%" height="100%" frameboder="0"></iframe>
</div>
<div style="margin: 0 auto; text-align: center">
<input type="button" class="form-submit" value="Preview" id="enter-preview"/>
<input type="button" class="form-submit" style="display: none;" value="Exit Preview" id="exit-preview"/>
</div>
<div class="vertical-tabs clearfix">
  <div class="vertical-tabs-list">
  <ul id="layerslist">
  </ul>
  <div class="clearfix"></div>
  <a href="#" id="addLayer">Add Layer</a>
  </div>
  <div class="vertical-tabs-panes vertical-tabs-processed" id="layeroptions" style="display: none">
    <fieldset class="fieldset-wrapper" style="border: none; padding:0; margin: 0 0 10px 0">
			Title <input type="text" name="title" class="form-text layer-option"/>
      <input type="hidden" class="layer-option" name="content" value=""/>
      <div id="content-type">
        <ul>
          <li data-type="text"><a href="#content-text">Text</a></li>
          <li data-type="image"><a href="#content-image">Image</a></li>
          <li data-type="video"><a href="#content-video">Video</a></li>
        </ul>
        <div id="content-text">
          <table width="100%">
            <tr>
              <td width="33%">Style <?php print dexp_layerslider_select('text_style', $captionclasses,'layer-option'); ?></td>
              <td width="67%">
                <textarea class="layer-option form-textarea" name="text" id="layer-text"></textarea>
              </td>
            </tr>
          </table>
        </div>
        <div id="content-image">
          <table>
            <tr>
              <td>
                Image <input name="image" data-uri="[name=image_uri]" class="layer-option file-imce form-text" id="imagelayer" onchange="insertImageToLayer(this.value)"/>
								<input type="hidden" name="image_uri" class="layer-option"/>
              </td>
            </tr>
          </table>
        </div>
        <div id="content-video">
          <?php include 'video.php'; ?>
        </div>
      </div>
      <input name="width" type="hidden" class="form-text layer-option">
      <input name="height" type="hidden" class="form-text layer-option">
      <table>
          <tr>
              <td>Top</td>
              <td><input name="top" class="form-text layer-option"></td>
              <td>Offset</td>
              <td><input name="voffset" class="form-text layer-option"></td>
          </tr>
          <tr>
              <td>Left</td>
              <td><input name="left" class="form-text layer-option"></td>
              <td>Offset</td>
              <td><input name="hoffset" class="form-text layer-option"></td>
          </tr>
        <tr>
          <td>Custom CSS</td>
          <td colspan="3">
            <textarea name="custom_css" class="form-textarea layer-option"></textarea>
          </td>
        </tr>
	<tr>
          <td>Custom Class</td>
          <td colspan="3">
            <input name="custom_class" class="form-text layer-option" style="max-width:400px; width:400px;"/>
          </td>
        </tr>
      </table>
    </fieldset>
    <fieldset class="form-wrapper" style="border: none; padding:0; margin: 0 0 10px 0">
      <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
        <li class="ui-state-default ui-corner-top"><a href="#">Layer  Transition Effects</a></li>
      </ul>
      <table>
        <tr>
          <td width="25%"><label>Incoming Effect</label>
        <?php print dexp_layerslider_select('incomingclasses', $incomingclasse,'layer-option'); ?></td>
          <td colspan="3"><label>Custom Incoming Effect</label><input type="text" class="layer-option form-text" name="customin" style="width:100%;max-width:100%"/></td>
        </tr>
        <tr>
          <td width="25%"><label>Outgoing Effect</label>
        <?php print dexp_layerslider_select('outgoingclasses', $outgoingclasses,'layer-option'); ?></td>
          <td colspan="3"><label>Custom Outgoing Effect</label><input type="text" class="layer-option form-text" name="customout" style="width:100%;max-width:100%"/></td>
        </tr>
        <tr>
          <td width="25%">
            <label>Speed</label>
            <input name="data_speed" class="layer-option form-text"/>
          </td>
          <td width="25%"><label>Start</label>
        <input name="data_start" class="layer-option form-text"/></td>
          <td width="25%"></td>
          <td width="25%"></td>
        </tr>
        <tr>
          <td><label>End</label>
        <input name="data_end" class="layer-option form-text"/></td>
          <td><label>Easing</label>
        <?php print dexp_layerslider_select('data_easing', $dataeasing,'layer-option'); ?></td>
          <td><label>End Easing</label>
        <?php print dexp_layerslider_select('data_endeasing', $dataendeasing,'layer-option'); ?></td>
          <td></td>
        </tr>
      </table>
    </fieldset>
  </div>
  <div style="clear: both;"></div>
</div>
