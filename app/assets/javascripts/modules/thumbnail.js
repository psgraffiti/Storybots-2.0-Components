//
// THUMBNAIL PUBLIC CLASS DEFINITION
// ==============================
//

$(document).ready(function() {
  +function ($) { "use strict";

  placeMemberBadges()

  function placeMemberBadges() {
    $('.thumbnail[disabled="disabled"]').prepend('<div class="member"></div>');
  }

  }(jQuery);
});