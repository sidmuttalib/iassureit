(function ($) {

/**
 * Terminology:
 *
 *   "Link" means "Everything which is in flag.tpl.php" --and this may contain
 *   much more than the <A> element. On the other hand, when we speak
 *   specifically of the <A> element, we say "element" or "the <A> element".
 */

/**
 * The main behavior to perform AJAX toggling of links.
 */
Drupal.flagLink = function(context) {
  /**
   * Helper function. Updates a link's HTML with a new one.
   *
   * @param element
   *   The <A> element.
   * @return
   *   The new link.
   */
  function updateLink(element, newHtml) {
    var $newLink = $(newHtml);

    // Initially hide the message so we can fade it in.
    $('.flag-message', $newLink).css('display', 'none');

    // Reattach the behavior to the new <A> element. This element
    // is either whithin the wrapper or it is the outer element itself.
    var $nucleus = $newLink.is('a') ? $newLink : $('a.flag', $newLink);
    $nucleus.addClass('flag-processed').click(flagClick);

    // Find the wrapper of the old link.
    var $wrapper = $(element).parents('.flag-wrapper:first');
    // Replace the old link with the new one.
    $wrapper.after($newLink).remove();
    Drupal.attachBehaviors($newLink.get(0));

    $('.flag-message', $newLink).fadeIn();
    setTimeout(function(){ $('.flag-message.flag-auto-remove', $newLink).fadeOut() }, 3000);
    return $newLink.get(0);
  }

  /**
   * A click handler that is attached to all <A class="flag"> elements.
   */
  function flagClick(event) {
    // Prevent the default browser click handler
    event.preventDefault();

    // 'this' won't point to the element when it's inside the ajax closures,
    // so we reference it using a variable.
    var element = this;

    // While waiting for a server response, the wrapper will have a
    // 'flag-waiting' class. Themers are thus able to style the link
    // differently, e.g., by displaying a throbber.
    var $wrapper = $(element).parents('.flag-wrapper');
    if ($wrapper.is('.flag-waiting')) {
      // Guard against double-clicks.
      return false;
    }
    $wrapper.addClass('flag-waiting');

    // Hide any other active messages.
    $('span.flag-message:visible').fadeOut();

    // Send POST request
    $.ajax({
      type: 'POST',
      url: element.href,
      data: { js: true },
      dataType: 'json',
      success: function (data) {
        data.link = $wrapper.get(0);
        $.event.trigger('flagGlobalBeforeLinkUpdate', [data]);
        if (!data.preventDefault) { // A handler may cancel updating the link.
          data.link = updateLink(element, data.newLink);
        }

        // Find all the link wrappers on the page for this flag, but exclude
        // the triggering element because Flag's own javascript updates it.
        var $wrappers = $('.flag-wrapper.flag-' + data.flagName.flagNameToCSS() + '-' + data.contentId).not(data.link);
        var $newLink = $(data.newLink);

        // Hide message, because we want the message to be shown on the triggering element alone.
        $('.flag-message', $newLink).hide();

        // Finally, update the page.
        $wrappers = $newLink.replaceAll($wrappers);
        Drupal.attachBehaviors($wrappers.parent());

        $.event.trigger('flagGlobalAfterLinkUpdate', [data]);
      },
      error: function (xmlhttp) {
        alert('An HTTP error '+ xmlhttp.status +' occurred.\n'+ element.href);
        $wrapper.removeClass('flag-waiting');
      }
    });
  }

  $('a.flag-link-toggle:not(.flag-processed)', context).addClass('flag-processed').click(flagClick);
};

/**
 * Prevent anonymous flagging unless the user has JavaScript enabled.
 */
Drupal.flagAnonymousLinks = function(context) {
  $('a.flag:not(.flag-anonymous-processed)', context).each(function() {
    this.href += (this.href.match(/\?/) ? '&' : '?') + 'has_js=1';
    $(this).addClass('flag-anonymous-processed');
  });
}

String.prototype.flagNameToCSS = function() {
  return this.replace(/_/g, '-');
}

/**
 * A behavior specifically for anonymous users. Update links to the proper state.
 */
Drupal.flagAnonymousLinkTemplates = function(context) {
  // Swap in current links. Cookies are set by PHP's setcookie() upon flagging.

  var templates = Drupal.settings.flag.templates;

  // Build a list of user-flags.
  var userFlags = Drupal.flagCookie('flags');
  if (userFlags) {
    userFlags = userFlags.split('+');
    for (var n in userFlags) {
      var flagInfo = userFlags[n].match(/(\w+)_(\d+)/);
      var flagName = flagInfo[1];
      var contentId = flagInfo[2];
      // User flags always default to off and the JavaScript toggles them on.
      if (templates[flagName + '_' + contentId]) {
        $('.flag-' + flagName.flagNameToCSS() + '-' + contentId, context).after(templates[flagName + '_' + contentId]).remove();
      }
    }
  }

  // Build a list of global flags.
  var globalFlags = document.cookie.match(/flag_global_(\w+)_(\d+)=([01])/g);
  if (globalFlags) {
    for (var n in globalFlags) {
      var flagInfo = globalFlags[n].match(/flag_global_(\w+)_(\d+)=([01])/);
      var flagName = flagInfo[1];
      var contentId = flagInfo[2];
      var flagState = (flagInfo[3] == '1') ? 'flag' : 'unflag';
      // Global flags are tricky, they may or may not be flagged in the page
      // cache. The template always contains the opposite of the current state.
      // So when checking global flag cookies, we need to make sure that we
      // don't swap out the link when it's already in the correct state.
      if (templates[flagName + '_' + contentId]) {
        $('.flag-' + flagName.flagNameToCSS() + '-' + contentId, context).each(function() {
          if ($(this).find('.' + flagState + '-action').size()) {
            $(this).after(templates[flagName + '_' + contentId]).remove();
          }
        });
      }
    }
  }
}

/**
 * Utility function used to set Flag cookies.
 *
 * Note this is a direct copy of the jQuery cookie library.
 * Written by Klaus Hartl.
 */
Drupal.flagCookie = function(name, value, options) {
  if (typeof value != 'undefined') { // name and value given, set cookie
    options = options || {};
    if (value === null) {
      value = '';
      options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    // NOTE Needed to parenthesize options.path and options.domain
    // in the following expressions, otherwise they evaluate to undefined
    // in the packed version for some reason...
    var path = options.path ? '; path=' + (options.path) : '';
    var domain = options.domain ? '; domain=' + (options.domain) : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  } else { // only name given, get cookie
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};

Drupal.behaviors.flagLink = {};
Drupal.behaviors.flagLink.attach = function(context) {
  // For anonymous users with the page cache enabled, swap out links with their
  // current state for the user.
  if (Drupal.settings.flag && Drupal.settings.flag.templates) {
    Drupal.flagAnonymousLinkTemplates(context);
  }

  // For all anonymous users, require JavaScript for flagging to prevent spiders
  // from flagging things inadvertently.
  if (Drupal.settings.flag && Drupal.settings.flag.anonymous) {
    Drupal.flagAnonymousLinks(context);
  }

  // On load, bind the click behavior for all links on the page.
  Drupal.flagLink(context);
};

})(jQuery);
;
// IMPORTANT!
// If you're already using Modernizr, delete it from this file. If you don't know what Modernizr is, leave it :)

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.csstransforms=function(){return!!F("transform")},q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},q.csstransitions=function(){return F("transition")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document);


// Shuffle Doesn't require this shuffle/debounce plugin, but it works better with it.

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

/**
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items.
 * Dependencies: jQuery 1.9+, Modernizr 2.6.2. Optionally throttle/debounce by Ben Alman
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Modified 2013-08-19
 * @license MIT license
 * @author Glen Cheney <cheney.glen@gmail.com>
 * @version 2.0.1
 */
(function($, Modernizr, undefined) {

'use strict';

// You can return `undefined` from the `by` function to revert to DOM order
// This plugin does NOT return a jQuery object. It returns a plain array because
// jQuery sorts everything in DOM order.
$.fn.sorted = function(options) {
    var opts = $.extend({}, $.fn.sorted.defaults, options),
        arr = this.get(),
        revert = false;

    if ( !arr.length ) {
        return [];
    }

    if ( opts.randomize ) {
        return $.fn.sorted.randomize( arr );
    }

    // Sort the elements by the opts.by function.
    // If we don't have opts.by, default to DOM order
    if (opts.by !== $.noop && opts.by !== null && opts.by !== undefined) {
        arr.sort(function(a, b) {

            // Exit early if we already know we want to revert
            if ( revert ) {
                return 0;
            }

            var valA = opts.by($(a)),
                valB = opts.by($(b));

            // If both values are undefined, use the DOM order
            if ( valA === undefined && valB === undefined ) {
                revert = true;
                return 0;
            }

            if ( valA === 'sortFirst' || valB === 'sortLast' ) {
                return -1;
            }

            if ( valA === 'sortLast' || valB === 'sortFirst' ) {
                return 1;
            }

            return (valA < valB) ? -1 :
                (valA > valB) ? 1 : 0;
        });
    }

    // Revert to the original array if necessary
    if ( revert ) {
        return this.get();
    }

    if ( opts.reverse ) {
        arr.reverse();
    }

    return arr;

};

$.fn.sorted.defaults = {
    reverse: false, // Use array.reverse() to reverse the results
    by: null, // Sorting function
    randomize: false // If true, this will skip the sorting and return a randomized order in the array
};


// http://stackoverflow.com/a/962890/373422
$.fn.sorted.randomize = function( array ) {
    var top = array.length,
        tmp, current;

    if ( !top ) {
        return array;
    }

    while ( --top ) {
        current = Math.floor( Math.random() * (top + 1) );
        tmp = array[ current ];
        array[ current ] = array[ top ];
        array[ top ] = tmp;
    }

    return array;
};

// Used for unique instance variables
var id = 0;


/**
 * Returns css prefixed properties like `-webkit-transition` or `box-sizing`
 * from `transition` or `boxSizing`, respectively.
 * @param {(string|boolean)} prop Property to be prefixed.
 * @return {string} The prefixed css property.
 */
function getCssPrefix( prop ) {
    if (!prop) {
      return '';
    }

    // Replace upper case with dash-lowercase,
    // then fix ms- prefixes because they're not capitalized.
    return prop.replace(/([A-Z])/g, function( str, m1 ) {
        return '-' + m1.toLowerCase();
    }).replace(/^ms-/,'-ms-');
}

// Constant, prefixed variables.
var TRANSITION = Modernizr.prefixed('transition');
var TRANSITION_DELAY = Modernizr.prefixed('transitionDelay');
var TRANSITION_DURATION = Modernizr.prefixed('transitionDuration');
var TRANSITIONEND = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'transition' : 'transitionend'
}[ TRANSITION ];
var TRANSFORM = Modernizr.prefixed('transform');
var CSS_TRANSFORM = getCssPrefix(TRANSFORM);

// Constants
var CAN_TRANSITION_TRANSFORMS = Modernizr.csstransforms && Modernizr.csstransitions;
var HAS_TRANSFORMS_3D = Modernizr.csstransforms3d;
var SHUFFLE = 'shuffle';
//alert(HAS_TRANSFORMS_3D);

var Shuffle = function( $container, options ) {
    var self = this;
    $.extend( self, Shuffle.options, options, Shuffle.settings );

    self.$container = $container;
    self.$window = $(window);
    self.unique = 'shuffle_' + id++;

    self._fire('loading');
    self._init();
    self._fire('done');
};

Shuffle.prototype = {

    _init : function() {
        var self = this,
            containerCSS,
            resizeFunction = $.proxy( self._onResize, self ),
            debouncedResize = self.throttle ? self.throttle( self.throttleTime, resizeFunction ) : resizeFunction,
            sort = self.initialSort ? self.initialSort : null;

        // Save variables needed later then add some classes
        self._setVars();

        // Zero out all columns
        self._resetCols();

        // Add classes and invalidate styles
        self._addClasses();

        // Set initial css for each item
        self._initItems();

        // Bind resize events (http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer)
        self.$window.on('resize.' + SHUFFLE + '.' + self.unique, debouncedResize);

        // Get container css all in one request. Causes reflow
        containerCSS = self.$container.css(['paddingLeft', 'paddingRight', 'position', 'width']);

        // Position cannot be static.
        // This will cause an extra style layout if it has to be set and the sizer element is used.
        if ( containerCSS.position === 'static' ) {
            self.$container[0].style.position = 'relative';
        }

        // Get offset from container
        self.offset = {
            left: parseInt( containerCSS.paddingLeft, 10 ) || 0,
            top: parseInt( containerCSS.paddingTop, 10 ) || 0
        };

        // We already got the container's width above, no need to cause another reflow getting it again...
        // Calculate the number of columns there will be
        self._setColumns( parseInt( containerCSS.width, 10 ) );

        // Kick off!
        self.shuffle( self.group, sort );

        // The shuffle items haven't had transitions set on them yet
        // so the user doesn't see the first layout. Set them now that the first layout is done.
        if ( self.supported ) {
            setTimeout(function() {
                self._setTransitions();
                self.$container[0].style[ TRANSITION ] = 'height ' + self.speed + 'ms ' + self.easing;
            }, 0);
        }
    },

    // Will invalidate styles
    _addClasses : function() {
        var self = this;

        self.$container.addClass( SHUFFLE );
        self.$items.addClass('shuffle-item filtered');

        return self;
    },

    _setVars : function() {
        var self = this;

        self.$items = self._getItems();

        // If the columnWidth property is a function, then the grid is fluid
        self.isFluid = self.columnWidth && typeof self.columnWidth === 'function';

        // Column width is the default setting and sizer is not (meaning passed in)
        // Assume they meant column width to be the sizer
        if ( self.columnWidth === 0 && self.sizer !== null ) {
            self.columnWidth = self.sizer;
        }

        // If column width is a string, treat is as a selector and search for the
        // sizer element within the outermost container
        if ( typeof self.columnWidth === 'string' ) {
            self.$sizer = self.$container.find( self.columnWidth );

        // Check for an element
        } else if ( self.columnWidth && self.columnWidth.nodeType && self.columnWidth.nodeType === 1 ) {
            // Wrap it in jQuery
            self.$sizer = $( self.columnWidth );

        // Check for jQuery object
        } else if ( self.columnWidth && self.columnWidth.jquery ) {
            self.$sizer = self.columnWidth;
        }

        if ( self.$sizer && self.$sizer.length ) {
            self.useSizer = true;
            self.sizer = self.$sizer[0];
        }

        return self;
    },

    _filter : function( category, $collection ) {
        var self = this,
            isPartialSet = $collection !== undefined,
            $items = isPartialSet ? $collection : self.$items,
            $filtered = $();

        category = category || self.lastFilter;

        self._fire('filter');

        // Loop through each item and use provided function to determine
        // whether to hide it or not.
        if ( $.isFunction(category) ) {
            $items.each(function() {
                var $item = $(this),
                passes = category.call($item[0], $item, self);

                if ( passes ) {
                    $filtered = $filtered.add( $item );
                }
            });
        }

        // Otherwise we've been passed a category to filter by
        else {
            self.group = category;
            if (category !== 'all') {
                $items.each(function() {
                    var $this = $(this),
                    groups = $this.data('groups'),
                    keys = self.delimeter && !$.isArray( groups ) ? groups.split( self.delimeter ) : groups,
                    passes = $.inArray(category, keys) > -1;

                    if ( passes ) {
                        $filtered = $filtered.add( $this );
                    }
                });
            }

            // category === 'all', add filtered class to everything
            else {
                $filtered = $items;
            }
        }

        // Individually add/remove concealed/filtered classes
        self._toggleFilterClasses( $items, $filtered );

        $items = null;
        $collection = null;

        return $filtered;
    },


    _toggleFilterClasses : function( $items, $filtered ) {
        var concealed = 'concealed',
            filtered = 'filtered';

        $items.filter( $filtered ).each(function() {
            var $filteredItem = $(this);
            // Remove concealed if it's there
            if ( $filteredItem.hasClass( concealed ) ) {
                $filteredItem.removeClass( concealed );
            }
            // Add filtered class if it's not there
            if ( !$filteredItem.hasClass( filtered ) ) {
                $filteredItem.addClass( filtered );
            }
        });

        $items.not( $filtered ).each(function() {
            var $filteredItem = $(this);
            // Add concealed if it's not there
            if ( !$filteredItem.hasClass( concealed ) ) {
                $filteredItem.addClass( concealed );
            }
            // Remove filtered class if it's there
            if ( $filteredItem.hasClass( filtered ) ) {
                $filteredItem.removeClass( filtered );
            }
        });
    },

    /**
     * Set the initial css for each item
     * @param {jQuery} [$items] Optionally specifiy at set to initialize
     * @return {jQuery} The items which were just set
     */
    _initItems : function( $items ) {
        $items = $items || this.$items;
        return $items.css( this.itemCss );
    },

    _updateItemCount : function() {
        this.visibleItems = this.$items.filter('.filtered').length;
        return this;
    },

    _setTransition : function( element ) {
        var self = this;
        element.style[ TRANSITION ] = CSS_TRANSFORM + ' ' + self.speed + 'ms ' + self.easing + ', opacity ' + self.speed + 'ms ' + self.easing;
        return element;
    },

    _setTransitions : function( $items ) {
        var self = this;

        $items = $items || self.$items;
        $items.each(function() {
            self._setTransition( this );
        });
        return self;
    },

    _setSequentialDelay : function( $collection ) {
        var self = this;

        if ( !self.supported ) {
            return;
        }

        // $collection can be an array of dom elements or jquery object
        $.each( $collection, function(i) {
            // This works because the transition-property: transform, opacity;
            this.style[ TRANSITION_DELAY ] = '0ms,' + ((i + 1) * self.sequentialFadeDelay) + 'ms';

            // Set the delay back to zero after one transition
            $(this).one(TRANSITIONEND, function() {
                this.style[ TRANSITION_DELAY ] = '0ms';
            });
        });
    },

    _getItems : function() {
        return this.$container.children( this.itemSelector );
    },

    _getPreciseDimension : function( element, style ) {
        var dimension;
        if ( window.getComputedStyle ) {
            dimension = window.getComputedStyle( element, null )[ style ];
        } else {
            dimension = $( element ).css( style );
        }
        return parseFloat( dimension );
    },

    // Calculate number of columns
    // Gets css if using sizer element
    _setColumns : function( theContainerWidth ) {
        var self = this,
            containerWidth = theContainerWidth || self.$container.width(),
            gutter = typeof self.gutterWidth === 'function' ?
                self.gutterWidth( containerWidth ) :
                self.useSizer ?
                    self._getPreciseDimension( self.sizer, 'marginLeft' ) :
                    self.gutterWidth,
            calculatedColumns;

        // use fluid columnWidth function if there
        self.colWidth = self.isFluid ? self.columnWidth( containerWidth ) :
            // columnWidth option isn't a function, are they using a sizing element?
            self.useSizer ? self._getPreciseDimension( self.sizer, 'width' ) :
            // if not, how about the explicitly set option?
            self.columnWidth ||
            // or use the size of the first item
            self.$items.outerWidth(true) ||
            // if there's no items, use size of container
            containerWidth;

        // Don't let them set a column width of zero.
        self.colWidth = self.colWidth || containerWidth;

        self.colWidth += gutter;

        calculatedColumns = (containerWidth + gutter) / self.colWidth;
        // Widths given from getComputedStyle are not precise enough...
        if ( Math.ceil(calculatedColumns) - calculatedColumns < 0.01 ) {
            // e.g. calculatedColumns = 11.998876
            calculatedColumns = Math.ceil( calculatedColumns );
        }
        self.cols = Math.floor( calculatedColumns );
        self.cols = Math.max( self.cols, 1 );

        self.containerWidth = containerWidth;
    },

    /**
     * Adjust the height of the grid
     */
    _setContainerSize : function() {
        var self = this,
        gridHeight = Math.max.apply( Math, self.colYs );
        self.$container.css( 'height', gridHeight + 'px' );
    },

    /**
     * Fire events with .shuffle namespace
     */
    _fire : function( name, args ) {
        this.$container.trigger( name + '.' + SHUFFLE, args && args.length ? args : [ this ] );
    },


    /**
     * Loops through each item that should be shown
     * Calculates the x and y position and then transitions it
     * @param {Array.<Element>} items Array of items that will be shown/layed out in order in their array.
     *     Because jQuery collection are always ordered in DOM order, we can't pass a jq collection
     * @param {function} complete callback function
     * @param {boolean} isOnlyPosition set this to true to only trigger positioning of the items
     * @param {boolean} isHide
     */
    _layout: function( items, fn, isOnlyPosition, isHide ) {
        var self = this;

        fn = fn || self.filterEnd;

        self.layoutTransitionEnded = false;
        $.each(items, function(index) {
            var $this = $(items[index]),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / self.colWidth );
            colSpan = Math.min( colSpan, self.cols );

            if ( colSpan === 1 ) {
                // if brick spans only one column, just like singleMode
                self._placeItem( $this, self.colYs, fn, isOnlyPosition, isHide );
            } else {
                // brick spans more than one column
                // how many different places could this brick fit horizontally
                var groupCount = self.cols + 1 - colSpan,
                    groupY = [],
                    groupColY,
                    i;

                // for each group potential horizontal position
                for ( i = 0; i < groupCount; i++ ) {
                    // make an array of colY values for that one group
                    groupColY = self.colYs.slice( i, i + colSpan );
                    // and get the max value of the array
                    groupY[i] = Math.max.apply( Math, groupColY );
                }

                self._placeItem( $this, groupY, fn, isOnlyPosition, isHide );
            }
        });

        // `_layout` always happens after `_shrink`, so it's safe to process the style
        // queue here with styles from the shrink method
        self._processStyleQueue();

        // Adjust the height of the container
        self._setContainerSize();
    },

    _resetCols : function() {
        // reset columns
        var i = this.cols;
        this.colYs = [];
        while (i--) {
            this.colYs.push( 0 );
        }
    },

    _reLayout : function( callback, isOnlyPosition ) {
        var self = this;
        callback = callback || self.filterEnd;
        self._resetCols();

        // If we've already sorted the elements, keep them sorted
        if ( self.keepSorted && self.lastSort ) {
            self.sort( self.lastSort, true, isOnlyPosition );
        } else {
            self._layout( self.$items.filter('.filtered').get(), self.filterEnd, isOnlyPosition );
        }
    },

    // worker method that places brick in the columnSet with the the minY
    _placeItem : function( $item, setY, callback, isOnlyPosition, isHide ) {
        // get the minimum Y value from the columns
        var self = this,
            minimumY = Math.min.apply( Math, setY ),
            shortCol = 0;

        // Find index of short column, the first from the left where this item will go
        // if ( setY[i] === minimumY ) requires items' height to be exact every time.
        // The buffer value is very useful when the height is a percentage of the width
        for (var i = 0, len = setY.length; i < len; i++) {
            if ( setY[i] >= minimumY - self.buffer && setY[i] <= minimumY + self.buffer ) {
                shortCol = i;
                break;
            }
        }

        // Position the item
        var x = self.colWidth * shortCol,
        y = minimumY;
        x = Math.round( x + self.offset.left );
        y = Math.round( y + self.offset.top );

        // Save data for shrink
        $item.data( {x: x, y: y} );

        // Apply setHeight to necessary columns
        var setHeight = minimumY + $item.outerHeight( true ),
        setSpan = self.cols + 1 - len;
        for ( i = 0; i < setSpan; i++ ) {
            self.colYs[ shortCol + i ] = setHeight;
        }

        var transitionObj = {
            from: 'layout',
            $this: $item,
            x: x,
            y: y,
            scale: 1
        };

        if ( isOnlyPosition ) {
            transitionObj.skipTransition = true;
        } else {
            transitionObj.opacity = 1;
            transitionObj.callback = callback;
        }

        if ( isHide ) {
            transitionObj.opacity = 0;
        }

        self.styleQueue.push( transitionObj );
    },

    /**
     * Hides the elements that don't match our filter
     */
    _shrink : function( $collection, fn ) {
        var self = this,
            $concealed = $collection || self.$items.filter('.concealed'),
            transitionObj = {},
            callback = fn || self.shrinkEnd;

        // Abort if no items
        if ( !$concealed.length ) {
            return;
        }

        self._fire('shrink');

        self.shrinkTransitionEnded = false;
        $concealed.each(function() {
            var $this = $(this),
                data = $this.data();

            transitionObj = {
                from: 'shrink',
                $this: $this,
                x: data.x,
                y: data.y,
                scale : 0.001,
                opacity: 0,
                callback: callback
            };

            self.styleQueue.push( transitionObj );
        });
    },

    _onResize : function() {
        var self = this,
            containerWidth;

        // If shuffle is disabled, destroyed, don't do anything
        if ( !self.enabled || self.destroyed ) {
            return;
        }

        // Will need to check height in the future if it's layed out horizontaly
        containerWidth = self.$container.width();

        // containerWidth hasn't changed, don't do anything
        if ( containerWidth === self.containerWidth ) {
            return;
        }

        self.resized();
    },


    /**
     * Transitions an item in the grid
     *
     * @param {Object}   opts options
     * @param {jQuery}   opts.$this jQuery object representing the current item
     * @param {number}   opts.x translate's x
     * @param {number}   opts.y translate's y
     * @param {string}   opts.left left position (used when no transforms available)
     * @param {string}   opts.top top position (used when no transforms available)
     * @param {number}   opts.scale amount to scale the item
     * @param {number}   opts.opacity opacity of the item
     * @param {string}   opts.height the height of the item (used when no transforms available)
     * @param {string}   opts.width the width of the item (used when no transforms available)
     * @param {Function} opts.callback complete function for the animation
     */
    transition: function(opts) {
        var self = this,
        transform,
        // Only fire callback once per collection's transition
        complete = function() {
            if ( !self.layoutTransitionEnded && opts.from === 'layout' ) {
                self._fire('layout');
                opts.callback.call( self );
                self.layoutTransitionEnded = true;
            } else if ( !self.shrinkTransitionEnded && opts.from === 'shrink' ) {
                opts.callback.call( self );
                self.shrinkTransitionEnded = true;
            }
        };

        opts.callback = opts.callback || $.noop;

        // Use CSS Transforms if we have them
        if ( self.supported ) {

            // Make scale one if it's not preset
            if ( opts.scale === undefined ) {
                opts.scale = 1;
            }

            if ( HAS_TRANSFORMS_3D ) {
								transform = 'translate3d(' + opts.x + 'px, ' + opts.y + 'px, 0) scale3d(' + opts.scale + ', ' + opts.scale + ', 1)';
            } else {
                transform = 'translate(' + opts.x + 'px, ' + opts.y + 'px) scale(' + opts.scale + ', ' + opts.scale + ')';
            }

            if ( opts.x !== undefined ) {
                opts.$this.css( TRANSFORM, transform );
            }

            if ( opts.opacity !== undefined ) {
                // Update css to trigger CSS Animation
                opts.$this.css('opacity' , opts.opacity);
            }

            opts.$this.one(TRANSITIONEND, complete);
        } else {

            var cssObj = {
                left: opts.x,
                top: opts.y,
                opacity: opts.opacity
            };

            // Use jQuery to animate left/top
            opts.$this.stop( true ).animate( cssObj, self.speed, 'swing', complete);
        }
    },

    _processStyleQueue : function() {
        var self = this,
            queue = self.styleQueue;

        $.each( queue, function(i, transitionObj) {

            if ( transitionObj.skipTransition ) {
                self._skipTransition( transitionObj.$this[0], function() {
                    self.transition( transitionObj );
                });
            } else {
                self.transition( transitionObj );
            }
        });

        // Remove everything in the style queue
        self.styleQueue.length = 0;
    },

    shrinkEnd: function() {
        this._fire('shrunk');
    },

    filterEnd: function() {
        this._fire('filtered');
    },

    sortEnd: function() {
        this._fire('sorted');
    },

    /**
     * Change a property or execute a function which will not have a transition
     * @param {Element} element DOM element that won't be transitioned
     * @param {(string|Function)} property The new style property which will be set or a function which will be called
     * @param {string} [value] The value that `property` should be.
     */
    _skipTransition : function( element, property, value ) {
        var reflow,
            duration = element.style[ TRANSITION_DURATION ];

        // Set the duration to zero so it happens immediately
        element.style[ TRANSITION_DURATION ] = '0ms'; // ms needed for firefox!

        if ( $.isFunction( property ) ) {
            property();
        } else {
            element.style[ property ] = value;
        }

        // Force reflow
        reflow = element.offsetWidth;

        // Put the duration back
        element.style[ TRANSITION_DURATION ] = duration;
    },

    _addItems : function( $newItems, animateIn, isSequential ) {
        var self = this,
            $passed,
            passed;

        if ( !self.supported ) {
            animateIn = false;
        }

        $newItems.addClass('shuffle-item');
        self._initItems( $newItems );
        self._setTransitions( $newItems );
        self.$items = self._getItems();

        // Hide all items
        $newItems.css('opacity', 0);

        // Get ones that passed the current filter
        $passed = self._filter( undefined, $newItems );
        passed = $passed.get();

        // How many filtered elements?
        self._updateItemCount();

        if ( animateIn ) {
            self._layout( passed, null, true, true );

            if ( isSequential ) {
                self._setSequentialDelay( $passed );
            }

            self._revealAppended( $passed );
        } else {
            self._layout( passed );
        }
    },

    _revealAppended : function( $newFilteredItems ) {
        var self = this;

        setTimeout(function() {
            $newFilteredItems.each(function(i, el) {
                self.transition({
                    from: 'reveal',
                    $this: $(el),
                    opacity: 1
                });
            });
        }, self.revealAppendedDelay);
    },


    /**
     * Public Methods
     */

    /**
     * The magic. This is what makes the plugin 'shuffle'
     * @param {(string|Function)} [category] Category to filter by. Can be a function
     * @param {Object} [sortObj] A sort object which can sort the filtered set
     */
    shuffle : function( category, sortObj ) {
        var self = this;

        if ( !self.enabled ) {
            return;
        }

        if ( !category ) {
            category = 'all';
        }

        self._filter( category );
        // Save the last filter in case elements are appended.
        self.lastFilter = category;

        // How many filtered elements?
        self._updateItemCount();

        self._resetCols();

        // Shrink each concealed item
        self._shrink();

        // If given a valid sort object, save it so that _reLayout() will sort the items
        if ( sortObj ) {
            self.lastSort = sortObj;
        }
        // Update transforms on .filtered elements so they will animate to their new positions
        self._reLayout();
    },

    /**
     * Gets the .filtered elements, sorts them, and passes them to layout
     *
     * @param {Object} opts the options object for the sorted plugin
     * @param {boolean} [fromFilter] was called from Shuffle.filter method.
     */
    sort: function( opts, fromFilter, isOnlyPosition ) {
        var self = this,
            items = self.$items.filter('.filtered').sorted(opts);

        if ( !fromFilter ) {
            self._resetCols();
        }

        self._layout(items, function() {
            if (fromFilter) {
                self.filterEnd();
            }
            self.sortEnd();
        }, isOnlyPosition);

        self.lastSort = opts;
    },

    /**
     * Relayout everything
     */
    resized: function( isOnlyLayout ) {
        if ( this.enabled ) {

            if ( !isOnlyLayout ) {
                // Get updated colCount
                this._setColumns();
            }

            // Layout items
            this._reLayout();
        }
    },

    /**
     * Use this instead of `update()` if you don't need the columns and gutters updated
     * Maybe an image inside `shuffle` loaded (and now has a height), which means calculations
     * could be off.
     */
    layout : function() {
        this.update( true );
    },

    update : function( isOnlyLayout ) {
        this.resized( isOnlyLayout );
    },

    /**
     * New items have been appended to shuffle. Fade them in sequentially
     * @param {jQuery} $newItems jQuery collection of new items
     * @param {boolean} [animateIn] If false, the new items won't animate in
     * @param {boolean} [isSequential] If false, new items won't sequentially fade in
     */
    appended : function( $newItems, animateIn, isSequential ) {
        // True if undefined
        animateIn = animateIn === false ? false : true;
        isSequential = isSequential === false ? false : true;

        this._addItems( $newItems, animateIn, isSequential );
    },

    /**
     * Disables shuffle from updating dimensions and layout on resize
     */
    disable : function() {
        this.enabled = false;
    },

    /**
     * Enables shuffle again
     * @param {boolean} [isUpdateLayout=true] if undefined, shuffle will update columns and gutters
     */
    enable : function( isUpdateLayout ) {
        this.enabled = true;
        if ( isUpdateLayout !== false ) {
            this.update();
        }
    },

    /**
     * Remove 1 or more shuffle items
     * @param {jQuery} $collection A jQuery object containing one or more element in shuffle
     * @return {Shuffle} The shuffle object
     */
    remove : function( $collection ) {

        // If this isn't a jquery object, exit
        if ( !$collection.length || !$collection.jquery ) {
            return;
        }

        var self = this;

        // Hide collection first
        self._shrink( $collection, function() {
            var shuffle = this;

            // Remove the collection in the callback
            $collection.remove();

            // Update the items, layout, count and fire off `removed` event
            setTimeout(function() {
                shuffle.$items = shuffle._getItems();
                shuffle.layout();
                shuffle._updateItemCount();
                shuffle._fire( 'removed', [ $collection, shuffle ] );

                // Let it get garbage collected
                $collection = null;
            }, 0);
        });

        // Process changes
        self._processStyleQueue();

        return self;
    },

    /**
     * Destroys shuffle, removes events, styles, and classes
     */
    destroy: function() {
        var self = this;

        // If there is more than one shuffle instance on the page,
        // removing the resize handler from the window would remove them
        // all. This is why a unique value is needed.
        self.$window.off('.' + self.unique);

        // Reset container styles
        self.$container
            .removeClass( SHUFFLE )
            .removeAttr('style')
            .removeData( SHUFFLE );

        // Reset individual item styles
        self.$items
            .removeAttr('style')
            .removeClass('concealed filtered shuffle-item');

        // Null DOM references
        self.$window = null;
        self.$items = null;
        self.$container = null;
        self.$sizer = null;
        self.sizer = null;

        // Set a flag so if a debounced resize has been triggered,
        // it can first check if it is actually destroyed and not doing anything
        self.destroyed = true;
    }

};

// Overrideable options
Shuffle.options = {
    group: 'all', // Filter group
    speed: 250, // Transition/animation speed (milliseconds)
    easing: 'ease-out', // css easing function to use
    itemSelector: '', // e.g. '.picture-item'
    sizer: null, // sizer element. Can be anything columnWidth is
    gutterWidth: 0, // a static number or function that tells the plugin how wide the gutters between columns are (in pixels)
    columnWidth: 0, // a static number or function that returns a number which tells the plugin how wide the columns are (in pixels)
    delimeter: null, // if your group is not json, and is comma delimeted, you could set delimeter to ','
    buffer: 0, // useful for percentage based heights when they might not always be exactly the same (in pixels)
    initialSort: null, // Shuffle can be initialized with a sort object. It is the same object given to the sort method
    throttle: $.throttle || null, // By default, shuffle will try to throttle the resize event. This option will change the method it uses
    throttleTime: 300, // How often shuffle can be called on resize (in milliseconds)
    sequentialFadeDelay: 150, // Delay between each item that fades in when adding items
    supported: CAN_TRANSITION_TRANSFORMS // supports transitions and transforms
};

// Not overrideable
Shuffle.settings = {
    $sizer: null,
    useSizer: false,
    itemCss : { // default CSS for each item
        position: 'absolute',
        top: 0,
        left: 0
    },
    offset: { top: 0, left: 0 },
    revealAppendedDelay: 300,
    keepSorted : true, // Keep sorted when shuffling/layout
    enabled: true,
    destroyed: false,
    styleQueue: []
};


// Plugin definition
$.fn.shuffle = function( opts ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
        var $this = $( this ),
            shuffle = $this.data( SHUFFLE );

        // If we don't have a stored shuffle, make a new one and save it
        if ( !shuffle ) {
            shuffle = new Shuffle( $this, opts );
            $this.data( SHUFFLE, shuffle );
        }

        if ( typeof opts === 'string' && shuffle[ opts ] ) {
            shuffle[ opts ].apply( shuffle, args );
        }
    });
};

})(jQuery, Modernizr);
;
(function($) {
    Drupal.behaviors.dexp_portfolio = {
        attach: function(context, settings) {
            if (context.location == null) {
                $.each(settings.dexp_portfolio, function(filter, view) {
                    var $grid = $('#' + view, context), $filter = $('#' + filter, context);
                    var $newitems = $('#' + view, context).find('.node').not('.shuffle-item');
                    $grid.shuffle({
                        itemSelector: '.node',
                        speed: 500
                    });
                    $grid.shuffle('appended', $newitems);
                    $grid.shuffle('shuffle', 'all');
                });
            }
            $.each(settings.dexp_portfolio, function(filter, view) {
                var $grid = $('#' + view, context), $filter = $('#' + filter, context), $sort = $grid.parent().find('.portfolio-sort') || null;
                $grid.shuffle({
                    itemSelector: '.node',
                    speed: 500
                });
                $filter.find('a').click(function(e) {
                    e.preventDefault();
                    var $this = $(this), filter = $this.data('filter');
                    if (filter == '*') {
                        $grid.shuffle('shuffle', 'all');
                    } else {
                        $grid.shuffle('shuffle', function($el, shuffle) {
                            // Only search elements in the current group
                            if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
                                return false;
                            }
                            return $el.hasClass(filter);
                        });
                    }
                    $(this).parents('.dexp-portfolio-filter').find('a').removeClass('active');
                    $(this).addClass('active');
                    return false;
                });
                $grid.shuffle('shuffle', 'all');
                $(window).load(function() {
                    $grid.shuffle('shuffle', 'all');
                });
                //Sort
                if ($sort.length == 1) {
                    $sort.find('select').change(function() {
                        var datasort = $(this).val();
                        var opts = {};
                        if (datasort == "title") {
                            opts.by = function($el) {
                                return $el.data('title');
                            };
                        } else if (datasort == "date") {
                            opts.by = function($el) {
                                return $el.data('created');
                            };
                        }
                        $grid.shuffle('sort', opts);
                    })
                }
            });
        }
    }
})(jQuery);
/*
 jQuery(document).ready(function($){
 var $grid = $('#page-dexp-portfolio');
 $grid.shuffle({
 itemSelector: '.node',
 speed: 500
 });
 $('ul.dexp-portfolio-filter li a').click(function(){
 var $this = $(this), filter = $this.data('filter');
 if(filter == '*'){
 $grid.shuffle('shuffle', 'all');
 }else{
 $grid.shuffle('shuffle', function($el, shuffle) {
 // Only search elements in the current group
 if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
 return false;
 }
 return $el.hasClass(filter);
 });
 }
 $(this).parents('.dexp-portfolio-filter').find('a').removeClass('active');
 $(this).addClass('active');
 return false;
 });
 $(window).load(function(){
 $grid.shuffle('shuffle', 'all');
 });
 })
 */;
