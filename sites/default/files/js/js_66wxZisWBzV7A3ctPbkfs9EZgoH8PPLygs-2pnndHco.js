// $Id: contentanalysis.js,v 1.1.2.7 2010/11/09 21:50:14 tomdude48 Exp $
var contentanalysis = contentanalysis || {};

(function ($, $$) {
	$.extend($$, {
		contentanalysisPrevAnalyzerTab: '',
		contentanalysisPrevReportTab: '',
		contentanalysisCurrentAnalyzerTab: '',
		contentanalysisCurrentReportTab: '',
		contentanalysisReportActiveTab: {},
		
		init: function() {
			$$.contentanalysis_contentanalysisui();
		},
		
		contentanalysis_contentanalysisui: function() {
		    if($('#modalContent div.analyzers h3.analyzer').size() > 0) {
		        $$.contentanalysis_show_analyzer_tab($('div.analyzers h3.analyzer').get(0));
		        $('div.analyzers h3.analyzer').mousedown(function () {
		        	$$.contentanalysis_show_analyzer_tab(this);
		        }) 
		        $('h3.contentanalysis-report-tab').mousedown(function () { 
		        	$$.contentanalysis_show_report_tab(this);
		        })
		    }	
		},

		contentanalysis_back: function() {
			$$.contentanalysis_show_analyzer_tab(contentanalysisPrevAnalyzerTab);
		  //contentanalysis_show_report_tab(contentanalysisPrevReportTab);
		},

		contentanalysis_show_analyzer_tab: function (theTab){
		  $('div.analysis-results div.analyzer-analysis:eq(' + $('.analyzers h3.analyzer').index(theTab) + ')').children('.content-analysis-tab:first').addClass('active');
		  $('div.analysis-results div.analyzer-analysis').hide();
		  $('.analyzers h3.analyzer').removeClass('active');
		  $(theTab).addClass('active');
		  $('div.analysis-results div.analyzer-analysis:eq(' + $('.analyzers h3.analyzer').index(theTab) + ')').show();
		  $('.content-analysis-results').hide();
		
		  var id = $(theTab).attr('id');
		  var e = id.split('-');
		  var analyzer = e[3];
		  
		  if($$.contentanalysisReportActiveTab[analyzer]) {
		    $$.contentanalysis_show_report_tab($('#contentanalysis-report-tab-' + analyzer + '-' + $$.contentanalysisReportActiveTab[analyzer]));
		  }
		  else {
		    $$.contentanalysis_show_report_tab($('#contentanalysis-report-tab-' + analyzer + '-0'));
		  }
		  $$.contentanalysisPrevAnalyzerTab = $$.contentanalysisCurrentAnalyzerTab;
		  $$.contentanalysisCurrentAnalyzerTab = theTab;  
		},

		contentanalysis_show_report_tab: function (theTab){
		  var id = $(theTab).attr('id');
		  var e = id.split('-');
		  $$.contentanalysisReportActiveTab[e[3]] = e[4];
		  $('h3.contentanalysis-report-tab').removeClass('active');  
		  $(theTab).addClass('active');
		  $('.contentanalysis-results-section').hide();
		
		  var tabs = $("#contentanalysis-report-tabs-" + e[3]);
		  //tabs.css('border','2px solid red');
		  var pos = $("#contentanalysis-report-tabs-" + e[3]).position(); 
		  var offset = $("#contentanalysis-report-tabs-" + e[3]).offset(); 
		  var height = tabs.height();
		  var top = (pos.top+height)+"px";
		  var left = (pos.left)+"px";
		  
		  var sec_id = id.replace('tab', 'results');
		  var result_id = sec_id.replace('-'+e[4],'')
		  //$('#' + result_id).css({'top': top, 'left': left}); 
		  $('#' + result_id).css('top', top); 
		  //$('#' + result_id).css('border', '2px solid green'); 
		  $('#' + sec_id).show();
		//alert("pos.left="+pos.left+",pos.top="+pos.top+",offset.left="+offset.left+",offset.top="+offset.top);
		  $$.contentanalysisPrevReportTab = $$.contentanalysisCurrentReportTab;
		  $$.contentanalysisCurrentReportTab = theTab; 
		},

		// called from inline Analyze content button
		contentanalysis_inline_analysis: function() {
		  Drupal.settings.contentanalysis.display_dialog = 0;
		  Drupal.settings.contentanalysis.display_inline = 1;
		  //$('#contentanalysis-ininline-analysis-button').after('<span class="throbber">Loading...</span>');
		  //$('#contentanalysis-ininline-analysis-button').after(Drupal.settings.contentanalysis.throbber);
		  $('#contentanalysis-buttons').after('<div class="ahah-progress ahah-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">' + Drupal.t('Analyzing...') + '</div></div>');
		  $$.contentanalysis_analyze();
		},

		// called from inline Analyze content button
		contentanalysis_dialog_analysis: function() {
		  Drupal.settings.contentanalysis.display_dialog = 1;
		  Drupal.settings.contentanalysis.display_inline = 0;
		  $$.contentanalysis_analyze();
		},

		// called from inline Analyze content button
		contentanalysis_full_analysis: function() {
		  Drupal.settings.contentanalysis.display_dialog = 1;
		  Drupal.settings.contentanalysis.display_inline = 1;
		  
		  $$.contentanalysis_analyze();
		},

		// called from inline Analyze content button
		contentanalysis_refresh_analysis: function(analyzer) {
		  Drupal.settings.contentanalysis.display_dialog = 0;
		  Drupal.settings.contentanalysis.display_inline = 1;
		  //$('.contentanalysis-refresh-link-' + analyzer).replaceWith('<span class="throbber">Loading...</span>');
		  $('.contentanalysis-refresh-link-' + analyzer).replaceWith('<div class="ahah-progress ahah-progress-throbber"><div class="throbber">&nbsp;</div></div>');
		  $$.contentanalysis_analyze(analyzer);
		},

		contentanalysis_analyze: function(analyzer_override) {
		  // if TinyMCE is used, turn off and on to save body text to textarea
		  var data = { 
		    'nid': -1,
		    'node_type': -1,
		    'source': -1,
		    'analyzers':-1,
		    'title': -1, 
		    'body': -1,
		    'body_summary': -1,
		    'page_title':-1, 
		    'meta_title':-1,
		    'meta_keywords':-1, 
		    'meta_description':-1,
		    'path_alias': -1,
		    'path_pathauto': -1,
		    'url': -1,
		    'page': -1,
		    'body_input_filter': -1,
		    'hidden': -1,    
		    'code': Drupal.settings.contentanalysis.code,
		    'action': -1
		  };
		  if(analyzer_override) {
		    data.action = 'refresh';
		  }
		  if ($('#contentanalysis-page-analyzer-form').html()) {
		    data.source = 'admin-form';
		    data.body = $('[name=input]').val()
		    data.nid = $('[name=input_nid]').val()
		    data.url = $('[name=input_url]').val()
		    if(data.body == '') {
		      data.body = -1;
		    }
		    if(data.nid == '') {
		      data.nid = -1;
		    }
		    if(data.url == '') {
		      data.url = -1;
		    }    
		  } else if ($('.node-form').html()) {
		    data.source = 'node-edit-form';
		    // Turn off TinyMCE if enabled
		    if(typeof tinyMCE == 'object') {
		    	tinyMCE.get('edit-body-und-0-value').hide();
		    }
		    // Turn off CKEditor if any.
		    var ckeditor = false;
		    if ($('#cke_edit-body-und-0-value').html()) {
		      $('#wysiwyg-toggle-edit-body-und-0-value').click();
		      ckeditor = true;
		    }
		
		    data.title = $('#edit-title').val();
		    data.body = $('#edit-body-und-0-value').val();
		    if ($('#edit-body-und-0-summary').val() != null) {
		      data.body_summary = $('#edit-body-und-0-summary').val();
		    } 
		    data.nid = Drupal.settings.contentanalysis.nid
		    data.node_type = Drupal.settings.contentanalysis.node_type
		    data.body_input_filter = $("select[name='body[und][0][format]'] option:selected").val();
		    
		    if ($('#edit-page-title').val() != null) {
		      data.page_title = $('#edit-page-title').val();
		    }    
		    // check if metatag module fields exist
		    if ($('#edit-metatags-title-value').val() != null) {
		      data.meta_title = $('#edit-metatags-title-value').val();
		    }
		    if ($('#edit-metatags-keywords-value').val() != null) {
		      data.meta_keywords = $('#edit-metatags-keywords-value').val();
		    }
		    if ($('#edit-metatags-description-value').val() != null) {
		      data.meta_description = $('#edit-metatags-description-value').val();
		    }
		    if ($('#edit-path-alias').val() != null) {
		      data.url = window.location.host + Drupal.settings.contentanalysis.base_path + $('#edit-path-alias').val();
		      data.path_alias = $('#edit-path-alias').val();
		    }
		    if ($("input[name='path[pathauto]']:checked").val() != null) {
		    	data.path_pathauto = 1;
		    }
		    // Turn back on tinyMCE
		    if(typeof tinyMCE == 'object') {
		    	tinyMCE.get('edit-body-und-0-value').show();
		    }	
		    // Turn back on CKEditor if needed.
		    if (ckeditor) {
		      $('#wysiwyg-toggle-edit-body-und-0-value').click();
		    }
		
		  } else {
		    data.source = 'page-link';
		    data.page = $('html').html()  
		    data.url = window.location.href
		  }
		  if(Drupal.settings.contentanalysis.hidden != null) {
		    data.hidden = Drupal.settings.contentanalysis.hidden;
		  }
		  
		  //alert('data.nid ' + data.nid)
		  var analyzers_arr = new Array();
		  if(analyzer_override) {
		    data.analyzers = analyzer_override;
		    analyzers_arr[0] = data.analyzers; 
		  }
		  else if($('#contentanalysis_analyzers_override input').val() != null) {    
		    data.analyzers = $('#contentanalysis_analyzers_override input').val();
		    analyzers_arr[0] = data.analyzers;
		  } 
		  else {
		    var i = 0;
		    $('#contentanalysis_analyzers .form-checkbox:checked').each ( function () {  
		      var expr = new RegExp(/\[[^\]]+\]/);
		      analyzers_arr[i] = expr.exec($(this).attr('name'))[0].replace(']', '').replace('[','');    
		      i++;
		    })
		    data.analyzers = analyzers_arr.join(',');
		  }
		  // call contentanalysis_data for enabed analyzers
		  for(var i in analyzers_arr) {
		    var aid = analyzers_arr[i];
		    var module = Drupal.settings.contentanalysis.analyzer_modules[aid].module;
		    if (eval('typeof ' + module + '_contentanalysis_data == "function"')) {
		      d = eval(module + '_contentanalysis_data')(aid, data);
		      for(var k in d) {
		        eval('data.ao_'+aid+'_'+k+' = "'+d[k]+'";');
		      }
		    }
		  }  
		  $('#contentanalysis-buttons').hide(); 
		  $.ajax({
		    type: 'POST',
		    url: Drupal.settings.contentanalysis.analyze_callback,
		    data: data,
		    dataType: 'json',
		    success: function(data, textStatus) {
		      analyzers_arr = data.inputs['analyzers'].split(",");
		      if(Drupal.settings.contentanalysis.display_dialog == 1) {
		        $('#analysis-modal').append(data.main['output']);
		        $('#analysis-modal .progress').remove();
		        //Drupal.behaviors.contentanalysisui();
		        $$.contentanalysis_contentanalysisui()
		      }
		      // display inline if enabled
		      if(Drupal.settings.contentanalysis.display_inline == 1) {
		        if(data.inputs['action'] == 'refresh') {
		          //if($('.contentanalysis_section_analysis').length > 0)
		          for(i in analyzers_arr) {
		            aid = analyzers_arr[i];
		            $('.contentanalysis-report-'+aid+'-page_title').replaceWith(data.page_title['output']);
		            $('.contentanalysis-report-'+aid+'-body').replaceWith(data.body['output']);
		            $('.contentanalysis-report-'+aid+'-meta_description').replaceWith(data.meta_description['output']);
		            $('.contentanalysis-report-'+aid+'-meta_keywords').replaceWith(data.meta_keywords['output']);
		          }
		        }
		        else {
		          var show_title = true;
		          if($('.form-item-metatags-title-value').length > 0) {
		            $('.form-item-metatags-title-value > .contentanalysis_section_analysis').remove();
		            $('.form-item-metatags-title-value').append(data.page_title['output']);
		            // check if metatag-title contains [node:title] token
		            if ($('#edit-metatags-title-value').val() != null) {
		              var meta_title = $('#edit-metatags-title-value').val();
		              if(meta_title.indexOf("[node:title]") == -1) {
		            	//show_title = false;
		              }
		            }
		          } 
		          if (show_title) {
		            $('.form-item-title > .contentanalysis_section_analysis').remove();
		            $('.form-item-title').append(data.page_title['output']);				
		          }
		    
		          $('#edit-body > .contentanalysis_section_analysis').remove();
		          $('#edit-body').append(data.body['output']);
		          // check newer nodewords format
		          if(($('.form-item-metatags-description-value').length > 0) && data.meta_description != null) {
		            $('.form-item-metatags-description-value > .contentanalysis_section_analysis').remove();
		            $('.form-item-metatags-description-value').append(data.meta_description['output']);
		          }
		          
		          if(($('.form-item-metatags-keywords-value').length > 0) && data.meta_keywords != null) {
		            $('.form-item-metatags-keywords-value > .contentanalysis_section_analysis').remove();
		            $('.form-item-metatags-keywords-value').append(data.meta_keywords['output']);
		          }
		        }
		        for(var i in analyzers_arr) {
		          var aid = analyzers_arr[i];
		          h = '<a href="#" class="contentanalysis-refresh-link-' + aid + '" onclick="contentanalysis.contentanalysis_refresh_analysis(\'' + aid + '\'); return false;">';
		          h += '<img src="' + Drupal.settings.contentanalysis.path_to_module + '/icons/refresh.png" alt="refresh" />';
		          h += '</a>';
		          $('.contentanalysis-report-' + aid + ' label').append(h);
		        } 
					}      
		      // call any modules post analysis hooks      
		      for(var i in analyzers_arr) {
		        var aid = analyzers_arr[i];        
		        var module = Drupal.settings.contentanalysis.analyzer_modules[aid].module;     
		        if (eval('typeof ' + module + '_contentanalysis_analysis_success == "function"')) {
		          eval(module + '_contentanalysis_analysis_success')(aid, data);
		        }
		      } 
		      if(typeof Drupal.behaviors.collapse == 'function') {
		    	  Drupal.behaviors.collapse();  
		      }
		      $('.ahah-progress-throbber').remove();
		      $('#contentanalysis-buttons').show();
		    },
		    error: function(xhr, status) {
		      alert(xhr.responseText.toString());
		      $('.ahah-progress-throbber').remove();
		      $('#contentanalysis-buttons').show();
		    }
		  });
		  return false;	
		}
	});	

	Drupal.behaviors.contentanalysisui = {
	  attach: function (context, settings) {
		$$.init();
	  }
	};
	
	Sliders = {};
	
	Sliders.changeHandle = function(e,ui) {
	  var id = jQuery(ui.handle).parents('div.slider-widget-container').attr('id');
	  if (typeof(ui.values) != 'undefined') {
	    jQuery.each(ui.values, function(i,val) {
	      jQuery("#"+id+"_value_"+i).val(val);
	      jQuery("#"+id+"_nr_"+i).text(val);
	    });
	  } else {
	    jQuery("#"+id+"_value_0").val(ui.value);
	    jQuery("#"+id+"_nr_0").text(ui.value);
	  }
	};

})(jQuery, contentanalysis);
;
var contentoptimizer_contentanalysis_data = function(aid) {		
  data = new Array();	
  data['keyword'] = document.getElementById('edit-seo-keyword').value;	
  return data;
};
(function ($) {
  // Implement an extremely simplistic show/hide.
  Drupal.behaviors.menu_attach_block = {
    attach: function (context, settings) {
      $('a.menu-attach-block-drop-link', context).click(function(event) {
        var link = $(this);
        $(link).next('.menu-attach-block-wrapper').slideToggle('fast');
        $(link).parent().toggleClass('dropped');
        event.preventDefault();
      });
      // Prevent other Javascript from effecting the display of drop links.
      $('.menu-attach-block-drop-link')
        .hover(function(){return false;}, function(){return false;});
    }
  }
}(jQuery));
;
(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};
Drupal.admin.hashes = Drupal.admin.hashes || {};

