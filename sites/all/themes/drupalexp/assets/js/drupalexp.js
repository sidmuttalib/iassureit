(function($) {
    Drupal.behaviors.drupalexp_base = {
        attach: function(context, settings) {
            var lightbox2 = settings.lightbox2 || null;
            if(lightbox2 !== null){
                console.log('has lightbox2');
            };
        }
    };
    /*Set detect device*/
    var setDevice = function(){
        $('body').removeClass('dexp-xs dexp-sm dexp-md dexp-lg');
        var window_width = $(window).width();
        if(window_width < 768){
            $('body').addClass('dexp-xs');
        }else if(window_width < 993){
            $('body').addClass('dexp-sm');
        }else if(window_width < 1200){
            $('body').addClass('dexp-md');
        }else{
            $('body').addClass('dexp-lg');
        }
    };
    $(document).ready(function(){
      setDevice();
      console.log('contact us');
      var url = $(location).attr('href'); //get current url
      var encodedUrl = encodeURIComponent(url);
      console.log(encodedUrl);
      $('#block-contact-form-blocks-0 .inner').append('<ul></ul>');
        $('#block-contact-form-blocks-0 .inner > ul').append('<li><a class="social-share-facebook" title="Facebook">Facebook</a>&nbsp;</li>');
        $('#block-contact-form-blocks-0 .inner > ul').append('<li><a class="social-share-googleplus" title="Google Plus">Google Plus</a>&nbsp;</li>');
        $('#block-contact-form-blocks-0 .inner > ul').append('<li><a class="social-share-linkedin" title="LinkedIn">LinkedIn</a>&nbsp;</li>');
        $('#block-contact-form-blocks-0 .inner > ul').append('<li><a class="social-share-stumbleupon" title="StumbleUpon">StumbleUpon</a>&nbsp;</li>');
        $('#block-contact-form-blocks-0 .inner > ul').append('<li><a class="social-share-twitter" title="Twitter">Twitter</a>&nbsp;</li>');
        $('#block-contact-form-blocks-0 .inner > ul').append('<li><a class="social-share-contact" title="Contact Us" alt = "Contact Us"><div class="contact-icon"></div></a>&nbsp;</li>');
          $('#block-contact-form-blocks-0 .inner ul li a').each(function(){
            console.log($(this).hasClass("social-share-facebook").toString());
            if($(this).hasClass("social-share-facebook")){
              var urlF = "http://facebook.com/sharer.php?u="+ encodedUrl;
              $(this).attr('href',urlF);
              console.log(urlF);
            }else if($(this).hasClass("social-share-googleplus")){
              var urlG = "https://plus.google.com/share?url="+encodedUrl;
              $(this).attr('href',urlG);
            }else if($(this).hasClass("social-share-linkedin")){
              var urlL = "http://www.linkedin.com/shareArticle?url="+encodedUrl;
              $(this).attr('href',urlL);
            }else if($(this).hasClass("social-share-stumbleupon")){
              var urlS = "http://stumbleupon.com/submit?url="+encodedUrl;
              $(this).attr('href',urlS);
            }else if($(this).hasClass("social-share-twitter")){
              var urlT = "http://twitter.com/intent/tweet?url="+encodedUrl;
              $(this).attr('href',urlT);
            }else{
              //For other social meadia Icons..........

            }
            var viewportHeight = $(window).height();
            var heightSlim = viewportHeight*0.85+'px';
          $('#block-contact-form-blocks-0 .content').slimScroll({
                // width: '300px',
                height: heightSlim,
                size: '6px',
                position: 'right',
                color: '#198dc7',
                // alwaysVisible: true,
                // distance: '1px',
                // start: $('#child_image_element'),
                railVisible: true,
                railColor: ' #222222 ',
                railOpacity: 0.2,
                wheelStep: 10,
                allowPageScroll: false,
                disableFadeOut: false
            });

          });


      $('.contactus .block-title').click(function(){
        $('.region-content #block-contact-form-blocks-0').toggleClass('active');
      });
      $('.contact-icon').click(function(){
        $('.region-content #block-contact-form-blocks-0').toggleClass('active');
      });
      var viewportHeight1 = $(window).height();
      var docHeight = screen.availHeight;//$(document).height();
      var height = viewportHeight1*1.5 + "px";
      $('#block-contact-form-blocks-0 ').css("min-height", height);
      $('#block-contact-form-blocks-0 .content').height(viewportHeight1*0.85);
  });
    $(window).bind('resize',function(){
        setDevice();
    });
})(jQuery);
