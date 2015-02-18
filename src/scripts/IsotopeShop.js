/**
 * Isotope shop with advanced filters
 */
define(['jquery', 'underscore', 'jqueryui/slider', 'isotope'], function ($, _) {
	/**
	 * IsotopeShop contructions
	 * @param Object config
	 * @return IsotopeShop this
	 */
	var IsotopeShop = function ( config ) {
		this.defaults = $.extend( {}, IsotopeShop.DEFAULTS, config );

		this.defaults.container.imagesLoaded( $.proxy( this.init, this ) );
		return this;
	};

	/**
	 * Default config objec
	 * @type Object
	 */
	IsotopeShop.DEFAULTS = {
		container:       $(".js--isotope-container"),
		itemSelector:    ".js--isotope-target",
		sortingSelect:   $(".js--isotope-sorting"),
		priceSlider:     null,
		currencyBefore:  true, // true foe the currencies like USD, where the symbol comes before the number ($123.45). False for the symbol after the number (123,45 €)
		currencySymbol:  "$",
		priceRange:      [ 0, 100 ], // minimum and maximum range for the price range selector
		priceStep:       1,
		eventsNamespace: 'IsotopeShop',
	};


	/**
	 * Init the IsotopeShop and bind the events
	 * @return IsotopeShop this
	 */
	IsotopeShop.prototype.init = function () {
		// call je isotope jQuery plugin with some settings
		this.defaults.container.isotope({
			itemSelector: this.defaults.itemSelector,
			layoutMode: "fitRows",
			getSortData: {
				price: function( elm ) {
					return elm.data( 'price' );
				},
				name: function( elm ) {
					return elm.find( '.js--isotope-title' ).text();
				},
				popularity: function( elm ) {
					return elm.data( 'popularity' );
				}
			}
		});

		// bind the change event to the select element for sorting
		if( this.defaults.sortingSelect.length > 0 ) {
			this.defaults.sortingSelect.change( $.proxy( this.updateSortingOrder, this ) );
		}

		// create a price slider filter if the element exists
		if( this.hasPriceSlider() ) {
			this.jQueryUiSlider();
		}

		// sidebar filter
		this.sidebarFilterBehaviour();

		// update the filtering after everything else is setup
		this.updateIsotopeFiltering();
	};


	/**
	 * Filters for sidebar, capture click events
	 * @return {IsotopeShop} this
	 */
	IsotopeShop.prototype.sidebarFilterBehaviour = function () {
		$(".js--filter-selectable").on( 'click.'+this.defaults.eventsNamespace, $.proxy( function( ev ) {
			ev.preventDefault();
			$( ev.currentTarget ).toggleClass( 'selected' );
			this.updateIsotopeFiltering();
		}, this ) );
		return this;
	};

	/**
	 * Sorting
	 * @param  {[type]} ev [description]
	 * @return {[type]}    [description]
	 */
	IsotopeShop.prototype.updateSortingOrder = function ( ev ) {
		var parameters = $.parseJSON( $(ev.currentTarget).val() );
		parameters.sortAscending = "true" === parameters.sortAscending ? true : false;
		this.defaults.container.isotope( parameters );

		return this;
	};


	IsotopeShop.prototype.hasPriceSlider = function () {
		return this.defaults.priceSlider.length > 0;
	};

	// jQuery UI slider
	IsotopeShop.prototype.jQueryUiSlider = function () {
		var minMax = $('<div class="range-numbers"></div>').append('<span class="min-val"></span><span class="max-val"></span>');
		this.defaults.priceSlider.after(minMax);

		this.defaults.priceSlider.slider({
			range:  true,
			min:    this.defaults.priceRange[0],
			max:    this.defaults.priceRange[1],
			values: this.defaults.priceRange,
			step:   this.defaults.priceStep,
			slide:  $.proxy( function( ev, ui ) {
				this.updateSliderValues( this.defaults.priceSlider.siblings('.range-numbers'), ui.values[0], ui.values[1] );
			}, this ),
			change: $.proxy( function() {
				this.updateIsotopeFiltering();
			}, this ),
			create: $.proxy( function() {
				this.updateSliderValues( this.defaults.priceSlider.siblings('.range-numbers'), this.defaults.priceSlider.slider( 'values', 0 ), this.defaults.priceSlider.slider( 'values', 1 ) );
			}, this)
		});
		this.defaults.priceSlider.trigger('slide');
	};

	/**
	 * Return the formatted money format
	 * @return {String} formatted money format with the currency symbol
	 */
	IsotopeShop.prototype.prepareCurrency = function ( value ) {
		return this.defaults.currencyBefore ? this.defaults.currencySymbol + value : value + this.defaults.currencySymbol;
	};

	IsotopeShop.prototype.updateSliderValues = function ( elm, min, max ) {
		elm.children(".min-val").text( this.prepareCurrency( min ) );
		elm.children(".max-val").text( this.prepareCurrency( max ) );
	};

	IsotopeShop.prototype.sliderFilter = function ( filteredElms ) {
		filteredElms = filteredElms.filter( $.proxy( function( i, elm ) {
			var $this = $( elm );
			return $this.data( 'price' ) >= this.defaults.priceSlider.slider( 'values', 0 ) && $this.data( 'price' ) <= this.defaults.priceSlider.slider( 'values', 1 );
		}, this ) );

		return filteredElms;
	};


	IsotopeShop.prototype.updateIsotopeFiltering = function() {
		var selectedFilters =
				$(".js--filter-selectable.selected[data-target]").not(".detailed"),
			detailedFilters =
				$(".js--filter-selectable.detailed.selected[data-target]"),
			filteredElms,
			types = [];

		// if ( selectedFilters.length > 0 || detailedFilters.length > 0 ) {
		//   $("#removeFilters").fadeIn();
		// } else {
		//   $("#removeFilters").fadeOut();
		// }

		// basic filtering
		filteredElms = this.basicFilter( selectedFilters );

		// slider price filtering, after we have the right categories already
		if( this.hasPriceSlider() ) {
			filteredElms = this.sliderFilter( filteredElms );
		}

		// more precise filters for the size, color, brand ...
		detailedFilters.each(function() {
			types.push($(this).data("type"));
		});
		types = _.uniq(types);
		if (detailedFilters.length > 0) {
			_.each(types, function(type) {
				var allowedValues = [];
				detailedFilters.filter('[data-type="' + type + '"]').each(function() {
					allowedValues.push($(this).data("target"));
				});
				filteredElms = filteredElms.filter(function() {
					var $this = $(this);
					return _.some($this.data(type).split("|"), function(val) {
						return _.contains(allowedValues, val);
					});
				});
			});
		}

		// trigger the isotope update with the matched elements
		this.defaults.container.isotope({
			filter: filteredElms
		});
	};

	/**
	 * Creates the most basic filter string and returns the jQuery object for further processing
	 * @param  {boolean} selectedFilters
	 * @return {jQuery obj}
	 */
	IsotopeShop.prototype.basicFilter = function( selectedFilters ) {
		var filterString = '';
		if ( selectedFilters.length < 1 ) {
			filterString = this.defaults.container.selector + ' ' + this.defaults.itemSelector;
		} else {
			var filterArr = [];
			selectedFilters.each( function() {
				var data = $(this).data( 'target' );
				if ( 'undefined' !== typeof data ) {
					filterArr.push($(this).data('target'));
				}
			} );
			filterString = filterArr.join(',');
		}
		return $(filterString);
	};

	return IsotopeShop;
});