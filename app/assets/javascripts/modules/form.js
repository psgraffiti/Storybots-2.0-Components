//
// CHECKBOX PUBLIC CLASS DEFINITION
// ==============================
//

$(document).ready(function() {
  +function ($) { "use strict";

  $('[type="checkbox"]').click(function() {
    var $label = $('label[for="'+ $(this).attr('id') +'"]')
    $label.children('i')
      .toggleClass('fa-square-o')
      .toggleClass('fa-check-square-o')
  });

  }(jQuery);
});