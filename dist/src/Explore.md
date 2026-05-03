---
title: Explore
toc: false
---

On this page, we'll do some data exploration. 
First, we show a world map colored according to our data. We visualize how many percent of people of each country said they used following approach when dealing with anxiety or depression. You can change the approach using the select item. The countries where we have no data of are colored grey.

In the next plot, we first visualize the data summarized over each continent and when you click on a continent the map zooms in on that continent and colors the map per country instead of per continent. When you click on the background, you go back to the data per continent. You can again use the interactive item to choose the shown approach. 


```js

import * as d3 from "npm:d3";
globalThis.d3 = d3;
```

```js
import {Legend} from "./components/Legend.js";
```

```js
const world = FileAttachment("./data/countries-50m.json").json();
```
```js
const countries = topojson.feature(world, world.objects.countries);
```
```js
const countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b)
```

```js
const comparison_approaches = FileAttachment("./data/comparison_approaches.csv").csv();
```
```js
const rename = new Map([
  ["Bosnia and Herzegovina", "Bosnia and Herz."],
  ["Dominican Republic", "Dominican Rep."],
  ["Cote d'Ivoire", "Côte d'Ivoire"],
  ["North Macedonia","Macedonia"], // is not given in the countries map
  ["United States","United States of America"]
]);

const approaches = comparison_approaches.map(d => ({
  // Look up the rename; if not found, keep the original Entity name
  name: rename.get(d.Entity) || d.Entity, 
  // Ensure the value is a number using the + prefix
  Spirituality: +d.Spirituality,
  Lifestyle: +d.Lifestyle,
  Work: +d.Work,
  Relationships: +d.Relationships,
  Talking : +d.Talking,
  Medication: +d.Medication,
  Nature: +d.Nature,
  Professional: +d.Professional
}));
```

```js
const description_to_valuename = new Map([
  ["engaging in religious/spiritual activities", "Spirituality"],
  ["improving healthy lifestyle behaviors", "Lifestyle"],
  ["making a change to work situation", "Work"],
  ["making a change to personal relationships", "Relationships"],
  ["talking to friends or family", "Talking"],
  ["taking prescribed medication", "Medication"],
  ["spending time in nature/the outdoors", "Nature"],
  ["talking to mental health professional", "Professional"]
])
```
```js
const approach_description = view(
  Inputs.select([ "engaging in religious/spiritual activities",
  "improving healthy lifestyle behaviors",
  "making a change to work situation",
  "making a change to personal relationships", 
  "talking to friends or family", 
  "taking prescribed medication", 
  "spending time in nature/the outdoors", 
  "talking to mental health professional"], {label: "Dealt with anxiety/depression by...", width: 280})
);
```

```js
const valuemap = new Map(approaches.map(d => [d.name, d[description_to_valuename.get(approach_description)]]))
```

