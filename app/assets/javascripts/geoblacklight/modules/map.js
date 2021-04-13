// modify map viewer behaviors

GeoBlacklight.Viewer.Map = GeoBlacklight.Viewer.Map.extend({

  // override initial bbox
  options: {
      bbox: [[-40, -90],[60, 50]]
  }
});