/**
 * Core behavior for Administration menu.
 *
 * Test whether there is an administration menu is in the output and execute all
 * registered behaviors.
 */
Drupal.behaviors.adminMenu = {
  attach: function (context, settings) {
    // Initialize settings.
    settings.admin_menu = $.extend({
      suppress: false,
      margin_top: false,
      position_fixed: false,
      tweak_modules: false,
      tweak_permissions: false,
      tweak_tabs: false,
      destination: '',
      basePath: settings.basePath,
      hash: 0,
      replacements: {}
    }, settings.admin_menu || {});
    // Check whether administration menu should be suppressed.
    if (settings.admin_menu.suppress) {
      return;
    }
    var $adminMenu = $('#admin-menu:not(.admin-menu-processed)', context);
    // Client-side caching; if administration menu is not in the output, it is
    // fetched from the server and cached in the browser.
    if (!$adminMenu.length && settings.admin_menu.hash) {
      Drupal.admin.getCache(settings.admin_menu.hash, function (response) {
          if (typeof response == 'string' && response.length > 0) {
            $('body', context).append(response);
          }
          var $adminMenu = $('#admin-menu:not(.admin-menu-processed)', context);
          // Apply our behaviors.
          Drupal.admin.attachBehaviors(context, settings, $adminMenu);
          // Allow resize event handlers to recalculate sizes/positions.
          $(window).triggerHandler('resize');
      });
    }
    // If the menu is in the output already, this means there is a new version.
    else {
      // Apply our behaviors.
      Drupal.admin.attachBehaviors(context, settings, $adminMenu);
    }
  }
};

