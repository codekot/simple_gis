import json
from flask import Flask, render_template
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

# geojson_url = os.environ['GEOJSON_URL']
host = os.getenv('HOST', '0.0.0.0')

file_id = os.environ['FILE_ID']
geojson_url = f'https://drive.google.com/uc?id={file_id}&export=download'

center_latitude = 57
center_longitude = 52
zoom_level = 8

base_map = folium.Map(location=[center_latitude, center_longitude], zoom_start=zoom_level, tiles="cartodbpositron")

# geojson_file = "udmurtia_hex_without_towns.geojson"
geojson_file = 'temp.geojson'
response = requests.get(geojson_url)

geojson_data = json.loads(response.content)


pop_data = [f['properties']['NUMPOINTS'] for f in geojson_data['features']]

num_classes = 15

breaks = jenkspy.jenks_breaks(pop_data, n_classes=num_classes)

df = gpd.read_file(geojson_file)
data = df[["fid", "NUMPOINTS"]].squeeze()

folium.Choropleth(
    geo_data=geojson_file,
    name="choropleth",
    data=data,
    columns=['fid', 'NUMPOINTS'],
    key_on="feature.properties.fid",
    fill_color='Spectral_r',
    fill_opacity=0.7,
    line_opacity=0.2,
    legend_name="Population",
    bins=breaks,
    highlight=True,
    use_jenks=False,
).add_to(base_map)

base_map.fit_bounds(base_map.get_bounds())

# for i in range(len(df)):
#     polygon_coords = [(y, x) for x, y in df.iloc[i]["geometry"].exterior.coords[:]]
#     folium.Polygon(
#         locations=polygon_coords,
#         popup="Население:"+str(int(df.iloc[i]["NUMPOINTS"])),
#         fill=True,
#         color=None,
#         fill_opacity=0.0,
# ).add_to(base_map)


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html", base_map=base_map._repr_html_())


if __name__ == "__main__":
    if os.environ.get('FLASK_ENV') == 'production':
        debug = False
    else:
        debug = True
    # app.run(host=host, port=5000, debug=debug)
    app.run(debug=debug)