```js
const countryToContinent = new Map([
  // AFRICA
  ["Algeria", "Africa"], ["Angola", "Africa"], ["Benin", "Africa"], ["Botswana", "Africa"], ["Burkina Faso", "Africa"], ["Burundi", "Africa"], ["Cameroon", "Africa"], ["Cape Verde", "Africa"], ["Central African Rep.", "Africa"], ["Chad", "Africa"], ["Comoros", "Africa"], ["Congo", "Africa"], ["Dem. Rep. Congo", "Africa"], ["Djibouti", "Africa"], ["Egypt", "Africa"], ["Eq. Guinea", "Africa"], ["Eritrea", "Africa"], ["Ethiopia", "Africa"], ["Gabon", "Africa"], ["Gambia", "Africa"], ["Ghana", "Africa"], ["Guinea", "Africa"], ["Guinea-Bissau", "Africa"], ["Côte d'Ivoire", "Africa"], ["Kenya", "Africa"], ["Lesotho", "Africa"], ["Liberia", "Africa"], ["Libya", "Africa"], ["Madagascar", "Africa"], ["Malawi", "Africa"], ["Mali", "Africa"], ["Mauritania", "Africa"], ["Mauritius", "Africa"], ["Morocco", "Africa"], ["Mozambique", "Africa"], ["Namibia", "Africa"], ["Niger", "Africa"], ["Nigeria", "Africa"], ["Rwanda", "Africa"], ["São Tomé and Principe", "Africa"], ["Senegal", "Africa"], ["Seychelles", "Africa"], ["Sierra Leone", "Africa"], ["Somalia", "Africa"], ["Somaliland", "Africa"], ["South Africa", "Africa"], ["S. Sudan", "Africa"], ["Sudan", "Africa"], ["Swaziland", "Africa"], ["Tanzania", "Africa"], ["Togo", "Africa"], ["Tunisia", "Africa"], ["Uganda", "Africa"], ["Western Sahara", "Africa"], ["Zambia", "Africa"], ["Zimbabwe", "Africa"],  ["W. Sahara", "Africa"], ["eSwatini", "Africa"],

  // ASIA
  ["Afghanistan", "Asia"], ["Armenia", "Asia"], ["Azerbaijan", "Asia"], ["Bangladesh", "Asia"], ["Bhutan", "Asia"], ["Brunei", "Asia"], ["Cambodia", "Asia"], ["China", "Asia"], ["Cyprus", "Asia"], ["Georgia", "Asia"], ["India", "Asia"], ["Indonesia", "Asia"], ["Iran", "Asia"], ["Iraq", "Asia"], ["Israel", "Asia"], ["Japan", "Asia"], ["Jordan", "Asia"], ["Kazakhstan", "Asia"], ["Kuwait", "Asia"], ["Kyrgyzstan", "Asia"], ["Laos", "Asia"], ["Lebanon", "Asia"], ["Malaysia", "Asia"], ["Mongolia", "Asia"], ["Myanmar", "Asia"], ["Nepal", "Asia"], ["North Korea", "Asia"], ["Oman", "Asia"], ["Pakistan", "Asia"], ["Palestine", "Asia"], ["Philippines", "Asia"], ["Qatar", "Asia"], ["Saudi Arabia", "Asia"], ["Singapore", "Asia"], ["South Korea", "Asia"], ["Sri Lanka", "Asia"], ["Syria", "Asia"], ["Taiwan", "Asia"], ["Tajikistan", "Asia"], ["Thailand", "Asia"], ["Timor-Leste", "Asia"], ["Turkey", "Asia"], ["Turkmenistan", "Asia"], ["United Arab Emirates", "Asia"], ["Uzbekistan", "Asia"], ["Vietnam", "Asia"], ["Yemen", "Asia"],

  // EUROPE
  ["Albania", "Europe"], ["Austria", "Europe"], ["Belarus", "Europe"], ["Belgium", "Europe"], ["Bosnia and Herz.", "Europe"], ["Bulgaria", "Europe"], ["Croatia", "Europe"], ["Czech Rep.", "Europe"], ["Denmark", "Europe"], ["Estonia", "Europe"], ["Finland", "Europe"], ["France", "Europe"], ["Germany", "Europe"], ["Greece", "Europe"], ["Hungary", "Europe"], ["Iceland", "Europe"], ["Ireland", "Europe"], ["Italy", "Europe"], ["Kosovo", "Europe"], ["Latvia", "Europe"], ["Lithuania", "Europe"], ["Luxembourg", "Europe"], ["Macedonia", "Europe"], ["Moldova", "Europe"], ["Montenegro", "Europe"], ["Netherlands", "Europe"], ["Norway", "Europe"], ["Poland", "Europe"], ["Portugal", "Europe"], ["Romania", "Europe"], ["Russia", "Europe"], ["Serbia", "Europe"], ["Slovakia", "Europe"], ["Slovenia", "Europe"], ["Spain", "Europe"], ["Sweden", "Europe"], ["Switzerland", "Europe"], ["Ukraine", "Europe"], ["United Kingdom", "Europe"], ["Czechia", "Europe"],

  // NORTH AMERICA
  ["Bahamas", "North America"], ["Belize", "North America"], ["Canada", "North America"], ["Costa Rica", "North America"], ["Cuba", "North America"], ["Dominican Rep.", "North America"], ["El Salvador", "North America"], ["Greenland", "North America"], ["Guatemala", "North America"], ["Haiti", "North America"], ["Honduras", "North America"], ["Jamaica", "North America"], ["Mexico", "North America"], ["Nicaragua", "North America"], ["Panama", "North America"], ["Puerto Rico", "North America"], ["Trinidad and Tobago", "North America"], ["United States of America", "North America"],

  // SOUTH AMERICA
  ["Argentina", "South America"], ["Bolivia", "South America"], ["Brazil", "South America"], ["Chile", "South America"], ["Colombia", "South America"], ["Ecuador", "South America"], ["Falkland Is.", "South America"], ["Guyana", "South America"], ["Paraguay", "South America"], ["Peru", "South America"], ["Suriname", "South America"], ["Uruguay", "South America"], ["Venezuela", "South America"],

  // OCEANIA
  ["Australia", "Oceania"], ["Fiji", "Oceania"], ["New Caledonia", "Oceania"], ["New Zealand", "Oceania"], ["Papua New Guinea", "Oceania"], ["Solomon Is.", "Oceania"], ["Vanuatu", "Oceania"],

  // ANTARCTICA & OTHERS
  ["Antarctica", "Antarctica"], ["Fr. S. Antarctic Lands", "Antarctica"]
])
```