/*
 * transform: A jQuery cssHooks adding cross-browser 2d transform capabilities to $.fn.css() and $.fn.animate()
 *
 * limitations:
 * - requires jQuery 1.4.3+
 * - Should you use the *translate* property, then your elements need to be absolutely positionned in a relatively positionned wrapper **or it will fail in IE678**.
 * - transformOrigin is not accessible
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery.transform.js
 *
 * Copyright 2011 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 *
 */
(function( $, window, document, Math, undefined ) {

/*
 * Feature tests and global variables
 */
var div = document.createElement("div"),
	divStyle = div.style,
	suffix = "Transform",
	testProperties = [
		"O" + suffix,
		"ms" + suffix,
		"Webkit" + suffix,
		"Moz" + suffix
	],
	i = testProperties.length,
	supportProperty,
	supportMatrixFilter,
	supportFloat32Array = "Float32Array" in window,
	propertyHook,
	propertyGet,
	rMatrix = /Matrix([^)]*)/,
	rAffine = /^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/,
	_transform = "transform",
	_transformOrigin = "transformOrigin",
	_translate = "translate",
	_rotate = "rotate",
	_scale = "scale",
	_skew = "skew",
	_matrix = "matrix";

// test different vendor prefixes of these properties
while ( i-- ) {
	if ( testProperties[i] in divStyle ) {
		$.support[_transform] = supportProperty = testProperties[i];
		$.support[_transformOrigin] = supportProperty + "Origin";
		continue;
	}
}
// IE678 alternative
if ( !supportProperty ) {
	$.support.matrixFilter = supportMatrixFilter = divStyle.filter === "";
}

// px isn't the default unit of these properties
$.cssNumber[_transform] = $.cssNumber[_transformOrigin] = true;

/*
 * fn.css() hooks
 */
if ( supportProperty && supportProperty != _transform ) {
	// Modern browsers can use jQuery.cssProps as a basic hook
	$.cssProps[_transform] = supportProperty;
	$.cssProps[_transformOrigin] = supportProperty + "Origin";

	// Firefox needs a complete hook because it stuffs matrix with "px"
	if ( supportProperty == "Moz" + suffix ) {
		propertyHook = {
			get: function( elem, computed ) {
				return (computed ?
					// remove "px" from the computed matrix
					$.css( elem, supportProperty ).split("px").join(""):
					elem.style[supportProperty]
				);
			},
			set: function( elem, value ) {
				// add "px" to matrices
				elem.style[supportProperty] = /matrix\([^)p]*\)/.test(value) ?
					value.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/, _matrix+"$1$2px,$3px"):
					value;
			}
		};
	/* Fix two jQuery bugs still present in 1.5.1
	 * - rupper is incompatible with IE9, see http://jqbug.com/8346
	 * - jQuery.css is not really jQuery.cssProps aware, see http://jqbug.com/8402
	 */
	} else if ( /^1\.[0-5](?:\.|$)/.test($.fn.jquery) ) {
		propertyHook = {
			get: function( elem, computed ) {
				return (computed ?
					$.css( elem, supportProperty.replace(/^ms/, "Ms") ):
					elem.style[supportProperty]
				);
			}
		};
	}
	/* TODO: leverage hardware acceleration of 3d transform in Webkit only
	else if ( supportProperty == "Webkit" + suffix && support3dTransform ) {
		propertyHook = {
			set: function( elem, value ) {
				elem.style[supportProperty] = 
					value.replace();
			}
		}
	}*/

} else if ( supportMatrixFilter ) {
	propertyHook = {
		get: function( elem, computed, asArray ) {
			var elemStyle = ( computed && elem.currentStyle ? elem.currentStyle : elem.style ),
				matrix, data;

			if ( elemStyle && rMatrix.test( elemStyle.filter ) ) {
				matrix = RegExp.$1.split(",");
				matrix = [
					matrix[0].split("=")[1],
					matrix[2].split("=")[1],
					matrix[1].split("=")[1],
					matrix[3].split("=")[1]
				];
			} else {
				matrix = [1,0,0,1];
			}

			if ( ! $.cssHooks[_transformOrigin] ) {
				matrix[4] = elemStyle ? parseInt(elemStyle.left, 10) || 0 : 0;
				matrix[5] = elemStyle ? parseInt(elemStyle.top, 10) || 0 : 0;

			} else {
				data = $._data( elem, "transformTranslate", undefined );
				matrix[4] = data ? data[0] : 0;
				matrix[5] = data ? data[1] : 0;
			}

			return asArray ? matrix : _matrix+"(" + matrix + ")";
		},
		set: function( elem, value, animate ) {
			var elemStyle = elem.style,
				currentStyle,
				Matrix,
				filter,
				centerOrigin;

			if ( !animate ) {
				elemStyle.zoom = 1;
			}

			value = matrix(value);

			// rotate, scale and skew
			Matrix = [
				"Matrix("+
					"M11="+value[0],
					"M12="+value[2],
					"M21="+value[1],
					"M22="+value[3],
					"SizingMethod='auto expand'"
			].join();
			filter = ( currentStyle = elem.currentStyle ) && currentStyle.filter || elemStyle.filter || "";

			elemStyle.filter = rMatrix.test(filter) ?
				filter.replace(rMatrix, Matrix) :
				filter + " progid:DXImageTransform.Microsoft." + Matrix + ")";

			if ( ! $.cssHooks[_transformOrigin] ) {

				// center the transform origin, from pbakaus's Transformie http://github.com/pbakaus/transformie
				if ( (centerOrigin = $.transform.centerOrigin) ) {
					elemStyle[centerOrigin == "margin" ? "marginLeft" : "left"] = -(elem.offsetWidth/2) + (elem.clientWidth/2) + "px";
					elemStyle[centerOrigin == "margin" ? "marginTop" : "top"] = -(elem.offsetHeight/2) + (elem.clientHeight/2) + "px";
				}

				// translate
				// We assume that the elements are absolute positionned inside a relative positionned wrapper
				elemStyle.left = value[4] + "px";
				elemStyle.top = value[5] + "px";

			} else {
				$.cssHooks[_transformOrigin].set( elem, value );
			}
		}
	};
}
// populate jQuery.cssHooks with the appropriate hook if necessary
if ( propertyHook ) {
	$.cssHooks[_transform] = propertyHook;
}
// we need a unique setter for the animation logic
propertyGet = propertyHook && propertyHook.get || $.css;

