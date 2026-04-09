import requests
import csv
import time
import os

input_path = "../boardgameDatabase/boardgames_ranks.csv"
output_path = "../boardgameDatabase/boardgamesInfo.csv"

fieldnames = ["id","images", "thumbnails", "prices"]

file_exists = os.path.isfile(output_path)

processed_ids = set()
if file_exists:
    with open(output_path,"r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            processed_ids.add(row["id"])

print(f"Skipping {len(processed_ids)} already processed IDs...")

with open(input_path, "r", encoding="utf-8") as input_file, open(output_path, "a", newline="") as output_file:
    
    reader = csv.DictReader(input_file)
    writer = csv.DictWriter(output_file, fieldnames=fieldnames)

    count = 0

    if not file_exists:
        writer.writeheader()


    for row in reader:
        game_id = row["id"]

        if game_id in processed_ids:
            continue

        url = f"https://boardgameprices.com/api/info?eid={game_id}&currency=USD"

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error at ID {game_id}: {e}")
            break

        data = response.json()
        items = data.get("items", [])

        if items:
            item = items[0]
            image = item.get("image")
            thumbnail = item.get("thumbnail")

            prices = item.get("prices", [])
            price = prices[0].get("price") if prices else None
        else:
            image = thumbnail = price = None

        writer.writerow({
            "id":game_id,
            "images": image,
            "thumbnails": thumbnail,
            "prices": price
        })

        time.sleep(1)
        count += 1
print(f"Done. Newly processed: {count}")



