$(document).ready(function(){
  +function ($) { "use strict";

    // DROPDOWN CLASS DEFINITION
    // =========================

    var dropdownNav = '.responsive-nav'
    var backdrop = '.dropdown-backdrop'
    var toggle   = '[toggle-type=dropdown]'
    var $navbar   = $('.main-navbar')
    var navbarSM = '50px'

    var Dropdown = function (element) {
      var $el = $(element).on('click.dropdown', this.toggle)
    }

    Dropdown.prototype.toggle = function (e) {
      var $this = $(this)
      if ($this.is('.disabled, :disabled')) return

      if ($navbar.css('height') == navbarSM ){
        $(dropdownNav).css('width', $navbar.css('width'))
      }
      else {
        $(dropdownNav).css('width', 'auto')
      }

      var $dropdownMenu = $this.next('.dropdown-menu')

      $dropdownMenu.css('min-width', $this.css('width'))
      $dropdownMenu.css('margin-right', $this.css('margin-right'))
      $dropdownMenu.css('margin-left', $this.css('margin-left'))

      var $parent = getParent($this)
      var isOpen = $parent.hasClass('is-open')

      clearMenus()

      if (!isOpen) {
        if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
          // if mobile we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
        }

        $parent.trigger(e = $.Event('show.dropdown'))

        if (e.isDefaultPrevented()) return

        $parent
          .toggleClass('is-open')
          .trigger('shown.dropdown')

        if ($navbar.css('height') != navbarSM ){
          setMaxHeights($dropdownMenu.children('.column-menu'))
        }
        else {
          resetMaxHeights($dropdownMenu.children('.column-menu'))
        }

        $this.focus()
      }

      $this
        .toggleClass('active', $parent.hasClass('is-open'))
        .toggleClass('hover', $parent.hasClass('is-open'))

      return false
    }

    Dropdown.prototype.toggleHeader = function (e) {
      var $this = $(this)

      if ($this.is('.disabled, :disabled')) return

      var $siblings = $this.siblings()
      $siblings
        .toggleClass('is-open')

      $this.children('.fa').toggleClass('fa-chevron-up')
      $this.children('.fa').toggleClass('fa-chevron-down')
    }

    Dropdown.prototype.keydown = function (e) {
      if (!/(38|40|27)/.test(e.keyCode)) return

      var $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      var $parent = getParent($this)
      var isOpen = $parent.hasClass('is-open')

      if (!isOpen || (isOpen && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      var $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      var index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0)                 index-- // up
      if (e.keyCode == 40 && index < $items.length - 1) index++ // down
      if (!~index)                                      index=0

      $items.eq(index).focus()
    }

    $(window).resize(function(){debugger
      var $dropdownNav = $(dropdownNav)
      if ($navbar.css('height') == navbarSM ){
        $dropdownNav.css('width', $(window).width())
        resetMaxHeights($dropdownNav.children('.column-menu'))
      }
      else {
        $dropdownNav.css('width', 'auto')
        $dropdownNav.each(function(index) {
          var $dropdown = $dropdownNav.eq(index)
          setMaxHeights($dropdown.children('.column-menu'))
        })
      }
    })

    function clearMenus() {
      $(backdrop).remove()
      $(toggle).each(function (e) {
        var $parent = getParent($(this))
        if (!$parent.hasClass('is-open')) return
        if ($(this).siblings('ul').hasClass(dropdownNav) && $navbar.css('height') == navbarSM) return
        $parent.trigger(e = $.Event('hide.dropdown'))
        if (e.isDefaultPrevented()) return
        $parent
          .removeClass('is-open')
          .trigger('hidden.dropdown')

        $(this)
          .removeClass('active')
          .removeClass('hover')
      })
    }

    function getParent($this) {
      var selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      var $parent = selector && $(selector)

      return $parent && $parent.length ? $parent : $this.parent()
    }

    function determineMaxHeights(elements) {
      if ($(elements).attr('my-height')) return;

      var maxHeight = -1;
      elements.each(function() {
        if ($(this).height() > maxHeight)
          maxHeight = $(this).height()
      })

      elements.each(function() {
        $(this).attr('my-height', maxHeight)
      })
    }

    function setMaxHeights(elements) {
      if (!$(elements).attr('my-height')) {
        determineMaxHeights(elements)
      }
      var maxHeight = $(elements).attr('my-height')

      elements.each(function() {
        $(this).height(maxHeight)
      })
    }

    function resetMaxHeights(elements) {
      elements.each(function() {
        $(this).css('height', '')
      })
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    var old = $.fn.dropdown

    $.fn.dropdown = function (option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('dropdown')

        if (!data) $this.data('dropdown', (data = new Dropdown(this)))
        if (typeof option == 'string') data[option].call($this)
      })
    }

    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
      $.fn.dropdown = old
      return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
      .on('click.dropdown', clearMenus)
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown', '.dropdown-menu-table', function (e) { e.stopPropagation() })
      .on('click.dropdown', toggle, Dropdown.prototype.toggle)
      .on('click.header'  , '.dropdown-menu .header', Dropdown.prototype.toggleHeader)
      .on('keydown.dropdown', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

  }(jQuery);
});