/*
 * fn.animate() hooks
 */
$.fx.step.transform = function( fx ) {
	var elem = fx.elem,
		start = fx.start,
		end = fx.end,
		pos = fx.pos,
		transform = "",
		precision = 1E5,
		i, startVal, endVal, unit;

	// fx.end and fx.start need to be converted to interpolation lists
	if ( !start || typeof start === "string" ) {

		// the following block can be commented out with jQuery 1.5.1+, see #7912
		if ( !start ) {
			start = propertyGet( elem, supportProperty );
		}

		// force layout only once per animation
		if ( supportMatrixFilter ) {
			elem.style.zoom = 1;
		}

		// replace "+=" in relative animations (-= is meaningless with transforms)
		end = end.split("+=").join(start);

		// parse both transform to generate interpolation list of same length
		$.extend( fx, interpolationList( start, end ) );
		start = fx.start;
		end = fx.end;
	}

	i = start.length;

	// interpolate functions of the list one by one
	while ( i-- ) {
		startVal = start[i];
		endVal = end[i];
		unit = +false;

		switch ( startVal[0] ) {

			case _translate:
				unit = "px";
			case _scale:
				unit || ( unit = "");

				transform = startVal[0] + "(" +
					Math.round( (startVal[1][0] + (endVal[1][0] - startVal[1][0]) * pos) * precision ) / precision + unit +","+
					Math.round( (startVal[1][1] + (endVal[1][1] - startVal[1][1]) * pos) * precision ) / precision + unit + ")"+
					transform;
				break;

			case _skew + "X":
			case _skew + "Y":
			case _rotate:
				transform = startVal[0] + "(" +
					Math.round( (startVal[1] + (endVal[1] - startVal[1]) * pos) * precision ) / precision +"rad)"+
					transform;
				break;
		}
	}

	fx.origin && ( transform = fx.origin + transform );

	propertyHook && propertyHook.set ?
		propertyHook.set( elem, transform, +true ):
		elem.style[supportProperty] = transform;
};

