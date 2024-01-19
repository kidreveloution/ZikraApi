from pymongo import MongoClient
from mongo_memory import *
def list_collections_and_documents(db_name):
    # Connect to MongoDB - Replace 'localhost' and '27017' with your MongoDB host and port if different
    uri = "mongodb+srv://localBuild:azZWk6zEmqiQ4068@zikracluster.viuumuy.mongodb.net/?retryWrites=true&w=majority"

    # Create a client instance
    # client = MongoClient('localhost', 27017)
    client = MongoClient(uri, server_api=ServerApi('1'))

    # Access the specified database
    db = client[db_name]

    # Get a list of all collection names in the database
    collection_names = db.list_collection_names()

    # Iterate over each collection
    for collection_name in collection_names:
        print(f"\nCollection: {collection_name}")

        # Access the collection
        collection = db[collection_name]

        # Retrieve and print all documents in the collection
        for document in collection.find():
            print(document)

# Example usage
# list_collections_and_documents('your_database_name')

if __name__ == "__main__":
    list_collections_and_documents("zikra_db")
    # print("\n\n LOADING MONGO")
    # print(mongoLoad('65a77a18a669210e1719c753'))
    # print(mongoDelete('65a77a18a669210e1719c753'))

    # Define the coordinates of the point you want to retrieve
    point_latitude = 12.3456
    point_longitude = 98.7654

    # Define the bounding box coordinates that include the point
    ne_lat = point_latitude + 12.5  # Adjust as needed
    ne_long = point_longitude + 12.5 # Adjust as needed
    sw_lat = point_latitude - 12.5  # Adjust as needed
    sw_long = point_longitude - 12.4 # Adjust as needed

    # Call the function to retrieve the document within the specified bounding box
    #print("\n\n GETTING MEMORIES")
    print(mongoGetMemoriesInFrame(ne_lat=12.3556,ne_long=98.7754, sw_lat=12.3356,sw_long=98.7554))
    #print(mongoGetAllMemories('2024-01-12'))