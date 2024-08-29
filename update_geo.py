import csv

# Initialize an empty dictionary
output_dict = {}

# Open and read the CSV file using the relative path
with open('./src/statusData.csv', newline='') as csvfile:
    # Use the csv.reader to parse the comma-separated file
    csv_reader = csv.reader(csvfile, delimiter=',')
    
    # Process each row in the CSV
    for row in csv_reader:
        # Skip rows that don't have exactly 3 columns
        if len(row) != 3:
            continue
        
        # Extract area code, status, and turnover
        area_code, status, turnover = row
        
        # Extract the first three digits of the area code
        prefix = area_code[1:]
        
        # Create a dictionary entry
        output_dict[prefix] = {
            'status': status.capitalize(),
            'turnover': turnover.capitalize()
        }

# Print the resulting dictionary
print(output_dict)