/*
 * Utility functions
 */

// turns a transform string into its "matrix(A,B,C,D,X,Y)" form (as an array, though)
function matrix( transform ) {
	transform = transform.split(")");
	var
			trim = $.trim
		, i = -1
		// last element of the array is an empty string, get rid of it
		, l = transform.length -1
		, split, prop, val
		, prev = supportFloat32Array ? new Float32Array(6) : []
		, curr = supportFloat32Array ? new Float32Array(6) : []
		, rslt = supportFloat32Array ? new Float32Array(6) : [1,0,0,1,0,0]
		;

	prev[0] = prev[3] = rslt[0] = rslt[3] = 1;
	prev[1] = prev[2] = prev[4] = prev[5] = 0;

	// Loop through the transform properties, parse and multiply them
	while ( ++i < l ) {
		split = transform[i].split("(");
		prop = trim(split[0]);
		val = split[1];
		curr[0] = curr[3] = 1;
		curr[1] = curr[2] = curr[4] = curr[5] = 0;

		switch (prop) {
			case _translate+"X":
				curr[4] = parseInt(val, 10);
				break;

			case _translate+"Y":
				curr[5] = parseInt(val, 10);
				break;

			case _translate:
				val = val.split(",");
				curr[4] = parseInt(val[0], 10);
				curr[5] = parseInt(val[1] || 0, 10);
				break;

			case _rotate:
				val = toRadian(val);
				curr[0] = Math.cos(val);
				curr[1] = Math.sin(val);
				curr[2] = -Math.sin(val);
				curr[3] = Math.cos(val);
				break;

			case _scale+"X":
				curr[0] = +val;
				break;

			case _scale+"Y":
				curr[3] = val;
				break;

			case _scale:
				val = val.split(",");
				curr[0] = val[0];
				curr[3] = val.length>1 ? val[1] : val[0];
				break;

			case _skew+"X":
				curr[2] = Math.tan(toRadian(val));
				break;

			case _skew+"Y":
				curr[1] = Math.tan(toRadian(val));
				break;

			case _matrix:
				val = val.split(",");
				curr[0] = val[0];
				curr[1] = val[1];
				curr[2] = val[2];
				curr[3] = val[3];
				curr[4] = parseInt(val[4], 10);
				curr[5] = parseInt(val[5], 10);
				break;
		}

		// Matrix product (array in column-major order)
		rslt[0] = prev[0] * curr[0] + prev[2] * curr[1];
		rslt[1] = prev[1] * curr[0] + prev[3] * curr[1];
		rslt[2] = prev[0] * curr[2] + prev[2] * curr[3];
		rslt[3] = prev[1] * curr[2] + prev[3] * curr[3];
		rslt[4] = prev[0] * curr[4] + prev[2] * curr[5] + prev[4];
		rslt[5] = prev[1] * curr[4] + prev[3] * curr[5] + prev[5];

		prev = [rslt[0],rslt[1],rslt[2],rslt[3],rslt[4],rslt[5]];
	}
	return rslt;
}

