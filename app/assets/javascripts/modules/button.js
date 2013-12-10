//
// BUTTON PUBLIC CLASS DEFINITION
// ==============================
//

$(document).ready(function(){
  +function ($) { "use strict";

    var Button = function (element) {
      this.$element = $(element)
    }

    Button.prototype.toggle = function () {
      var $parent = this.$element.closest('[data-toggle="buttons"]')
      var changed = true

      if ($parent.length) {
        var $this = this.$element
          // check if clicking on current one
        if ($this.prop('checked') && this.$element.hasClass('active')) {
          changed = false
        }
        else {
          $parent.find('.active').removeClass('active')
          $parent.find('.hover').removeClass('hover')
        }
        if (changed) {
          $this.prop('checked', !this.$element.hasClass('active')).trigger('change')
        }
      }

      if (changed) {
        this.$element.toggleClass('active')
        this.$element.toggleClass('hover')
      }
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    var old = $.fn.button

    $.fn.button = function (option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('button')

        if (!data) {
          $this.data('button', (data = new Button(this)))
        }

        data.toggle()
      })
    }

    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
      $.fn.button = old
      return this
    }


    // BUTTON DATA-API
    // ===============

    $(document).on('click.button', '[data-toggle^=button]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) {
        $btn = $btn.closest('.btn')
      }

      $btn.button('toggle')
      e.preventDefault()
    })

  }(jQuery);
});