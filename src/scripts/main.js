require.config({
	paths: {
		jquery:              '../bower_components/jquery/jquery.min',
		bootstrapAffix:      '../bower_components/sass-bootstrap/js/affix',
		bootstrapAlert:      '../bower_components/sass-bootstrap/js/alert',
		bootstrapButton:     '../bower_components/sass-bootstrap/js/button',
		bootstrapCarousel:   '../bower_components/sass-bootstrap/js/carousel',
		bootstrapCollapse:   '../bower_components/sass-bootstrap/js/collapse',
		bootstrapDropdown:   '../bower_components/sass-bootstrap/js/dropdown',
		bootstrapModal:      '../bower_components/sass-bootstrap/js/modal',
		bootstrapPopover:    '../bower_components/sass-bootstrap/js/popover',
		bootstrapScrollspy:  '../bower_components/sass-bootstrap/js/scrollspy',
		bootstrapTab:        '../bower_components/sass-bootstrap/js/tab',
		bootstrapTooltip:    '../bower_components/sass-bootstrap/js/tooltip',
		bootstrapTransition: '../bower_components/sass-bootstrap/js/transition',
		enquire:             '../bower_components/enquire/dist/enquire',
		underscore:          '../bower_components/underscore-amd/underscore',
		isotope:             '../bower_components/isotope/jquery.isotope',
		jqueryui:            'jqueryui',
		async:               '../bower_components/requirejs-plugins/src/async',
	},
	shim: {
		bootstrapAffix: {
			deps: [
				'jquery'
			]
		},
		bootstrapAlert: {
			deps: [
				'jquery'
			]
		},
		bootstrapButton: {
			deps: [
				'jquery'
			]
		},
		bootstrapCarousel: {
			deps: [
				'jquery'
			]
		},
		bootstrapCollapse: {
			deps: [
				'jquery',
				'bootstrapTransition'
			]
		},
		bootstrapDropdown: {
			deps: [
				'jquery'
			]
		},
		bootstrapPopover: {
			deps: [
				'jquery'
			]
		},
		bootstrapScrollspy: {
			deps: [
				'jquery'
			]
		},
		bootstrapTab: {
			deps: [
				'jquery'
			]
		},
		bootstrapTooltip: {
			deps: [
				'jquery'
			]
		},
		bootstrapModal: {
			deps: [
				'jquery'
			]
		},
		bootstrapTransition: {
			deps: [
				'jquery'
			]
		}
	}
});

require(['jquery', 'AffixMenu', 'IsotopeShop', 'SimpleMap', 'AttachedNavbar', 'enquire', 'utils', 'bootstrapTransition', 'bootstrapCollapse', 'bootstrapAlert', 'bootstrapTab', 'bootstrapDropdown', 'bootstrapCarousel', 'bootstrapModal' ], function ($, AffixMenu, IsotopeShop, SimpleMap) {
	'use strict';

	/**
	 * Affix menu
	 */
	(function () {
		if ( $('.js--affix-menu').length > 0 ) {
			var sidebarMenu = new AffixMenu({
				menuElm:   '.js--affix-menu',
				footerElm: '.js--page-footer'
			});

			enquire.register('screen and (min-width: 768px)', {
				match: function() {
					sidebarMenu.init();
				},
				unmatch: function () {
					sidebarMenu.destroy();
				}
			});
		}
	})();

	/**
	 * Isotope Shop
	 */
	(function () {
		var shop = new IsotopeShop({
			priceSlider: $('.js--jqueryui-price-filter'),
			priceRange:  [0, 20],
			priceStep:   0.2
		});
	})();

	(function () {
		if ( $('.js--where-we-are').length < 1 ) {
			return;
		}
		var map = new SimpleMap( $('.js--where-we-are'), {
			latLng: $('.js--where-we-are').data( 'latlng' ),
			markers: $('.js--where-we-are').data( 'markers' ),
			// markersImg: 'images/favicon.png',
			zoom: $('.js--where-we-are').data( 'zoom' ),
			styles: [{featureType:"landscape",stylers:[{saturation:-100},{lightness:65},{visibility:"on"}]},{featureType:"poi",stylers:[{saturation:-100},{lightness:51},{visibility:"simplified"}]},{featureType:"road.highway",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"road.arterial",stylers:[{saturation:-100},{lightness:30},{visibility:"on"}]},{featureType:"road.local",stylers:[{saturation:-100},{lightness:40},{visibility:"on"}]},{featureType:"transit",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"administrative.province",stylers:[{visibility:"off"}]/**/},{featureType:"administrative.locality",stylers:[{visibility:"off"}]},{featureType:"administrative.neighborhood",stylers:[{visibility:"on"}]/**/},{featureType:"water",elementType:"labels",stylers:[{visibility:"on"},{lightness:-25},{saturation:-100}]},{featureType:"water",elementType:"geometry",stylers:[{hue:"#ffff00"},{lightness:-25},{saturation:-97}]}]
		}).renderMap();
	})();

});