// turns a matrix into its rotate, scale and skew components
// algorithm from http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp
function unmatrix(matrix) {
	var
			scaleX
		, scaleY
		, skew
		, A = matrix[0]
		, B = matrix[1]
		, C = matrix[2]
		, D = matrix[3]
		;

	// Make sure matrix is not singular
	if ( A * D - B * C ) {
		// step (3)
		scaleX = Math.sqrt( A * A + B * B );
		A /= scaleX;
		B /= scaleX;
		// step (4)
		skew = A * C + B * D;
		C -= A * skew;
		D -= B * skew;
		// step (5)
		scaleY = Math.sqrt( C * C + D * D );
		C /= scaleY;
		D /= scaleY;
		skew /= scaleY;
		// step (6)
		if ( A * D < B * C ) {
			A = -A;
			B = -B;
			skew = -skew;
			scaleX = -scaleX;
		}

	// matrix is singular and cannot be interpolated
	} else {
		// In this case the elem shouldn't be rendered, hence scale == 0
		scaleX = scaleY = skew = 0;
	}

	// The recomposition order is very important
	// see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
	return [
		[_translate, [+matrix[4], +matrix[5]]],
		[_rotate, Math.atan2(B, A)],
		[_skew + "X", Math.atan(skew)],
		[_scale, [scaleX, scaleY]]
	];
}

