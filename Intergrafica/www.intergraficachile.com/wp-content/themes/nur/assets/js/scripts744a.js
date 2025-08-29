( function( $ ) {
	'use strict';

	var isRtl = $( 'body' ).hasClass( 'rtl' );

	// Set up mobile menu toggle button.
	( function() {
		var $menu       = $( '#site-navigation' );
		var $menuLink   = $( 'a.mobile-menu-toggle' );
		var $menuButton = $( '<button />', { 'class': 'mobile-menu-toggle', 'aria-expanded': false } ).append( $menuLink.children() );
		var $searchBar  = $( '.site-header-search-bar' );

		$menuLink.replaceWith( $menuButton );

		$menuButton.on( 'click.nur', function() {
			$menu.toggleClass( 'is-toggled' );
			$searchBar.toggleClass( 'is-toggled' );
			$( this ).toggleClass( 'is-toggled' ).attr( 'aria-expanded', $menu.hasClass( 'is-toggled' ) );
		} );
	} () );

	// Set up mobile menu submenu toggle buttons.
	( function() {
		var $container    = $( '#site-navigation' );
		var $toggleButton = $( '<button />', { 'class': 'sub-menu-toggle', 'aria-expanded': false } )
			.append( $( '<span />', { 'class': 'sub-menu-toggle-icon' } ) )
			.append( $( '<span />', { 'class': 'screen-reader-text', 'text': nurScreenReaderText.expand } ) );

		$container.find( '.menu-item-has-children > a, .page_item_has_children > a' )
			.filter( function() {
				return $( this ).closest( '.children, .sub-menu' ).length == 0;
			} )
			.after( $toggleButton );

		$container.find( '.current-menu-ancestor > .sub-menu-toggle' )
			.addClass( 'is-toggled' )
			.attr( 'aria-expanded', 'true' )
			.find( '.screen-reader-text' )
			.text( nurScreenReaderText.collapse );
		$container.find( '.current-menu-ancestor > .children, .current-menu-ancestor > .sub-menu' )
			.filter( function() {
				return $( this ).parent().closest( '.children, .sub-menu' ).length == 0;
			} )
			.addClass( 'is-toggled' );

		$container.on( 'click.nur', '.sub-menu-toggle', function( event ) {
			var $this = $( this );

			event.preventDefault();
			$this.toggleClass( 'is-toggled' );
			$this.next( '.children, .sub-menu' ).toggleClass( 'is-toggled' );
			$this.attr( 'aria-expanded', $this.hasClass( 'is-toggled' ) );
			$this.find( '.screen-reader-text' )
				.text( $this.hasClass( 'is-toggled' ) ? nurScreenReaderText.collapse : nurScreenReaderText.expand );
		} );
	} () );

	// Fix for secondary navigation submenu toggling on touch devices.
	( function() {
		$( '.top-bar' ).on( 'click.nur', '.secondary-navigation .menu-item-has-children > a, .secondary-navigation .page_item_has_children > a', function( event ) {
			event.preventDefault();
		} );
	} () );

	// Add has-focus class to menu items parents
	$( '.primary-navigation, .secondary-navigation' ).on( 'focus.nur blur.nur', 'a', function( event ) {
		if ( event.type === 'focusin' ) {
			$( this ).parents().addClass( 'has-focus' );
		} else {
			$( this ).parents().removeClass( 'has-focus' );
		}
	} );

	// Smooth scroll to top
	$( 'a[href="#top"]' ).on( 'click.nur', function() {
		$( 'html, body' ).animate( { scrollTop: 0 }, 1000 );
		return false;
	} );

	// Make videos fit their container
	fitvids();

	function countDecimalPlaces( num ) {
		var match = ( '' + num ).match( /\.(\d+)$/ );
		return ( match && match[1] ) ? match[1].length : 0;
	}

	// Counter Box animation
	if ( $( '.counter-box' ).length ) {
		// Prepare animations
		$( '.counter-box .counter-box-number' ).each( function() {
			var $this       = $( this );
			var numberParts = $this.text().match( /^(\D*)(\d+(?:\.\d+)?)(.*)$/ );
			var number, decimals, duration, numberAnim;

			if ( ! numberParts ) {
				return;
			}

			number = Number( numberParts[2] );
			decimals = countDecimalPlaces( numberParts[2] );
			duration = 0.5 + Math.random();
			numberAnim = new CountUp( this, 0, number < 3000 ? number : number * 0.98, decimals, duration, {
				prefix: numberParts[1],
				suffix: numberParts[3],
			} );

			$this.text( '0' );
			$this.data( 'number', number );
			$this.data( 'number-animation', numberAnim );
			$this.addClass( 'js-count-up' );
		} );

		// Trigger the animation when Counter Box enters the viewport
		$( '.counter-box' ).waypoint( {
			offset: '95%',
			handler: function() {
				$( this.element || this ).find( '.js-count-up' ).each( function() {
					var $this      = $( this );
					var number     = $this.data( 'number' );
					var numberAnim = $this.data( 'number-animation' );

					$this.removeClass( 'js-count-up' );
					$this.removeData( [ 'number', 'number-animation' ] );

					if ( numberAnim ) {
						numberAnim.start( function() {
							numberAnim.update( number );
						} );
					}
				} );
			},
		} );
	}

} ( jQuery ) );
