from flask import Flask,jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
import sqlite3
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "games.db")


app = Flask(__name__)
CORS(app, origins=["https://board-game-store-sepia.vercel.app/"])

ALLOWED_FAMILIES = {"familygames_rank", "abstracts_rank", "partygames_rank", 
                    "strategygames_rank", "thematic_rank", "wargames_rank"}
ALLOWED_SORTBY = {"rank", "average", "usersrated", "prices", "yearpublished"}
ALLOWED_ORDER = {"ASC", "DESC"}



def wikipedia_info(game_name):
    headers = {
        "User-Agent": "MyApp/1.0 (your_email@example.com)"
    }

    response1 = requests.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{game_name}",headers=headers)

    result1 = response1.json()
    about = result1.get("extract") or None
    if not about:
        return {
            "about":"No Informatiom Availabe for this",
            "howtoplay":"No Information Availabe For this"
    }
    response2 = requests.get(f"https://en.wikipedia.org/w/api.php?action=parse&page={game_name}&prop=text&section=1&format=json",headers=headers)
    result2 = response2.json()
    gameplay_html = result2.get("parse", {}).get("text", {}).get("*")  

    if not gameplay_html:
        return {
            "about":about,
            "howtoplay":"No Information Availabe For this"
    }
    soup = BeautifulSoup(gameplay_html,"html.parser")
    return {
        "about":about,
        "howtoplay":soup.get_text()
    }

 
@app.route("/")
def home():
    return "Welcome"

@app.route("/getData/")
def getData () :
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()                
            cursor.execute("SELECT games_id,name,average,thumbnails,prices FROM games")
            result = cursor.fetchall()
            main_result = []
            sub_result = []
            index = 0
            for item in result:
                sub_result.append(item)
                index += 1
                if index == 40:
                    main_result.append(sub_result)
                    sub_result = []
                    index = 0
            if sub_result:
                main_result.append(sub_result)
            return jsonify(main_result)
    except sqlite3.OperationalError:
        return None

@app.route("/getData/<string:family>/")
def getFamilyData(family):
    if family not in ALLOWED_FAMILIES :
        return jsonify({"error": "Invalid parameters"}), 400
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT games_id,name,average,thumbnails,prices FROM games WHERE {family} != 0")
            result = cursor.fetchall()
            main_result = []
            sub_result = []
            index = 0
            for item in result:
                sub_result.append(item)
                index += 1
                if index == 40:
                    main_result.append(sub_result)
                    sub_result = []
                    index = 0
            if sub_result:
                main_result.append(sub_result)
            return jsonify(main_result)
    except sqlite3.OperationalError:
        return None
        

@app.route("/getData/<string:family>/<string:sortby>/<string:sortingWay>/")
def getSortedData(family,sortby,sortingWay):
    if family not in ALLOWED_FAMILIES or sortby not in ALLOWED_SORTBY or sortingWay not in ALLOWED_ORDER:
        return jsonify({"error": "Invalid parameters"}), 400
    try:
        with sqlite3.connect(DB_PATH)as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT games_id,name,average,thumbnails,prices FROM games WHERE {family} != 0 ORDER BY {sortby} {sortingWay}")
            result = cursor.fetchall()
            main_result = []
            sub_result = []
            index = 0
            for item in result:
                sub_result.append(item)
                index += 1
                if index == 40:
                    main_result.append(sub_result)
                    sub_result = []
                    index = 0
            if sub_result:
                main_result.append(sub_result)
            return jsonify(main_result)
    except sqlite3.OperationalError:
        return None

@app.route("/getData/<string:sortby>/<string:sortingWay>/")
def getNoFamilySortedData(sortby,sortingWay):
    if sortby not in ALLOWED_SORTBY or sortingWay not in ALLOWED_ORDER:
        return jsonify({"error": "Invalid parameters"}), 400
    try:
        with sqlite3.connect(DB_PATH)as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT games_id,name,average,thumbnails,prices FROM games ORDER BY {sortby} {sortingWay}")
            result = cursor.fetchall()
            main_result = []
            sub_result = []
            index = 0
            for item in result:
                sub_result.append(item)
                index += 1
                if index == 40:
                    main_result.append(sub_result)
                    sub_result = []
                    index = 0
            if sub_result:
                main_result.append(sub_result)
            return jsonify(main_result)
    except sqlite3.OperationalError:
        return None
    
@app.route("/getProductInfo/<int:games_id>/")
def productInfo(games_id):
    youtubeApiKey = os.getenv("YOUTUBE_API_KEY")
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT * FROM games WHERE games_id = ?",(games_id,))
            result = cursor.fetchall()
            response = wikipedia_info(result[0][2])
            youtubeResponse = requests.get(f"https://www.googleapis.com/youtube/v3/search?part=snippet&q=how+to+play+{result[0][2]}&type=video&maxResults=1&key={youtubeApiKey}")
            youtubeResult = youtubeResponse.json()
            videoId = youtubeResult["items"][0]["id"]["videoId"]
            return jsonify({"result":result[0], "details":response, "video":"https://www.youtube.com/embed/"+videoId}) 
    except sqlite3.OperationalError:
        return None       


@app.route("/getProduct/<string:search>/")
def getProduct(search):
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT games_id, name, average, thumbnails, prices FROM games WHERE name LIKE ?",(f"%{search}%",))
            result = cursor.fetchone()
            if result:
                return jsonify(list(result))
            else:
                return jsonify([])
    except sqlite3.OperationalError:
        return None;

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

