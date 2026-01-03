from flask import Flask, jsonify
import requests

app = Flask(__name__) 

@app.route("/newreleases", methods=["GET"])
def get_new_releases(): 
    access_token = "BQDY4uIDZDDoy_iHXUBfIwCvswY-hfFYnaWXcmUM8Zruy4_xQbnfDXusq0oFv1yYwpAbpVwwOPF-m0geRd-lA9kTwF0ntT_kGdbfu6JKq4v1GrCinOQ"
    endpoint = "https://api.spotify.com/v1/browse/new-releases"
    headers = { "Authorization" : f"Bearer {access_token}"  }
    params = {"limit": 20, "offset": 0 }
    response = requests.get(endpoint, headers=headers, params=params)
    new_releases = response.json()
    albums = new_releases.get("albums", {}).get("items", []) 

    album_data = [] 
    if response.status_code == 200: 
        for album in albums: 
            album_name = album.get("name") 
            artists = album.get("artists", []) 
            images = album.get("images", []) 
            image_url = images[0]["url"] if images else None
            for artist in artists: 
                artist_name = artist.get("name") 
            album_data.append({
            "album": album_name,
            "artists": artist_name, 
            "images": image_url


            })
        return jsonify(album_data)

    else: 
        return jsonify({"error": response.json()}), response.status_code 
    
    

if __name__ == "__main__": 
    app.run(debug=True)







