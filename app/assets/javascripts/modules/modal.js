//
// MODAL CLASS DEFINITION
// ==============================
//

$(document).ready(function(){  
  +function ($) { "use strict";

    var Modal = function (element, options) {
      this.options   = options
      this.$element  = $(element)
      this.$backdrop =
      this.isShown   = null

      if (this.options.remote) this.$element.load(this.options.remote)
    }

    Modal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
      return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
      var that = this
      var e    = $.Event('show.modal', { relatedTarget: _relatedTarget })

      this.$element.trigger(e)

      if (this.isShown || e.isDefaultPrevented()) return

      this.isShown = true

      this.escape()

      this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

      this.backdrop(function () {
        var transition = $.support.transition && that.$element.hasClass('fade')

        if (!that.$element.parent().length) {
          that.$element.appendTo(document.body) // don't move modals dom position
        }

        that.$element.show()

        if (transition) {
          that.$element[0].offsetWidth // force reflow
        }

        that.$element
          .addClass('in')
          .attr('aria-hidden', false)

        // Centre the modal
        var $mine = that.$element.find('.modal-dialog')
        if ($mine.height() < $(window).height()) {
          var top = -(parseInt($mine.css('height'), 10)/2)
          $mine.css('top', '50%')
          $mine.css('margin-top', top)
        }
        else {
          $mine.css('top', '1%')
        }

        that.enforceFocus()

        var e = $.Event('shown.modal', { relatedTarget: _relatedTarget })

        transition ?
          that.$element.find('.modal-dialog') // wait for modal to slide in
            .one($.support.transition.end, function () {
              that.$element.focus().trigger(e)
            })
            :
          that.$element.focus().trigger(e)
      })
    }

    Modal.prototype.hide = function (e) {
      if (e) e.preventDefault()

      e = $.Event('hide.modal')

      this.$element.trigger(e)

      if (!this.isShown || e.isDefaultPrevented()) return

      this.isShown = false

      // Centre the modal
      var $mine = this.$element.find('.modal-dialog')
      if ($mine.height() < $(window).height()) {
        $mine.css('top', '-50%')
        $mine.css('margin-top', 0)
      }
      else{
        $mine.css('top', '-1%')
      }

      this.escape()

      $(document).off('focusin.modal')

      this.$element
        .removeClass('in')
        .attr('aria-hidden', true)
        .off('click.dismiss.modal')

      $.support.transition && this.$element.hasClass('fade') ?
        this.$element.one($.support.transition.end, $.proxy(this.hideModal, this))
          :
        this.hideModal()
    }

    Modal.prototype.enforceFocus = function () {
      $(document)
        .off('focusin.modal') // guard against infinite focus loop
        .on('focusin.modal', $.proxy(function (e) {
          if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
            this.$element.focus()
          }
        }, this))
    }

    Modal.prototype.escape = function () {
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keyup.dismiss.modal', $.proxy(function (e) {
          e.which == 27 && this.hide()
        }, this))
      } else if (!this.isShown) {
        this.$element.off('keyup.dismiss.modal')
      }
    }

    Modal.prototype.hideModal = function () {
      var that = this
      this.$element.hide()
      this.backdrop(function () {
        that.removeBackdrop()
        that.$element.trigger('hidden.modal')
      })
    }

    Modal.prototype.removeBackdrop = function () {
      this.$backdrop && this.$backdrop.remove()
      this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
      var that    = this
      var animate = this.$element.hasClass('fade') ? 'fade' : ''

      if (this.isShown && this.options.backdrop) {
        var doAnimate = $.support.transition && animate

        this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body)

        this.$element.on('click.dismiss.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static' ? 
            this.$element[0].focus.call(this.$element[0])
            :
            this.hide.call(this)
        }, this))

        if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
        this.$backdrop.addClass('in')

        if (!callback) return

        doAnimate ?
          this.$backdrop.one($.support.transition.end, callback)
          :
          callback()

      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$backdrop.one($.support.transition.end, callback)
          :
          callback()

      } else if (callback) {
        callback()
      }
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    var old = $.fn.modal

    $.fn.modal = function (option, _relatedTarget) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('modal')
        var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

        if (!data) $this.data('modal', (data = new Modal(this, options)))
        if (typeof option == 'string') data[option](_relatedTarget)
        else if (options.show) data.show(_relatedTarget)
      })
    }

    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
      $.fn.modal = old
      return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this   = $(this)
      var href    = $this.attr('href')
      var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault()

      $target
        .modal(option, this)
        .one('hide', function () {
          $this.is(':visible') && $this.focus()
        })
    })

    $(document)
      .on('show.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

  }(jQuery);
});