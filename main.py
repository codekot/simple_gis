import json
from flask import Flask, render_template, jsonify
import folium
import jenkspy
import os
from dotenv import load_dotenv
import requests
import geopandas as gpd

try:
    load_dotenv()
except:
    pass

host = os.getenv('HOST', '0.0.0.0')

file_id = os.environ['FILE_ID']
geojson_url = f'https://drive.google.com/uc?id={file_id}&export=download'

center_latitude = 57
center_longitude = 52
zoom_level = 8

base_map = folium.Map(location=[center_latitude, center_longitude], zoom_start=zoom_level, tiles="openstreetmap")

response = requests.get(geojson_url)

geojson_data = json.loads(response.content)

pop_data = [f['properties']['NUMPOINTS'] for f in geojson_data['features']]

num_classes = 15

breaks = jenkspy.jenks_breaks(pop_data, n_classes=num_classes)

df = gpd.GeoDataFrame.from_features(geojson_data)
data = df[["fid", "NUMPOINTS"]].squeeze()

folium.Choropleth(
    geo_data=geojson_data,
    name="choropleth",
    data=data,
    columns=['fid', 'NUMPOINTS'],
    key_on="feature.properties.fid",
    fill_color='Spectral_r',
    fill_opacity=0.85,
    line_opacity=0.2,
    legend_name="Population",
    bins=breaks,
    highlight=True,
    use_jenks=False,
).add_to(base_map)

base_map.fit_bounds(base_map.get_bounds())


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html", base_map=base_map._repr_html_())


@app.route("/leaflet")
def leaflet():
    return render_template("leaflet_map.html")


@app.route("/data")
def data():
    return jsonify({
        "geojson": geojson_data,
        "breaks": breaks})


if __name__ == "__main__":
    if os.environ.get('FLASK_ENV') == 'production':
        debug = False
    else:
        debug = True
    # app.run(host=host, port=5000, debug=debug)
    app.run(debug=debug)
