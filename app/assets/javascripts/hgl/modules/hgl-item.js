Blacklight.onLoad(function() {
  $('[data-map="item"]').each(function(i, element) {

    // get viewer module from protocol value and capitalize to match class name
    var viewerName = $(element).data().protocol,
      viewer;

    // get new viewer instance and pass in element
    viewer = new window['GeoBlacklight']['Viewer'][viewerName](element);

    // choose more metadata fields to appear one per line
    const onePerLine = ( fieldName ) => {
      const $fieldLookup = "dd."+fieldName;
      let $text = $($fieldLookup).html();

      // check if field exists on item detail page
      if ($text != null){
        // remove commas, spaces, and
        $text = $text.replace('> and ','>').replace('>, and ','>').replace(/>, /g,'>');

        // adds shows more button if long list
        let $newText = $($fieldLookup).html('<div class="truncate-abstract">' + $text + '</div>');

        return $newText;
      }
    }

    // calls the metadata we want as one per line
    onePerLine("blacklight-dc_subject_sm");
    onePerLine("blacklight-dct_spatial_sm");
    onePerLine("blacklight-dc_creator_sm");
  });



  // truncation button
  $('.truncate-abstract').each(function(i, element) {
    var lines = 12 * parseFloat(getComputedStyle(element).fontSize);
    if (element.getBoundingClientRect().height < lines) return;
    var id = element.id || 'truncate-' + i;

    element.id = id;
    $(element).addClass('collapse');

    const $fieldName = $(this).parent().prop('className');
    let $label = "";

    if ($fieldName.includes("blacklight-dc_description_s")){
      $label = "description";
    } else if ($fieldName.includes("blacklight-dct_spatial_sm")){
      $label = "places";
    } else if ($fieldName.includes("blacklight-dc_subject_sm")){
      $label = "subjects";
    } else if ($fieldName.includes("blacklight-dc_creator_sm")){
      $label = "authors";
    };

    let $showMore = "More " + $label;
    let $showLess = "Fewer " + $label;

    if ($label === "description"){
      $showLess = "Less " + $label;
    }

    var control = $('<button class="btn btn-link p-0 border-0" data-toggle="collapse" aria-expanded="false" data-target="#' + id + '" aria-controls="' + id + '">' + $showMore + '</button>');

    $(element).on('show.bs.collapse', function() {
      control.text($showLess);
    });
    $(element).on('hide.bs.collapse', function() {
      control.text($showMore);
    });

    control.collapse();
    control.insertAfter(element);
  });
});
