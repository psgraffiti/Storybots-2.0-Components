//
// VIDEO PLAYER PUBLIC CLASS DEFINITION
// ==============================
//

$(document).ready(function() {
  +function ($) { "use strict";

  moveHandle()

  $(window).resize(function(){
    moveHandle()
  })

  $("#expand").click(function() {
    $(this)
      .toggleClass('expand')
      .toggleClass('contract')
  });

  $("#play").click(function() {
    $(this)
      .toggleClass('play')
      .toggleClass('pause')
  });

  $('.progress').resize(function() {debugger
    moveHandle()
  })

  function moveHandle() {
    $('#handle').css('left', $('.progress').css('width'))
  }

    }(jQuery);
});