/**
 * Collapse fieldsets on Modules page.
 */
Drupal.behaviors.adminMenuCollapseModules = {
  attach: function (context, settings) {
    if (settings.admin_menu.tweak_modules) {
      $('#system-modules fieldset:not(.collapsed)', context).addClass('collapsed');
    }
  }
};

/**
 * Collapse modules on Permissions page.
 */
Drupal.behaviors.adminMenuCollapsePermissions = {
  attach: function (context, settings) {
    if (settings.admin_menu.tweak_permissions) {
      // Freeze width of first column to prevent jumping.
      $('#permissions th:first', context).css({ width: $('#permissions th:first', context).width() });
      // Attach click handler.
      $modules = $('#permissions tr:has(td.module)', context).once('admin-menu-tweak-permissions', function () {
        var $module = $(this);
        $module.bind('click.admin-menu', function () {
          // @todo Replace with .nextUntil() in jQuery 1.4.
          $module.nextAll().each(function () {
            var $row = $(this);
            if ($row.is(':has(td.module)')) {
              return false;
            }
            $row.toggleClass('element-hidden');
          });
        });
      });
      // Collapse all but the targeted permission rows set.
      if (window.location.hash.length) {
        $modules = $modules.not(':has(' + window.location.hash + ')');
      }
      $modules.trigger('click.admin-menu');
    }
  }
};