// build the list of transform functions to interpolate
// use the algorithm described at http://dev.w3.org/csswg/css3-2d-transforms/#animation
function interpolationList( start, end ) {
	var list = {
			start: [],
			end: []
		},
		i = -1, l,
		currStart, currEnd, currType;

	// get rid of affine transform matrix
	( start == "none" || isAffine( start ) ) && ( start = "" );
	( end == "none" || isAffine( end ) ) && ( end = "" );

	// if end starts with the current computed style, this is a relative animation
	// store computed style as the origin, remove it from start and end
	if ( start && end && !end.indexOf("matrix") && toArray( start ).join() == toArray( end.split(")")[0] ).join() ) {
		list.origin = start;
		start = "";
		end = end.slice( end.indexOf(")") +1 );
	}

	if ( !start && !end ) { return; }

	// start or end are affine, or list of transform functions are identical
	// => functions will be interpolated individually
	if ( !start || !end || functionList(start) == functionList(end) ) {

		start && ( start = start.split(")") ) && ( l = start.length );
		end && ( end = end.split(")") ) && ( l = end.length );

		while ( ++i < l-1 ) {
			start[i] && ( currStart = start[i].split("(") );
			end[i] && ( currEnd = end[i].split("(") );
			currType = $.trim( ( currStart || currEnd )[0] );

			append( list.start, parseFunction( currType, currStart ? currStart[1] : 0 ) );
			append( list.end, parseFunction( currType, currEnd ? currEnd[1] : 0 ) );
		}

	// otherwise, functions will be composed to a single matrix
	} else {
		list.start = unmatrix(matrix(start));
		list.end = unmatrix(matrix(end))
	}

	return list;
}

