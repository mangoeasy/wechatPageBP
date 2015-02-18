/* global google, define */
define(['jquery', 'underscore', 'async!http://maps.google.com/maps/api/js?sensor=false'], function ( $, _ ) {
	'use strict';
	/**
	 * Google Maps
	 *
	 * @link http://snazzymaps.com/style/27/shift-worker
	 */

	var mapOptions = {
			latLng:      [0,0],
			zoom:        5,
			type:        'ROADMAP',
			styles:      '',
			scrollwheel: false,
			draggable:   true,
			markersImg:  false,
			markers:     [
				{
					lat: 0,
					lng: 0,
					title: 'demo marker'
				}
			],
		};


	/**
	 * Constructor
	 * @param {jQuery selector} element where to create a map to
	 * @param {Object} options
	 */
	var SimpleMap = function( elm, options ) {
		this.mapOptions = $.extend( {}, mapOptions, options );
		this.elm = elm;
		this.setOptions();
		return this;
	};

	SimpleMap.prototype.setOptions = function() {
		// center of the map
		if ( 'string' === typeof this.mapOptions.latLng ) {
			var latLng = this.mapOptions.latLng.split( ',' );
			this.mapOptions.latLng = _( latLng ).filter( function ( coord ) {
				return parseInt( coord );
			} );
		}

		this.mapOptions.center = new google.maps.LatLng( this.mapOptions.latLng[0], this.mapOptions.latLng[1]);

		// markers
		if ( 'string' === typeof this.mapOptions.markers ) {
			this.mapOptions.markers = eval( this.mapOptions.markers );
		}

		this.mapOptions.mapTypeId = 'roadmap' === mapOptions.type.toLowerCase() ? google.maps.MapTypeId.ROADMAP : google.maps.MapTypeId.SATELLITE;

		return this;
	};


	SimpleMap.prototype.renderMap = function() {
		if('undefined' !== typeof this.elm) {
			this.map = new google.maps.Map( this.elm.get(0), this.mapOptions );
		} else {
			return false;
		}

		this.addMarkers();

		return this;
	};

	SimpleMap.prototype.addMarkers = function () {
		// add all markers
		$.each( this.mapOptions.markers, $.proxy( function ( i, val ) {
			var marker = new google.maps.Marker({
				position:  new google.maps.LatLng(val.lat, val.lng),
				title:     val.title,
			});
			if ( 'object' === typeof this.mapOptions.markersImg || 'string' === typeof this.mapOptions.markersImg ) {
				marker.setIcon( this.mapOptions.markersImg );
			}

			marker.setMap( this.map );
		}, this ) );

	};

	return SimpleMap;
});