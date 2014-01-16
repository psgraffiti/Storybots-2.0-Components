//
// VIDEO PLAYER PUBLIC CLASS DEFINITION
// ==============================
//

$(document).ready(function() {
  +function ($) { "use strict"

    var player = videojs('storybots-video')

    /* Create Top Logo for Fullscreen */
    /* -------------------------------------------------------------------------------- */

    videojs.Logo = videojs.Component.extend({
    /** @constructor */
      init: function(player, options){
        videojs.Component.call(this, player, options)
      }
    })

    videojs.Logo.prototype.options_ = {
      loadEvent: 'play',
      children: {
      }
    };

    var createLogo = function() {
      var props = {
          className: 'logo'
        }
      return videojs.Component.prototype.createEl(null, props)
    }

    // Register Plugin
    videojs.plugin('logo', function() {
      var options = {'el' : createLogo()}
      var logo = new videojs.Logo(this, options)
      this.el().appendChild(logo.el())
    })


    /* Create Top Control Bar */
    /* -------------------------------------------------------------------------------- */

    videojs.TopControlBar = videojs.ControlBar.extend({
    /** @constructor */
      init: function(player, options){
        videojs.Component.call(this, player, options)
      }
    })

    videojs.TopControlBar.prototype.options_ = {
      loadEvent: 'play',
      children: {
      }
    }

    var createTopControlBar = function() {
      var props = {
          className: 'vjs-top-control-bar vjs-control-bar',
          innerHTML: '<div class="vjs-home-control vjs-control"><div class="vjs-control-content"><span class="vjs-control-text">' + ('Home') + '</span></div></div>' +
                      '<div class="divider"></div>' +
                      '<div class="vjs-title vjs-control"></div>'
        }
      return videojs.Component.prototype.createEl(null, props)
    }

    // Register Plugin
    videojs.plugin('topBar', function() {
      var options = {'el' : createTopControlBar()}
      var topBar = new videojs.TopControlBar(this, options)
      this.el().appendChild(topBar.el())
    })



    /* Create Previous Video Button */
    /* -------------------------------------------------------------------------------- */
    
    videojs.PrevButton = videojs.Button.extend({
    /** @constructor */
      init: function(player, options){
        videojs.Button.call(this, player, options)
      }
    })

    videojs.PrevButton.prototype.onClick = function() {
      player.prev()
    }

    // Note that we're not doing this in prototype.createEl() because
    // it won't be called by Component.init (due to name obfuscation).
    var createPrevButton = function() {
      var props = {
          className: 'vjs-prev-control vjs-control',
          innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' + ('Previous') + '</span></div>',
          role: 'button',
          'aria-live': 'polite', // let the screen reader user know that the text of the button may change
          tabIndex: 0
        }
      return videojs.Component.prototype.createEl(null, props)
    }

    // Register Plugin
    videojs.plugin('previousButton', function() {
      var options = {'el' : createPrevButton()}
      var previousBtn = new videojs.PrevButton(this, options)
      this.controlBar.el().appendChild(previousBtn.el())
    })

    /* Create Next Video Button */
    /* -------------------------------------------------------------------------------- */

    videojs.NextButton = videojs.Button.extend({
    /** @constructor */
      init: function(player, options){
        videojs.Button.call(this, player, options)      }
    })

    videojs.NextButton.prototype.onClick = function() {
      player.next()
    }

    // Note that we're not doing this in prototype.createEl() because
    // it won't be called by Component.init (due to name obfuscation).
    var createNextButton = function() {
      var props = {
          className: 'vjs-next-control vjs-control',
          innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' + ('Next') + '</span></div>',
          role: 'button',
          'aria-live': 'polite', // let the screen reader user know that the text of the button may change
          tabIndex: 0
        }
      return videojs.Component.prototype.createEl(null, props)
    }

    // Register Plugin
    videojs.plugin('nextButton', function() {
      var options = {'el' : createNextButton()}
      var nextBtn = new videojs.NextButton(this, options)
      this.controlBar.el().appendChild(nextBtn.el())
    })



    /* Playlist */
    /* -------------------------------------------------------------------------------- */

    var videos = [
      {
        src : [
          'http://stream.flowplayer.org/bauhaus/624x260.webm',
          'http://stream.flowplayer.org/bauhaus/624x260.mp4',
          'http://stream.flowplayer.org/bauhaus/624x260.ogv'
        ],
        poster : 'http://flowplayer.org/media/img/demos/minimalist.jpg',
        title : 'Video 1'
      },
      {
        src : [
          'http://stream.flowplayer.org/night3/640x360.webm',
          'http://stream.flowplayer.org/night3/640x360.mp4',
          'http://stream.flowplayer.org/night3/640x360.ogv'
        ],
        poster : 'http://flowplayer.org/media/img/demos/playlist/railway_station.jpg',
        title : 'Video 2'
      },
      {
        src : [
          'http://stream.flowplayer.org/functional/624x260.webm',
          'http://stream.flowplayer.org/functional/624x260.mp4',
          'http://stream.flowplayer.org/functional/624x260.ogv'
        ],
        poster : 'http://flowplayer.org/media/img/demos/functional.jpg',
        title : 'Video 3'
      }
    ]



    // /* Video Player Tray */
    // /* -------------------------------------------------------------------------------- */

    videojs.VideoPlayerTray = videojs.Component.extend({
    /** @constructor */
      init: function(player, options){
        videojs.Component.call(this, player, options)
      }
    });

    videojs.VideoPlayerTray.prototype.options_ = {
      loadEvent: 'play',
      children: {
      }
    }

    var createVideoPlayerTray = function() {
      var props = {
          className: 'video-player-tray',
          innerHTML: '<a class="prev browse left btn green" id="left"><i class="fa fa-caret-left fa-5x"></i></a>' +
                      '<div class="scrollable" id="scrollable">' +
                      '<div class="videos box-shadow"></div>' +
                      '<div class="videos items">' +
                          '<div class="video-thumb"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail" disabled="disabled"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb playing"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail" disabled="disabled"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail" disabled="disabled"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail" disabled="disabled"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail" disabled="disabled"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                          '<div class="video-thumb"><div class="thumbnail"><input type="image" src="/assets/row.png" alt="be-the-star Videos"></div></div>' +
                      '</div></div>' +
                      '<a class="next browse right btn green" id="right"><i class="fa fa-caret-right fa-5x"></i></a>'
        }
      return videojs.Component.prototype.createEl(null, props)
    }

    // Register Plugin
    videojs.plugin('videoPlayerTray', function() {
      var options = {'el' : createVideoPlayerTray()}
      var videoPlayerTray = new videojs.VideoPlayerTray(this, options)
      this.el().appendChild(videoPlayerTray.el())
    })

    
    // /* Add Custom Elements to Video.js */
    // /* -------------------------------------------------------------------------------- */

    player.logo()
    player.topBar()
    player.previousButton()
    player.nextButton()
    player.playList(videos, {
      getVideoSource: function(vid, cb) {
        cb(vid.src, vid.poster)
      }
    })
    player.videoPlayerTray()


    videojs('storybots-video').ready(function() {
      var sbPlayer   = this
      var tray       = $('#storybots-video .video-player-tray')
      var video      = $('#storybots-video.video-js')
      var ccButton   = $('#storybots-video .vjs-captions-button')

      /* Display video player tray and logo in fullscreen */
      tray.width($('#firefox-sucks').parent().width())

      sbPlayer.on('fullscreenchange', function() {
        // Subtract video tray and margin, logo bar heights from total height
        var others     = 151+50+80+5
        var fullHeight = screen.height-others

        if (sbPlayer.isFullScreen) {
          tray.prop('style').removeProperty('width')
          video.css('min-height', fullHeight)
        }
        else {
          tray.width($('.logo').width())
          video.prop('style').removeProperty('min-height')
        }

        scrollVideoTray()
      })

      $(window).resize(function() {
        if (!sbPlayer.isFullScreen) {
          tray.width($('#firefox-sucks').parent().width())
        }
      })

      tray.resize(function() {
        $('.videos').width(tray.width())
      })

      /* Display captions on button click */
      ccButton.on('click', function() {
        $("li.vjs-menu-item").eq(1).trigger('click');
        $(this).toggleClass('active')
      })

      /* Make video tray scrollable */
      $(".scrollable").scrollable();
      scrollVideoTray()
      function scrollVideoTray() {
        var items           = $('.videos.items .video-thumb')
        var itemWidth       = parseInt($('.video-thumb').css('width'), 10)
        var trayWidth       = tray.width()
        var itemsPerSection = Math.floor(trayWidth/itemWidth) - 1

        for(var i = 0; i <= items.length; i += itemsPerSection) {
          items.slice(i, i+itemsPerSection).wrapAll('<div />')
        }
      }

      $('.video-thumb').on('click', function() {
        var $this = $(this)

        if ($this.hasClass('playing'))
          return

        $('.video-thumb').removeClass('playing')
        $this.addClass('playing')

        sbPlayer.playList(1)
      })

      /* Insert Custom Dividers to Control Bar */
      function insertDividers() {
        $('.vjs-play-control').before('<div class="divider"></div>')
        $('.vjs-play-control').after('<div class="divider"></div>')

        $('.vjs-next-control').before('<div class="divider" style="float: right"></div>')
        $('.vjs-next-control').after('<div class="divider" style="float: right"></div>')

        $('.vjs-captions-button').before('<div class="divider" id="cc-divider" style="float: right"></div>')
      }

      function placeMemberBadges() {
        $('.thumbnail[disabled="disabled"]').prepend('<div class="member"></div>');
      }

      insertDividers()
      placeMemberBadges()
    })

  }(jQuery)
})