/**
 * Apply margin to page.
 *
 * Note that directly applying marginTop does not work in IE. To prevent
 * flickering/jumping page content with client-side caching, this is a regular
 * Drupal behavior.
 */
Drupal.behaviors.adminMenuMarginTop = {
  attach: function (context, settings) {
    if (!settings.admin_menu.suppress && settings.admin_menu.margin_top) {
      $('body:not(.admin-menu)', context).addClass('admin-menu');
    }
  }
};

/**
 * Retrieve content from client-side cache.
 *
 * @param hash
 *   The md5 hash of the content to retrieve.
 * @param onSuccess
 *   A callback function invoked when the cache request was successful.
 */
Drupal.admin.getCache = function (hash, onSuccess) {
  if (Drupal.admin.hashes.hash !== undefined) {
    return Drupal.admin.hashes.hash;
  }
  $.ajax({
    cache: true,
    type: 'GET',
    dataType: 'text', // Prevent auto-evaluation of response.
    global: false, // Do not trigger global AJAX events.
    url: Drupal.settings.admin_menu.basePath.replace(/admin_menu/, 'js/admin_menu/cache/' + hash),
    success: onSuccess,
    complete: function (XMLHttpRequest, status) {
      Drupal.admin.hashes.hash = status;
    }
  });
};

