/* global Blacklight */

Blacklight.onLoad(function() {
  'use strict';

  getIconLabel();

  $('body').on('mouseenter', '.blacklight-icons.svg_tooltip svg', function() {
    console.log('mouseover');
    var svgTitle = $(this).find('title');
    var titleText = svgTitle && svgTitle.text();

    if (titleText !== undefined && titleText !== '') {
      $(this).tooltip({ placement: 'bottom', title: titleText });
      $(this).tooltip('show');

      // Store the original title in the data-original-title attribute
      // and remove the title element on mouseenter.
      // This prevents the title from interfering w/ Bootstrap's tooltip.
      $(this).attr('data-original-title', titleText);
      svgTitle.remove();
    }
  });

  $('body').on('mouseleave', '.blacklight-icons.svg_tooltip svg', function() {
    var originalTitle = $(this).attr('data-original-title');

    if (originalTitle !== undefined && originalTitle !== '') {
      // Restore the SVG title element from data-original-title on mouseleave
      $(this).prepend($('<title>' + originalTitle + '</title>'));
      $(this).attr('data-original-title', '');
    }
  });
});

const getIconLabel = () => {
  $('.status-icons > div').each(function(){
    var svgTitle = $(this).find('title');
    var titleText = svgTitle && svgTitle.text();
    $(this).append('<span class="icon-label" aria-hidden="true">'+ titleText + '</span>');
  })
}
