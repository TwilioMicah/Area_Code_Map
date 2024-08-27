import json
import math

# Path to your JSON file
file_path = './src/components/Area__Code__Boundaries.json'

# Read the JSON file
with open(file_path, 'r') as file:
    data = json.load(file)

# Initialize a set to track unique rounded areas
location_set = set()

# Iterate through the features in reverse to safely delete items
for i in range(len(data['features']) - 1, -1, -1):
    feature = data['features'][i]
    #shape_area = float(feature['properties']['SHAPE__Area'])
    #rounded_area = math.floor(shape_area)
    #print(data['features'][i]['properties']['NPA'])
    print(i)
    if data['features'][i]['properties']['NPA'] in location_set:
        print(data['features'][i]['properties']['NPA'])
        
    else:
        location_set.add(data['features'][i]['properties']['NPA'])

# Save the changes back to the JSON file without pretty-printing
#with open(file_path, 'w') as file:
 #   json.dump(data, file, separators=(',', ':'), ensure_ascii=False)
