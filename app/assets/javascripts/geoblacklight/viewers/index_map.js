//= require geoblacklight/viewers/map

GeoBlacklight.Viewer.IndexMap = GeoBlacklight.Viewer.Map.extend({
  load: function() {
    this.map = L.map(this.element).fitBounds(this.options.bbox);
    this.map.addLayer(this.selectBasemap());

    if (this.data.available) {
      this.addPreviewLayer();
    } else {
      this.addBoundsOverlay(this.options.bbox);
    }
    console.log("loading map");
  },
  availabilityStyle: function(availability) {
    var style = {};
    var options = this.data.leafletOptions;

    // Style the colors based on availability
    if (availability || typeof(availability) === 'undefined') {
      style = options.LAYERS.INDEX.DEFAULT;
    } else {
      style = options.LAYERS.INDEX.UNAVAILABLE;
    }
    return style
  },
  addPreviewLayer: function() {
    var _this = this;
    var geoJSONLayer;
    var prevLayer = null;
    var options = this.data.leafletOptions;
    $.getJSON(this.data.url, function(data) {
      geoJSONLayer = L.geoJson(data,
        {
          style: function(feature) {
            return _this.availabilityStyle(feature.properties.available);
          },
          onEachFeature: function(feature, layer) {
            // Add a hover label for the label property
            if (feature.properties.label !== null) {
              layer.bindTooltip(feature.properties.label);
            }
            // If it is available add clickable info
            if (feature.properties.available !== null) {
              layer.on('click', function(e) {
                // Change currently selected layer color
                layer.setStyle(options.LAYERS.INDEX.SELECTED);
                // Change previously selected layer color to original color
                if (prevLayer !== null) {
                  geoJSONLayer.resetStyle(prevLayer);
                }
                prevLayer = layer;
                GeoBlacklight.Util.indexMapTemplate(feature.properties, function(html) {
                  // find texty-text links in note field and turn into active links
                  const text = linkifyNote(html);
                  $('.viewer-information').html(text).slideDown();
                });
                GeoBlacklight.Util.indexMapDownloadTemplate(feature.properties, function(html) {
                  $('.js-index-map-feature').remove();
                  $('.js-download-list').append(html);
                });
              });
            }
          },
          // For point index maps, use circle markers
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
          }
        }).addTo(_this.map);
        _this.map.fitBounds(geoJSONLayer.getBounds());
    });
  }
});

const linkifyNote = ( input ) => {
  let text = input;
  const noteFound = text.match( /index-map__note/ );

  if ( noteFound != null ) {
    // split html into two sections: before and after index-map__note
    const preNoteText = text.split('index-map__note').shift();
    let noteText = text.split('index-map__note').pop();

    // remove phrase "View in library: " if link coming from aeon
    const noteHarvard = noteText.includes("aeon.hul.harvard.edu");
    if (noteHarvard != null ) {
      noteText = noteText.replace("View in Library: ", "");
    }

    // convert any links in note field into links
    const noteWithLinks = convertLinks(noteText);

    // recombine sections with new html for links
    text = preNoteText + noteWithLinks;
    return text;

  } else {
    return input;
  }
}

const convertLinks = ( input ) => {
  let text = input;
  // const linksFound = text.match( /(?:www|https?)[^\s]+/g );
  const linksFound = text.match( /(\b(?:www|https?)[-A-Z0-9+&@#\/%?=~_|!:,.;()* ]*[-A-Z0-9+&@#\/%=~_|])/gim );
  const aLink = [];

  if ( linksFound != null ) {
    for ( let i=0; i<linksFound.length; i++ ) {

      const replace = linksFound[i];

      // find links
      if ( !( linksFound[i].match( /(http(s?)):\/\// ) ) ) { replace = 'http://' + linksFound[i] }

      // create shortened link text
      const linkText = replace.split( '/' )[2];
      if ( linkText.substring( 0, 3 ) == 'www' ) { linkText = linkText.replace( 'www.', '' ) }

      // if youtube link
      if ( linkText.match( /youtu/ ) ) {
        const youtubeID = replace.split( '/' ).slice(-1)[0];
        aLink.push( '<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/' + youtubeID + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>' )
      }

      // if vimeo link
      else if ( linkText.match( /vimeo/ ) ) {
        const vimeoID = replace.split( '/' ).slice(-1)[0];
        aLink.push( '<div class="video-wrapper"><iframe src="https://player.vimeo.com/video/' + vimeoID + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>' )
      }

      // if aeon link
      else if ( linkText.match( /aeon.hul.harvard.edu/ )) {
        aLink.push( '<a class="hl__button--small" href="' + replace + '" target="_blank">Request this item through Hollis</a>' );
      }

      // everything else
      else {
        aLink.push( '<a href="' + replace + '" target="_blank">' + replace + '</a>' );
      }

      text = text.split( linksFound[i] ).map(item => { return aLink[i].includes('iframe') ? item.trim() : item } ).join( aLink[i] );
    }
    return text;

  }
  else {
    return input;
  }
}