/**
 * TableHeader callback to determine top viewport offset.
 *
 * @see toolbar.js
 */
Drupal.admin.height = function() {
  var $adminMenu = $('#admin-menu');
  var height = $adminMenu.outerHeight();
  // In IE, Shadow filter adds some extra height, so we need to remove it from
  // the returned height.
  if ($adminMenu.css('filter') && $adminMenu.css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) {
    height -= $adminMenu.get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

/**
 * @defgroup admin_behaviors Administration behaviors.
 * @{
 */

/**
 * Attach administrative behaviors.
 */
Drupal.admin.attachBehaviors = function (context, settings, $adminMenu) {
  if ($adminMenu.length) {
    $adminMenu.addClass('admin-menu-processed');
    $.each(Drupal.admin.behaviors, function() {
      this(context, settings, $adminMenu);
    });
  }
};

/**
 * Apply 'position: fixed'.
 */
Drupal.admin.behaviors.positionFixed = function (context, settings, $adminMenu) {
  if (settings.admin_menu.position_fixed) {
    $adminMenu.addClass('admin-menu-position-fixed');
    $adminMenu.css('position', 'fixed');
  }
};

/**
 * Move page tabs into administration menu.
 */
Drupal.admin.behaviors.pageTabs = function (context, settings, $adminMenu) {
  if (settings.admin_menu.tweak_tabs) {
    var $tabs = $(context).find('ul.tabs.primary');
    $adminMenu.find('#admin-menu-wrapper > ul').eq(1)
      .append($tabs.find('li').addClass('admin-menu-tab'));
    $(context).find('ul.tabs.secondary')
      .appendTo('#admin-menu-wrapper > ul > li.admin-menu-tab.active')
      .removeClass('secondary');
    $tabs.remove();
  }
};

/**
 * Perform dynamic replacements in cached menu.
 */
Drupal.admin.behaviors.replacements = function (context, settings, $adminMenu) {
  for (var item in settings.admin_menu.replacements) {
    $(item, $adminMenu).html(settings.admin_menu.replacements[item]);
  }
};

/**
 * Inject destination query strings for current page.
 */
Drupal.admin.behaviors.destination = function (context, settings, $adminMenu) {
  if (settings.admin_menu.destination) {
    $('a.admin-menu-destination', $adminMenu).each(function() {
      this.search += (!this.search.length ? '?' : '&') + Drupal.settings.admin_menu.destination;
    });
  }
};

/**
 * Apply JavaScript-based hovering behaviors.
 *
 * @todo This has to run last.  If another script registers additional behaviors
 *   it will not run last.
 */
Drupal.admin.behaviors.hover = function (context, settings, $adminMenu) {
  // Hover emulation for IE 6.
  if ($.browser.msie && parseInt(jQuery.browser.version) == 6) {
    $('li', $adminMenu).hover(
      function () {
        $(this).addClass('iehover');
      },
      function () {
        $(this).removeClass('iehover');
      }
    );
  }

  // Delayed mouseout.
  $('li.expandable', $adminMenu).hover(
    function () {
      // Stop the timer.
      clearTimeout(this.sfTimer);
      // Display child lists.
      $('> ul', this)
        .css({left: 'auto', display: 'block'})
        // Immediately hide nephew lists.
        .parent().siblings('li').children('ul').css({left: '-999em', display: 'none'});
    },
    function () {
      // Start the timer.
      var uls = $('> ul', this);
      this.sfTimer = setTimeout(function () {
        uls.css({left: '-999em', display: 'none'});
      }, 400);
    }
  );
};

/**
 * Apply the search bar functionality.
 */
Drupal.admin.behaviors.search = function (context, settings, $adminMenu) {
  // @todo Add a HTML ID.
  var $input = $('input.admin-menu-search', $adminMenu);
  // Initialize the current search needle.
  var needle = $input.val();
  // Cache of all links that can be matched in the menu.
  var links;
  // Minimum search needle length.
  var needleMinLength = 2;
  // Append the results container.
  var $results = $('<div />').insertAfter($input);

  /**
   * Executes the search upon user input.
   */
  function keyupHandler() {
    var matches, $html, value = $(this).val();
    // Only proceed if the search needle has changed.
    if (value !== needle) {
      needle = value;
      // Initialize the cache of menu links upon first search.
      if (!links && needle.length >= needleMinLength) {
        // @todo Limit to links in dropdown menus; i.e., skip menu additions.
        links = buildSearchIndex($adminMenu.find('li:not(.admin-menu-action, .admin-menu-action li) > a'));
      }
      // Empty results container when deleting search text.
      if (needle.length < needleMinLength) {
        $results.empty();
      }
      // Only search if the needle is long enough.
      if (needle.length >= needleMinLength && links) {
        matches = findMatches(needle, links);
        // Build the list in a detached DOM node.
        $html = buildResultsList(matches);
        // Display results.
        $results.empty().append($html);
      }
    }
  }

  /**
   * Builds the search index.
   */
  function buildSearchIndex($links) {
    return $links
      .map(function () {
        var text = (this.textContent || this.innerText);
        // Skip menu entries that do not contain any text (e.g., the icon).
        if (typeof text === 'undefined') {
          return;
        }
        return {
          text: text,
          textMatch: text.toLowerCase(),
          element: this
        };
      });
  }

  /**
   * Searches the index for a given needle and returns matching entries.
   */
  function findMatches(needle, links) {
    var needleMatch = needle.toLowerCase();
    // Select matching links from the cache.
    return $.grep(links, function (link) {
      return link.textMatch.indexOf(needleMatch) !== -1;
    });
  }

  /**
   * Builds the search result list in a detached DOM node.
   */
  function buildResultsList(matches) {
    var $html = $('<ul class="dropdown admin-menu-search-results" />');
    $.each(matches, function () {
      var result = this.text;
      var $element = $(this.element);

      // Check whether there is a top-level category that can be prepended.
      var $category = $element.closest('#admin-menu-wrapper > ul > li');
      var categoryText = $category.find('> a').text()
      if ($category.length && categoryText) {
        result = categoryText + ': ' + result;
      }

      var $result = $('<li><a href="' + $element.attr('href') + '">' + result + '</a></li>');
      $result.data('original-link', $(this.element).parent());
      $html.append($result);
    });
    return $html;
  }

  /**
   * Highlights selected result.
   */
  function resultsHandler(e) {
    var $this = $(this);
    var show = e.type === 'mouseenter' || e.type === 'focusin';
    $this.trigger(show ? 'showPath' : 'hidePath', [this]);
  }

  /**
   * Closes the search results and clears the search input.
   */
  function resultsClickHandler(e, link) {
    var $original = $(this).data('original-link');
    $original.trigger('mouseleave');
    $input.val('').trigger('keyup');
  }

  /**
   * Shows the link in the menu that corresponds to a search result.
   */
  function highlightPathHandler(e, link) {
    if (link) {
      var $original = $(link).data('original-link');
      var show = e.type === 'showPath';
      // Toggle an additional CSS class to visually highlight the matching link.
      // @todo Consider using same visual appearance as regular hover.
      $original.toggleClass('highlight', show);
      $original.trigger(show ? 'mouseenter' : 'mouseleave');
    }
  }

  // Attach showPath/hidePath handler to search result entries.
  $results.delegate('li', 'mouseenter mouseleave focus blur', resultsHandler);
  // Hide the result list after a link has been clicked, useful for overlay.
  $results.delegate('li', 'click', resultsClickHandler);
  // Attach hover/active highlight behavior to search result entries.
  $adminMenu.delegate('.admin-menu-search-results li', 'showPath hidePath', highlightPathHandler);
  // Attach the search input event handler.
  $input.bind('keyup search', keyupHandler);
};

/**
 * @} End of "defgroup admin_behaviors".
 */

})(jQuery);
;
(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};

