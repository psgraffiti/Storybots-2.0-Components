$(document).ready(function(){
  +function ($) { "use strict";

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
      this.$element      = $(element)
      this.options       = $.extend({}, Collapse.DEFAULTS, options)
      this.transitioning = null

      if (this.options.parent) this.$parent = $(this.options.parent)
      if (this.options.toggle) this.toggle()
    }

    Collapse.DEFAULTS = {
      toggle: true
    }

    Collapse.prototype.dimension = function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function () {debugger;
      // If in desktop mode
      if(this.$element.css('display') == 'none') return;
      if (this.transitioning || this.$element.hasClass('expanded')) return

      var $parent = this.$element.parent()
      var actives = $parent && $parent.find('.expanded')

      if (actives) {
        var hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      var dimension = this.dimension()

      this.$element
        .addClass('collapsing')
        .removeClass('collapsed')
        .addClass('expanded')
        .css('max-'+dimension, 0)

      this.transitioning = 1

      var completeShow = function () {
        this.transitioning = 0
        this.$element
          .removeClass('collapsing')
          .addClass('expanded')
      }

      var scrollSize = $.camelCase(['scroll', dimension].join('-'))

      this.$element
        .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', $.proxy(completeShow, this))
        .css(dimension, this.$element[0][scrollSize])
        .css('max-'+dimension, this.$element[0][scrollSize]+1)
    }

    Collapse.prototype.hide = function () {debugger;
      // If in desktop mode
      if(this.$element.css('display') == 'none') return;
      if (this.transitioning || !this.$element.hasClass('expanded')) return

      var dimension = this.dimension()
        
      this.$element
        .addClass('collapsing')
        .addClass('collapsed')
        .removeClass('expanded')

      this.transitioning = 1

      var completeHide = function () {
        this.transitioning = 0
        this.$element
          .removeClass('collapsing')
          .addClass('collapsed')
      }

      this.$element
        .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', $.proxy(completeHide, this))
        .css('max-'+dimension, 0)
    }

    Collapse.prototype.toggle = function () {debugger;
      this[this.$element.hasClass('expanded') ? 'hide' : 'show']()
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    var old = $.fn.collapse

    $.fn.collapse = function (option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('collapse')
        var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

        if (!data) $this.data('collapse', (data = new Collapse(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }

    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
      $.fn.collapse = old
      return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
      var $this   = $(this), href
      var target  = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      var $target = $(target)
      var data    = $target.data('collapse')
      var option  = data ? 'toggle' : $this.data()
      var parent  = $this.attr('data-parent')
      var $parent = parent && $(parent)

      if (!data || !data.transitioning) {
        if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
        $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
      }

      $target.collapse(option)
    })

  }(jQuery);
});