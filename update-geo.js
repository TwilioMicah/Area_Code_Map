var fs = require('fs');

var obj = JSON.parse(
    fs.readFileSync(
        'src/components/geoData/Area__Code__Boundaries.json',
        'utf8'
    )
);

let totalpoints = 0;
let reducedpoints = 0;
const screenRate = 10;

obj.features.forEach((element, index) => {
    let newCoordinates = [];

    if (!['ON'].includes(element.properties.STATE)) {
        element.geometry.coordinates.forEach((coords) => {
            const travesable =
                element.geometry.type === 'MultiPolygon' ? coords[0] : coords;

            totalpoints += travesable.length;

            const reducedPoints =
                travesable.length > 20
                    ? travesable.filter((x, i) => i % screenRate === 0)
                    : travesable;

            reducedpoints += reducedPoints.length;

            if (element.geometry.type === 'MultiPolygon') {
                newCoordinates.push([reducedPoints]);
            } else {
                newCoordinates.push(reducedPoints);
            }
        });

        element.geometry.coordinates = newCoordinates;
    }
});

//obj.features = obj.features.filter((f) => f.properties.NPA !== '520');

console.log(reducedpoints + '/' + totalpoints);

fs.writeFile(
    'src/components/geoData/small-geojson.json',
    JSON.stringify(obj),
    'utf8',
    () => {}
);
