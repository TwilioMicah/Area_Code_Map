import * as turf from '@turf/turf';
var pt = turf.point([-77, 44]);
var poly = turf.polygon([
  [
    [-81, 41],
    [-81, 47],
    [-72, 47],
    [-72, 41],
    [-81, 41],
  ],
]);

console.log(turf.booleanPointInPolygon(pt, poly))
//= true