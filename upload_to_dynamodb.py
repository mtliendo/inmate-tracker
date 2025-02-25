import csv
import json
import boto3 # type: ignore
from datetime import datetime

def parse_charges(charges_str):
    try:
        # Remove any whitespace and parse the string as JSON
        charges_list = json.loads(charges_str)
        # Extract the "S" values from the complex structure
        parsed_charges = []
        for charge in charges_list:
            if isinstance(charge, dict):
                if "S" in charge:
                    parsed_charges.append(charge["S"])
                elif "M" in charge and "S" in charge["M"] and "S" in charge["M"]["S"]:
                    parsed_charges.append(charge["M"]["S"]["S"])
        return parsed_charges
    except:
        return []

def parse_datetime(date_str):
    try:
        # Try to parse the datetime string
        dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        return date_str
    except:
        try:
            # Try to parse the alternative format
            dt = datetime.strptime(date_str, "%m/%d/%Y %I:%M %p")
            return dt.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        except:
            return None

# Initialize DynamoDB client
session = boto3.Session(profile_name='focus-otter-sandbox-admin', region_name='us-east-1')
dynamodb = session.resource('dynamodb')
table = dynamodb.Table('Inmate-4wk52dsvpnh47bqrlbhrdsdki4-NONE')

# Read and process the CSV file
items_to_upload = []
with open('inmates.csv', mode='r', encoding='utf-8') as csvfile:
    csv_reader = csv.DictReader(csvfile)
    for row in csv_reader:
        # Create item with proper DynamoDB formatting
        item = {
            'id': row['id'],
            '__typename': row['__typename'],
            'age': int(row['age']),
            'bookingDateTime': parse_datetime(row['bookingDateTime']),
            'charges': parse_charges(row['charges']),
            'committingAgency': row['committingAgency'],
            'createdAt': parse_datetime(row['createdAt']),
            'mugshotUrl': row['mugshotUrl'],
            'name': row['name'],
            'profileUrl': row['profileUrl'],
            'updatedAt': parse_datetime(row['updatedAt'])
        }
        
        # Add releaseDateTime only if it exists and is not empty
        if row['releaseDateTime'] and row['releaseDateTime'].strip():
            release_date = parse_datetime(row['releaseDateTime'])
            if release_date:
                item['releaseDateTime'] = release_date

        items_to_upload.append(item)

# Upload items in batches of 25 (DynamoDB batch write limit)
def upload_in_batches(items, batch_size=25):
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        try:
            with table.batch_writer() as writer:
                for item in batch:
                    writer.put_item(Item=item)
            print(f"Successfully uploaded batch {i//batch_size + 1}")
        except Exception as e:
            print(f"Error uploading batch {i//batch_size + 1}: {str(e)}")

# Start the upload
print(f"Starting upload of {len(items_to_upload)} items...")
upload_in_batches(items_to_upload)
print("Upload complete!") 