import { distData } from "./Dist.js";
import {
  shops,
  DniprovskyShops,
  KhortytskyiShops,
  KommunarskyShops,
} from "./Shops.js";
// async function getGeoJson() {
//   try {
//     let geoJson = await fetch(
//       `https://api.visicom.ua/data-api/5.0/uk/geocode.json?categories=adm_district&text=Запоріжжя, Шевченківський&key=d432dad871d6f39bc00c7b4018b20466`
//     );
//     if (!geoJson.ok) {
//       throw new Error(`User with this id is not found.Please try another id`);
//     }
//     let done = await geoJson.json();

//     console.log(done);
//   } catch (err) {
//     alert(err);
//     console.log(err);
//   }
// }

// getGeoJson();

// async function getGeoJson() {
//   try {
//     let geoJson = await fetch(
//       `https://api.visicom.ua/data-api/5.0/uk/feature/DST1SQ.json?key=d432dad871d6f39bc00c7b4018b20466`
//     );
//     if (!geoJson.ok) {
//       throw new Error(`User with this id is not found.Please try another id`);
//     }
//     let done = await geoJson.json();

//     console.log(done);
//   } catch (err) {
//     alert(err);
//     console.log(err);
//   }
// }

// getGeoJson();

let map = L.map("map").setView([47.8467719, 35.1318698], 12);

let tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  // maxZoom: 12,
  minZoom: 11,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.geoJson(distData).addTo(map);

const info = L.control();

const infoSecond = L.control();

const modalEl = `

`;

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};
info.update = function (props) {
  const contents = props
    ? `<b>${props.name} - </b>${props.averCheck} грн <br> <hr>`
    : "Наведіть на район";
  this._div.innerHTML = `<h2>Середній чек</h2> <br> ${contents} `;

  if (props) {
    props.shop_info.sort((a, b) => b.avaregeCheck - a.avaregeCheck);
    props.shop_info.forEach((el) => {
      this._div.innerHTML += `<p>${el.name} - ${el.avaregeCheck.toFixed(
        2
      )} грн</p>`;
      console.log(el);
    });
  } else this._div.innerHTML = `<h4>Середній чек</h4>${contents}`;
};

info.addTo(map);

function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
    ? "#BD0026"
    : d > 200
    ? "#E31A1C"
    : d > 100
    ? "#FC4E2A"
    : d > 50
    ? "#FD8D3C"
    : d > 20
    ? "#FEB24C"
    : d > 10
    ? "#FED976"
    : "#FFEDA0";
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.averCheck),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.3,
  };
}

L.geoJson(distData, { style: style }).addTo(map);

function highlightFeature(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "effddf",
    fillOpacity: 0.5,
  });

  layer.bringToFront();

  info.update(layer.feature.properties);
}

/* global statesData */
const geojson = L.geoJson(distData, {
  style,
  onEachFeature,
}).addTo(map);

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

const legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  const div = L.DomUtil.create("div", "info legend");
  const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
  const labels = [];
  let from, to;

  for (let i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      `<i style="background:${getColor(from + 1)}"></i> ${from}${
        to ? `&ndash;${to}` : "+"
      }`
    );
  }

  div.innerHTML = labels.join("<br>");
  return div;
};

legend.addTo(map);

function openModal(markerData) {
  document.getElementById("markerInfo").textContent = markerData;
  const modal = new bootstrap.Modal(document.getElementById("markerModal"));
  modal.show();
}

shops.forEach((element) => {
  L.circle(element.latlng, {
    radius: element.avaregeCheck * 2,
    weight: 2,
    color: "#3388ff",
    pane: "popupPane",
  })
    .addTo(map)
    .bindPopup(`${element.name} - ${element.avaregeCheck.toFixed(2)} грн`)
    .on("click", () => openModal("test"));
  //   L.popup(element.latlng, {
  //     content: `<p>${element.name}</p>`,
  //     maxWidth: 400,
  //   })
  //     .addTo(map)
  //     .openOn(map);
});

console.log(typeof JSON.parse(JSON.stringify(DniprovskyShops)));
// console.log(KhortytskyiShops);
// console.log(KommunarskyShops);
