jQuery(document).ready(function($){
  $('.dexp-dropdown a.active').each(function(){
    $(this).parents('li.expanded').addClass('active');
  });
})