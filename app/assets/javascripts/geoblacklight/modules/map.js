// modify map viewer behaviors

GeoBlacklight.Viewer.Map = GeoBlacklight.Viewer.Map.extend({
  // override initial bbox
  options: {
    bbox: [[-60,-60],[100,80]]
  }
});