function parseFunction( type, value ) {
	var
		// default value is 1 for scale, 0 otherwise
		defaultValue = +(!type.indexOf(_scale)),
		scaleX,
		// remove X/Y from scaleX/Y & translateX/Y, not from skew
		cat = type.replace( /e[XY]/, "e" );

	switch ( type ) {
		case _translate+"Y":
		case _scale+"Y":

			value = [
				defaultValue,
				value ?
					parseFloat( value ):
					defaultValue
			];
			break;

		case _translate+"X":
		case _translate:
		case _scale+"X":
			scaleX = 1;
		case _scale:

			value = value ?
				( value = value.split(",") ) &&	[
					parseFloat( value[0] ),
					parseFloat( value.length>1 ? value[1] : type == _scale ? scaleX || value[0] : defaultValue+"" )
				]:
				[defaultValue, defaultValue];
			break;

		case _skew+"X":
		case _skew+"Y":
		case _rotate:
			value = value ? toRadian( value ) : 0;
			break;

		case _matrix:
			return unmatrix( value ? toArray(value) : [1,0,0,1,0,0] );
			break;
	}

	return [[ cat, value ]];
}

function isAffine( matrix ) {
	return rAffine.test(matrix);
}

function functionList( transform ) {
	return transform.replace(/(?:\([^)]*\))|\s/g, "");
}

function append( arr1, arr2, value ) {
	while ( value = arr2.shift() ) {
		arr1.push( value );
	}
}

// converts an angle string in any unit to a radian Float
function toRadian(value) {
	return ~value.indexOf("deg") ?
		parseInt(value,10) * (Math.PI * 2 / 360):
		~value.indexOf("grad") ?
			parseInt(value,10) * (Math.PI/200):
			parseFloat(value);
}

