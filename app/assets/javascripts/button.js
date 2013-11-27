$(document).ready(function(){
  +function ($) { "use strict";

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
      this.$element = $(element)
      this.options  = $.extend({}, Button.DEFAULTS, options)
    }

    Button.DEFAULTS = {
      loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
      var d    = 'disabled'
      var $el  = this.$element
      var val  = $el.is('input') ? 'val' : 'html'
      var data = $el.data()

      state = state + 'Text'

      if (!data.resetText) $el.data('resetText', $el[val]())

      $el[val](data[state] || this.options[state])

      // push to event loop to allow forms to submit
      setTimeout(function () {
        state == 'loadingText' ?
          $el.addClass(d).attr(d, d) :
          $el.removeClass(d).removeAttr(d);
      }, 0)
    }

    Button.prototype.toggle = function () {
      var $parent = this.$element.closest('[data-toggle="buttons"]')
      var changed = true

      if ($parent.length) {
        var $this = this.$element
          // see if clicking on current one
        if ($this.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else {
          $parent.find('.active').removeClass('active')
          $parent.find('.hover').removeClass('hover')
        }
        if (changed) $this.prop('checked', !this.$element.hasClass('active')).trigger('change')
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
        var options = typeof option == 'object' && option

        if (!data) $this.data('button', (data = new Button(this, options)))

        if (option == 'toggle') data.toggle()
        else if (option) data.setState(option)
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

    $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
      var $btn = $(e.target)
      if (!$btn.is('button')) $btn = $btn.closest('button')
      $btn.button('toggle')
      e.preventDefault()
    })

  }(jQuery);
});