/**
 * @ingroup admin_behaviors
 * @{
 */

/**
 * Apply active trail highlighting based on current path.
 *
 * @todo Not limited to toolbar; move into core?
 */
Drupal.admin.behaviors.toolbarActiveTrail = function (context, settings, $adminMenu) {
  if (settings.admin_menu.toolbar && settings.admin_menu.toolbar.activeTrail) {
    $adminMenu.find('> div > ul > li > a[href="' + settings.admin_menu.toolbar.activeTrail + '"]').addClass('active-trail');
  }
};

/**
 * Toggles the shortcuts bar.
 */
Drupal.admin.behaviors.shortcutToggle = function (context, settings, $adminMenu) {
  var $shortcuts = $adminMenu.find('.shortcut-toolbar');
  if (!$shortcuts.length) {
    return;
  }
  var storage = window.localStorage || false;
  var storageKey = 'Drupal.admin_menu.shortcut';
  var $body = $(context).find('body');
  var $toggle = $adminMenu.find('.shortcut-toggle');
  $toggle.click(function () {
    var enable = !$shortcuts.hasClass('active');
    $shortcuts.toggleClass('active', enable);
    $toggle.toggleClass('active', enable);
    if (settings.admin_menu.margin_top) {
      $body.toggleClass('admin-menu-with-shortcuts', enable);
    }
    // Persist toggle state across requests.
    storage && enable ? storage.setItem(storageKey, 1) : storage.removeItem(storageKey);
    this.blur();
    return false;
  });

  if (!storage || storage.getItem(storageKey)) {
    $toggle.trigger('click');
  }
};

/**
 * @} End of "ingroup admin_behaviors".
 */

})(jQuery);
;
