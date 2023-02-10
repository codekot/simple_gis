from flask import Flask, render_template
import folium


center_latitude = 57
center_longitude = 52
zoom_level = 8


base_map = folium.Map(location=[center_latitude, center_longitude], zoom_start=zoom_level)

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html", base_map=base_map._repr_html_())


if __name__ == "__main__":
    app.run(debug=True)