// Converts "matrix(A,B,C,D,X,Y)" to [A,B,C,D,X,Y]
function toArray(matrix) {
	// remove the unit of X and Y for Firefox
	matrix = /([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(matrix);
	return [matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6]];
}

$.transform = {
	centerOrigin: "margin"
};

})( jQuery, window, document, Math );
;
jQuery(document).ready(function($) {
    $('.dexp-dropdown a.active').each(function() {
        $(this).parents('li.expanded').addClass('active');
    });
    $('.dexp-dropdown li.expanded').each(function() {
        var $this = $(this), $toggle = $('<span class="menu-toggler fa fa-angle-right"></span>');
        $toggle.click(function() {
            $(this).toggleClass('fa-angle-right fa-angle-down');
            $this.find('>ul,>.dexp-menu-mega').toggleClass('menu-open');
        });
        $this.append($toggle);
    });
    $('.dexp-dropdown .menu-attach-block-wrapper').parent('li').addClass('block-attach');
    $('.dexp-menu-toggler').click(function() {
        var $menu = $($(this).data('target'));
        if ($menu != null) {
            $menu.toggleClass('mobile-open');
        }
        return false;
    });
    $('.dexp-dropdown ul li').hover(function() {
        var container_width = $('.container').width();
        var $submenu = $(this).find('>ul,>.dexp-menu-mega').not('.container'), ww = $(window).width(), innerw = ww - (ww - container_width) / 2;
        if ($submenu.length === 0)
            return;
        /*RTL*/
        if($('body').hasClass('rtl')){
            var limit = (ww - container_width)/2;
            var offsetX = limit-$submenu.offset().left;
            if(offsetX > 0){
                var transformX = offsetX + 'px';
                $submenu.css({
                    transform: 'translateX('+transformX+')'
                });
            }
        }else{
            /*LTR*/
            var offsetX = $submenu.offset().left + $submenu.width() - innerw;
            if (offsetX > 0) {
                var transformX = 0 - offsetX + 'px';
                $submenu.css({
                   transform: 'translateX('+transformX+')'
                });
            }
        }
    }, function() {
        var $submenu = $(this).find('>ul,>.dexp-menu-mega');
        if ($submenu.length === 0)
            return;
        $submenu.css({
            transform: 'translateX(0)'
        });
    });
    $('.dexp-dropdown .container').each(function(){
       $(this).parent('li').addClass('dexp-static')
    });
});;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:v()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:50,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(p()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",B),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&I(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},p=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},v=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.delegate("a","click",q)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.delegate(".bx-start","click",k),o.controls.autoEl.delegate(".bx-stop","click",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},q=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},I=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),"horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0)}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},B=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider())};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&I(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",51).fadeIn(o.settings.speed,function(){t(this).css("zIndex",50),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",p()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),I(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",B))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);;
(function($){
	// Responsive Slideshow
	Drupal.behaviors.dexp_bxslider = {
		attach: function(context,settings) {
			$('.dexp-bxslider').each(function(index){
        
				var $this = $(this),responsiveID = $(this).attr('id'),bxready = $this.data('bx-ready');
        if(bxready == 1) return;
				var options = jmbxAdjustOptions(settings.dexpbxsliders[responsiveID],$(this).innerWidth());
        $(this).attr({
          'data-itemwidth': options.slideWidth
        })
				var slide = $(this).bxSlider(options);
        $this.data({'bx-ready':1});
        var windowW = $(window).width();
        $(window).resize(function(){
          waitForFinalEvent(function () {
            if(windowW == $(window).width()) return;
            windowW = $(window).width();
            slide.destroySlider();
            options = jmbxAdjustOptions(settings.dexpbxsliders[responsiveID],$this.innerWidth());
            slide = $this.bxSlider(options);
          }, 500, responsiveID)
        })
			});
		}
	};
	
	/*Adjust bxslider options to fix on any screen*/
	function jmbxAdjustOptions(options, container_width){
		var _options = {};
		$.extend(_options, options);
		
		if((_options.slideWidth*_options.maxSlides + (_options.slideMargin*(_options.maxSlides-1))) < container_width){
			_options.slideWidth = (container_width-(_options.slideMargin*(_options.maxSlides-1)))/_options.maxSlides;
		}else{
			_options.maxSlides = Math.floor((container_width-(_options.slideMargin*(_options.maxSlides-1)))/_options.slideWidth);
			_options.maxSlides = _options.maxSlides == 0?1:_options.maxSlides;
			_options.slideWidth = (container_width-(_options.slideMargin*(_options.maxSlides-1)))/_options.maxSlides;
		}
    return _options;
	}
  //
	var waitForFinalEvent = (function () {
    var d = {};
    return function (a, b, c) {
      if (!c) {
        c = "Don't call this twice without a uniqueId"
      }
      if (d[c]) {
        clearTimeout(d[c]);
      }
      d[c] = setTimeout(a, b);
    }
  })();
})(jQuery);;
(function ($) {

Drupal.googleanalytics = {};

$(document).ready(function() {

  // Attach mousedown, keyup, touchstart events to document only and catch
  // clicks on all elements.
  $(document.body).bind("mousedown keyup touchstart", function(event) {

    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      // Is the clicked URL internal?
      if (Drupal.googleanalytics.isInternal(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox')) {
          // Do nothing here. The custom event will handle all tracking.
          //console.info("Click on .colorbox item has been detected.");
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (Drupal.settings.googleanalytics.trackDownload && Drupal.googleanalytics.isDownload(this.href)) {
          // Download link clicked.
          ga("send", "event", "Downloads", Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(), Drupal.googleanalytics.getPageUrl(this.href));
        }
        else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          ga("send", "pageview", { "page": Drupal.googleanalytics.getPageUrl(this.href) });
        }
      }
      else {
        if (Drupal.settings.googleanalytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          ga("send", "event", "Mails", "Click", this.href.substring(7));
        }
        else if (Drupal.settings.googleanalytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (Drupal.settings.googleanalytics.trackDomainMode != 2 || (Drupal.settings.googleanalytics.trackDomainMode == 2 && !Drupal.googleanalytics.isCrossDomain(this.hostname, Drupal.settings.googleanalytics.trackCrossDomains))) {
            // External link clicked / No top-level cross domain clicked.
            ga("send", "event", "Outbound links", "Click", this.href);
          }
        }
      }
    });
  });

  // Track hash changes as unique pageviews, if this option has been enabled.
  if (Drupal.settings.googleanalytics.trackUrlFragments) {
    window.onhashchange = function() {
      ga('send', 'pageview', location.pathname + location.search + location.hash);
    }
  }

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  $(document).bind("cbox_complete", function () {
    var href = $.colorbox.element().attr("href");
    if (href) {
      ga("send", "pageview", { "page": Drupal.googleanalytics.getPageUrl(href) });
    }
  });

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
Drupal.googleanalytics.isCrossDomain = function (hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
};

/**
 * Check whether this is a download URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isDownload = function (url) {
  var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  return isDownload.test(url);
};

/**
 * Check whether this is an absolute internal URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternal = function (url) {
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return isInternal.test(url);
};

/**
 * Check whether this is a special URL or not.
 *
 * URL types:
 *  - gotwo.module /go/* links.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternalSpecial = function (url) {
  var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
  return isInternalSpecial.test(url);
};

/**
 * Extract the relative internal URL from an absolute internal URL.
 *
 * Examples:
 * - http://mydomain.com/node/1 -> /node/1
 * - http://example.com/foo/bar -> http://example.com/foo/bar
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   Internal website URL
 */
Drupal.googleanalytics.getPageUrl = function (url) {
  var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return url.replace(extractInternalUrl, '');
};

/**
 * Extract the download file extension from the URL.
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   The file extension of the passed url. e.g. "zip", "txt"
 */
Drupal.googleanalytics.getDownloadExtension = function (url) {
  var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  var extension = extractDownloadextension.exec(url);
  return (extension === null) ? '' : extension[1];
};

})(jQuery);
;
