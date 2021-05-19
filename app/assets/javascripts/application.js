// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery3
//= require rails-ujs
//= require activestorage


//
// Required by Blacklight
//= require popper
// Twitter Typeahead for autocomplete
//= require twitter/typeahead
//= require bootstrap
//= require blacklight/blacklight

//= require leaflet-sleep

//= stub geoblacklight/modules/geosearch
//= stub geoblacklight/modules/item
//= stub geoblacklight/modules/results
//= stub geoblacklight/modules/svg_tooltips

//= require_tree .





// AJAX MODAL STUFF
Blacklight.onLoad(function() {

    function closeModal() {
        $('#ajax-modal').removeClass('open');
        $('.reveal-modal').removeClass('open').removeClass('in').hide();
        $('.reveal-modal-bg').hide();
        $('.modal-backdrop').hide();
        $('body').removeClass('modal-open');
    }

    $('body').on('click', '.ajax-modal-close', function () {
        closeModal();
    });

    $('body').on('keyup', function (e) {
        if (e.key === "Escape" && $('body').hasClass('modal-open')) {
            closeModal();
        }
    });

    $('body').on('click', '.facets__rail .btn-show-facets', function (e) {
      $('.facets__rail').addClass('open');
    });

    $('body').on('click', '.facets__rail .btn-hide-facets', function (e) {
      $('.facets__rail').removeClass('open');
    });



    // index map explorer toggle closed
    $('body').on('click', '.index-map__close--btn', function(e){
      $('.viewer-information').slideUp();
    });


    // attribution table toggle open/closed
    $(".attribute-table").each(function(){
      $("#map").on("click",function(e){
        $('.attribute-table__table').slideDown();
      })
    })
    $('body').on('click', '.attribute-table__close--btn', function(e){
      $('.attribute-table__table').slideUp();
    });


    // keep selected filter categories open until clicked closed
    $('.active.accordion-navigation').each(function(){
      const $el = $(this);
      const $facetButton = $el.find(".facet__title");
      const $facetToggle = $el.find(".facet-expand.toggle");
      $facetToggle.removeClass("fa-rotate-180");
      $facetButton.attr('aria-expanded', 'true');

      const $facetContent = $el.find(".active.panel-collapse");
      $facetContent.addClass("show");
    });

    // selected filters styled as display:flex to center close icon
    $('.active .facet-label').each(function(){
      const $el = $(this);
      const $selected = $el.find("span.selected");
      if ($selected.html() != null){
        $el.addClass("selected");
      }
    });

    // add class to homepage's #main-container to make full width
    $(".homepage").each(function(){
      $("#main-container").addClass("homepage__container");
    });

});
