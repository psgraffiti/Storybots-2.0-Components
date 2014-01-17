(function($) {
  var aux   = {
      // navigates left / right
      navigate  : function( dir, $el, $wrapper, opts, cache ) {
        
        var scroll    = opts.scroll,
          idxClicked  = 0;
        
        // clone the elements on the right / left and append / prepend them according to dir and scroll
        if( dir === 1 ) {
          $wrapper.find('div.ca-item:lt(' + scroll + ')').each(function(i) {
            $(this).clone(true).css( 'left', (cache.totalItems - idxClicked + i) * cache.itemW + 'px' ).appendTo( $wrapper );
          });
        }
        else {
          var $first  = $wrapper.children().eq(0);
          
          $wrapper.find('div.ca-item:gt(' + (cache.totalItems  - 1 - scroll) + ')').each(function(i) {
            // insert before $first so they stay in the right order
            $(this).clone(true).css( 'left', - (scroll - i + idxClicked) * cache.itemW + 'px' ).insertBefore( $first );
          });
        }
        
        // animate the left of each item
        $wrapper.find('div.ca-item').each(function(i) {
          var $item = $(this);
          $item.stop().animate({
            left  :  ( dir === 1 ) ? '-=' + (cache.itemW * scroll) + 'px' : '+=' + (cache.itemW * scroll) + 'px'
          }, opts.sliderSpeed, opts.sliderEasing, function() {
            if( ( dir === 1 && $item.position().left < - idxClicked * cache.itemW ) || ( dir === -1 && $item.position().left > ((cache.totalItems - 1 - idxClicked) * cache.itemW) ) ) {
              // remove the item that was cloned
              $item.remove();
            }           
            cache.isAnimating = false;
          });
        });
      },
      // gets the item's position (0 is first) on the viewport (the visible items)
      // val is the left value of the item
      getWinPos : function( val, cache ) {
         return val % cache.itemW 
      }
    },
    methods = {
      init    : function( options ) {
        
        if( this.length ) {
          
          var settings = {
            sliderSpeed   : 2000,           // speed for the sliding animation
            sliderEasing  : 'easeOutCubic',  // easing for the sliding animation
            itemSpeed     : 500,            // speed for the item animation (open / close)
            itemEasing    : 'easeOutExpo',  // easing for the item animation (open / close)
            scroll        : 1               // number of items to scroll at a time
          };
          
          return this.each(function() {
            
            // if options exist, lets merge them with our default settings
            if ( options ) {
              $.extend( settings, options );
            }
            
            var $el       = $(this),
              $wrapper    = $el.find('div.ca-wrapper'),
              $items      = $wrapper.children('div.ca-item'),
              cache       = {};
            
            // save the with of one item  
            cache.itemW     = parseInt($items.css('width'), 10)//$items.width();
            // save the number of total items
            cache.totalItems  = $items.length;
            
            // control the scroll value
            if( settings.scroll < 1 )
              settings.scroll = 1;
            
            var $navPrev    = $('.ca-nav-prev'),
                $navNext    = $('.ca-nav-next');
            
            // hide the items except the first 3
            $wrapper.css( 'overflow', 'hidden' );
            
            // the items will have position absolute 
            // calculate the left of each item
            $items.each(function(i) {
              $(this).css({
                position  : 'absolute',
                left      : i * cache.itemW + 'px'
              });
            });
            
            // navigate left
            $navPrev.bind('click.contentcarousel', function( event ) {
              if( cache.isAnimating ) return false;
              cache.isAnimating = true;
              aux.navigate( -1, $el, $wrapper, settings, cache );
            });
            
            // navigate right
            $navNext.bind('click.contentcarousel', function( event ) {
              if( cache.isAnimating ) return false;
              cache.isAnimating = true;
              aux.navigate( 1, $el, $wrapper, settings, cache );
            });
            
            // adds events to the mouse
            $el.bind('mousewheel.contentcarousel', function(e, delta) {
              if(delta > 0) {
                if( cache.isAnimating ) return false;
                cache.isAnimating = true;
                aux.navigate( -1, $el, $wrapper, settings, cache );
              } 
              else {
                if( cache.isAnimating ) return false;
                cache.isAnimating = true;
                aux.navigate( 1, $el, $wrapper, settings, cache );
              } 
              return false;
            });

            $('div.ca-item').on('click', function() {
              var $item = $(this)
              var left  = $item.position().left
              if( left > 0 && (left / cache.itemW == settings.scroll) ) {
                if( cache.isAnimating ) return false;
                cache.isAnimating = true;
                aux.navigate( 1, $el, $wrapper, settings, cache );
              }

            })
            
          });
        }
      }
    };
  
  $.fn.contentcarousel = function(method) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.contentcarousel' );
    }
  };
  
})(jQuery);