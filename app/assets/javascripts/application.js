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
//= require turbolinks

//
// Required by Blacklight
//= require popper
// Twitter Typeahead for autocomplete
//= require twitter/typeahead
//= require bootstrap
//= require blacklight/blacklight

//= require_tree .




// AJAX MODAL STUFF
$(document).on('turbolinks:load', function() {
  $('body').on('click',function(){
  })

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


    // function displayFlashMessage(message) {
    //   var messageHtml = '<div class="alert alert-info">' + message + '<a class="close" data-dismiss="alert" href="#">&times;</a></div>';
    //   $('#main-flashes .flash_messages').html(messageHtml);
    // }
});
