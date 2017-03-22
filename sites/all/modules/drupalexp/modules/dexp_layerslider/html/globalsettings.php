<fieldset class="form-wrapper">
  <legend><span class="fieldset-legend">Global Settings</span></legend>
  <div class="form-global-setting-item">
    <label>Delay</label>
    <input name="delay" class="form-text global-settings"/>
    <div class="description">The time one slide stays on the screen in Milliseconds. Global Setting. You can set per Slide extra local delay time via the data-delay in the slide element (Default: 9000)</div>
  </div>
  <div class="form-global-setting-item">
    <label>Slide width</label>
    <input name="startwidth" class="form-text global-settings"/>
    <div class="description">This Width of the Grid where the Captions are displayed in Pixel. This Width is the Max Width of Slider in Responsive Layout.  In Fullscreen and in FullWidth Layout the Gird will be centered Horizontally in case the Slider is wider then this value.</div>
  </div>
  <div class="form-global-setting-item">
    <label>Slide height</label>
    <input name="startheight" class="form-text global-settings"/>
    <div class="description">This Height of the Grid where the Captions are displayed in Pixel. This Height is the Max height of Slider in Fullwidth Layout and in Responsive Layout.  In Fullscreen Layout the Gird will be centered Vertically in case the Slider is higher then this value.</div>
  </div>
</fieldset>
<fieldset class="form-wrapper">
  <legend><span class="fieldset-legend">Layout Style</span></legend>
  <div class="form-global-setting-item">
    <label>Full width</label>
    <select name="fullWidth" class="form-select global-settings">
      <option value="on">Yes</option>
      <option value="off">No</option>
    </select>
  </div>
  <div class="form-global-setting-item">
    <label>Full screen</label>
    <select name="fullScreen" class="form-select global-settings">
      <option value="on">Yes</option>
      <option value="off">No</option>
    </select>
  </div>
  <div class="form-global-setting-item">
    <label>Full Screen Offset of Container</label>
    <input name="fullScreenOffsetContainer" class="form-text global-settings"/>
    <div class="description"> The value is a Container ID or Class i.e. "#topheader"  - The Height of Fullheight will be increased with this Container height!</div>
  </div>
  <div class="form-global-setting-item">
    <label>Shadow</label>
    <input name="shadow" class="form-text global-settings"/>
    <div class="description"> Possible values: 0,1,2,3  (0 == no Shadow, 1,2,3 - Different Shadow Types)</div>
  </div>
</fieldset>
<fieldset class="form-wrapper">
  <legend><span class="fieldset-legend">Navigation Settings</span></legend>
  <div class="form-global-setting-item">
    <label>Pause on hover</label>
    <select name="onHoverStop" class="form-select global-settings">
      <option value="on">Yes</option>
      <option value="off">No</option>
    </select>
  </div>
  <!--
  <div class="form-global-setting-item">
    <label>Thumbnail width</label>
    <input name="thumbWidth" class="form-text global-settings"/>
    <div class="description">The width of the thumbs in pixel. Thumbs are not responsive from basic. For Responsive Thumbs you will need to create media query based thumb sizes.</div>
  </div>
  <div class="form-global-setting-item">
    <label>Thumbnail height</label>
    <input name="thumbHeight" class="form-text global-settings"/>
    <div class="description">The height of the thumbs in pixel. Thumbs are not responsive from basic. For Responsive Thumbs you will need to create media query based thumb sizes.</div>
  </div>
  <div class="form-global-setting-item">
    <label>Thumbnail amount</label>
    <input name="thumbAmount" class="form-text global-settings"/>
    <div class="description">The Amount of visible Thumbs in the same time.  The rest of the thumbs are only visible on hover, or at slide change.</div>
  </div>
  <div class="form-global-setting-item">
    <label>hideThumbs</label>
    <input name="hideThumbs" class="form-text global-settings"/>
    <div class="description"> 0 - Never hide Thumbs.  1000- 100000 (ms) hide thumbs and navigation arrows, bullets after the predefined ms  (1000ms == 1 sec,  1500 == 1,5 sec etc..)</div>
  </div>
  -->
  <div class="form-global-setting-item">
    <label>Navigation type</label>
    <select name="navigationType" class="form-select global-settings">
      <option value="bullet">Bullet</option>
      <option value="thumb">Thumbnail</option>
      <option value="none">None</option>
    </select>
  </div>
  <div class="form-global-setting-item">
    <label>Navigation Align</label>
    <select name="navigationHAlign" class="form-select global-settings">
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
    </select>
  </div>
  <div class="form-global-setting-item">
    <label>Navigation Valign</label>
    <select name="navigationVAlign" class="form-select global-settings">
      <option value="top">Top</option>
      <option value="center">Center</option>
      <option value="bottom">Bottom</option>
    </select>
  </div>
  <div class="form-global-setting-item">
    <label>Navigation arrows</label>
    <select name="navigationArrows" class="form-select global-settings">
      <option value="verticalcentered">verticalcentered</option>
      <option value="nexttobullets">nexttobullets</option>
      <option value="solo">solo</option>
    </select>
    <div class="description">Display position of the Navigation Arrows (Default: "nexttobullets"): Nexttobullets - arrows added next to the bullets left and right. Solo - arrows can be independent positioned, see further options</div>
  </div>
  <div class="form-global-setting-item">
    <label>Navigation style</label>
    <select name="navigationStyle" class="form-select global-settings">
      <option value="preview1">preview1</option>
      <option value="preview2">preview2</option>
      <option value="preview3">preview3</option>
      <option value="preview4">preview4</option>
      <option value="round">round</option>
      <option value="square">square</option>
      <option value="round-old">round-old</option>
      <option value="square-old">square-old</option>
      <option value="navbar-old">navbar-old</option>
    </select>
  </div>
  <div class="form-global-setting-item">
    <label>Timer</label>
    <select name="timer" class="form-select global-settings">
      <option value="">None</option>
      <option value="top">Top</option>
      <option value="bottom">Bottom</option>
    </select>
  </div>
  <div class="form-global-setting-item">
    <label>Overlay Class</label>
    <input name="dottedOverlay" class="form-text global-settings"/>
    <div class="description">Possible Values: "none", "twoxtwo", "threexthree", "twoxtwowhite", "threexthreewhite" - Creates a Dotted Overlay for the Background images extra. Best use for FullScreen / fullwidth sliders, where images are too pixaleted.</div>
  </div>
</fieldset>