```js
const continentBounds = (() => {
  const selectedCountries = {
    "Africa": ["Egypt", "South Africa", "Morocco"],
    "Asia": ["Turkey", "Japan", "Indonesia", "China"],
    "Oceania": ["Australia", "Papua New Guinea"], 
    "North America": ["Canada", "Panama"], 
    "South America": ["Venezuela", "Argentina"], 
    "Europe": ["Portugal", "Finland", "Ukraine"]
  };

  const width = 928;
  const marginTop = 46;
  const height = width / 2 + marginTop;
  
  
  const projection = d3.geoEqualEarth()
    .fitExtent([[2, marginTop + 2], [width - 2, height]], {type: "Sphere"});
  const path = d3.geoPath(projection);

  return new Map(
    Object.entries(selectedCountries).map(([continent, list]) => {
      const features = countries.features.filter(f => 
        countryToContinent.get(f.properties.name) === continent && 
        list.includes(f.properties.name)
      );

      return [continent, path.bounds({ type: "FeatureCollection", features })];
    })
  );
})();
```

```js
function chart_zoom(countries, countrymesh, valuemap, approach_description,countryToContinent, continentBounds) {

  // listen for scroll/pinch/drag events
  const zoom = d3.zoom() 
    .scaleExtent([1,10]) //can't zoom out further than the original size or zoom in more than 8x
    .on("zoom",zoomed);
  

  // Specify the chart’s dimensions.
  const width = 928;
  const marginTop = 46;
  const height = width / 2 + marginTop;

  // Fit the projection.
  const projection = d3.geoEqualEarth().fitExtent([[2, marginTop + 2], [width - 2, height]], {type: "Sphere"});
  const path = d3.geoPath(projection);


  // Index the values and create the color scale.
  //const valuemap = new Map(approaches.map(d => [d.name, d.value])); //WHAT WE WANT TO CHANGE
  const color = d3.scaleSequential([0,100], d3.interpolateYlGnBu);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
      .on("click", reset);

  
  //create variable to be adjusted 
  const g = svg.append("g");

  // Append the legend.
  svg.append("g")
      .attr("transform", "translate(20,0)")
      .append(() => Legend(color, {title: "Dealt with anxiety/depression by " + approach_description,                   width: 260})); 
      //.append(() => Legend(color, {title: "Dealt with anxiety/depression by " + title_approach.get(approach), width: 260})); 

  
  // Add a white sphere with a black border.
  g.append("path")
    .datum({type: "Sphere"})
    .attr("fill", "white")
    .attr("stroke", "currentColor")
    .attr("d", path);

  // Add a path for each country and color it according to this data.
  const countriessvg = g.append("g")
    .attr("cursor", "pointer")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("fill", d => {
        const countryName = d.properties.name;
        const continent = countryToContinent.get(countryName);
        const val = valuemap.get(continent);
        return val !== undefined ? color(val) : "#ccc";
      })
    .on('mouseover', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.85')})
     .on('mouseout', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1')})
    .on("click",clicked)
    .attr("d", path)
  
  // here we can add .on("mouseover", function_hover)
                //   .on("mouseout", function_done)
    
  countriessvg.append("title")
      .text(d => {
          const continentName = countryToContinent.get(d.properties.name);
          const val = valuemap.get(continentName);
          // If val is a number, round to 2 decimals and add %; otherwise show "No data"
          const formatted = (typeof val === "number") 
            ? `${val.toFixed(2)}%` 
            : "No data";
          
          return `Continent: ${continentName}\nAvg: ${formatted}\n(Country: ${d.properties.name})`; 
       });

  // Add a white border.
  g.append("path")
    .datum(countrymesh)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("d", path);


  svg.call(zoom);

  function reset() {
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width/2,height/2])
    );
  }

  function color_continent(){
    countriessvg.attr("fill", d => {
        const countryName = d.properties.name;
        const continent = countryToContinent.get(countryName);
        const val = valuemap.get(continent);
        return val !== undefined ? color(val) : "#ccc";
      });
    countriessvg.select("title")
    .text(d => {
          const continentName = countryToContinent.get(d.properties.name);
          const val = valuemap.get(continentName);
          // If val is a number, round to 2 decimals and add %; otherwise show "No data"
          const formatted = (typeof val === "number") 
            ? `${val.toFixed(2)}%` 
            : "No data";
          
          return `Continent: ${continentName}\nAvg: ${formatted}\n(Country: ${d.properties.name})`; 
       });
  }
  
  function color_country() {
    countriessvg.attr("fill", d => {
        const countryName = d.properties.name;
        const val = valuemap.get(countryName);
        return val !== undefined ? color(val) : "#ccc";
      });
    countriessvg.select("title")
      .text(d => {
          const countryName = d.properties.name;
          const val = valuemap.get(countryName);
          // If val is a number, round to 2 decimals and add %; otherwise show "No data"
          const formatted = (typeof val === "number") 
            ? `${val.toFixed(2)}%` 
            : "No data";
          
          return `Country: ${countryName}\n ${formatted}`; 
       });
  }

  function clicked(event, d) {
    const countryName = d.properties.name
    const continentName = countryToContinent.get(countryName)
    const [[x0, y0], [x1, y1]] = continentBounds.get(continentName); 
    event.stopPropagation();
    svg.transition().duration(750).call( //smooth animation
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))) //state is roughly 90% of the screen
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
  }

  function zoomed(event) {
    const {transform} = event;
    g.attr("transform",transform);
    g.attr("stroke-width",1/transform.k);
  }


  // Create a container div to hold buttons and the SVG
  const container = d3.create("div");

  // Create a toolbar div
  const toolbar = container.append("div")
      .style("margin-bottom", "10px");

  // Add the Continent Button
  toolbar.append("button")
      .text("Color by Continent")
      .style("margin-right", "5px")
      .on("click", color_continent);

  // Add the Country Button
  toolbar.append("button")
      .text("Color by Country")
      .on("click", color_country);

  // Append the SVG to the container
  container.append(() => svg.node());

  return container.node();
};
display(chart_zoom(countries, countrymesh, valuemap, approach_description,countryToContinent, continentBounds));
```
