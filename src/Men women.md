# Social Factors


De grafiek toont voor elk continent het percentage mannen en vrouwen dat aangeeft vrienden of familie te kennen die kampen met angst of depressie. In de meeste continenten ligt het percentage voor vrouwen hoger, wat erop wijst dat vrouwen vaker opmerken of melden dat er mentale‑gezondheidsproblemen voorkomen in hun sociale omgeving. In Afrika en Azië is het verschil tussne mannen en vrouwen klein, slechts 1% - 1,5%.


```js
const data = await FileAttachment("data/men-women-friends-TRANFS.csv").csv();

function overlappingBarChart(data, {width = 700, heightTop = 150, heightBottom = 300} = {}){
  const selectContinent = vl.selectPoint().fields('Entity');

  const maleBar = vl.markBar({ opacity: 0.7, size: 20 })
    .transform(
      vl.filter('datum.gender == "Male" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")' )
    )
    .encode(
      vl.x().fieldQ("Percentage"),
      vl.y().fieldN("Entity").title(null),
      vl.color().fieldN("gender")
        .scale({ domain: ["Male", "Female"], range: ["orange", "purple"] }).title('Gender'),
      vl.tooltip(["gender", "Percentage"])
    );

  const femaleBar = vl.markBar({ opacity: 0.7 , size : 30})
    .transform(
      vl.filter('datum.gender == "Female" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")' )
    )
    .encode(
      vl.x().fieldQ("Percentage"),
      vl.y().fieldN("Entity"),
      vl.color().fieldN("gender")
        .scale({ domain: ["Male", "Female"], range: ["orange", "purple"] }),
      vl.tooltip(["gender", "Percentage"])
    );

    // Label in male bar
  const maleLabel = vl.markText({ align: "right", dx: -4, fill: "white", fontSize: 11 })
    .transform(
      vl.filter('datum.gender == "Male" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")')
    )
    .encode(
      vl.x().fieldQ("Percentage"),
      vl.y().fieldN("Entity"),
      vl.text().fieldQ("Percentage").format(".1f")
    );

  // Label in female bar
  const femaleLabel = vl.markText({ align: "left", dx: 4, fill: "white", fontSize: 11 })
    .transform(
      vl.filter('datum.gender == "Female" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")')
    )
    .encode(
      vl.x().fieldQ("Percentage"),
      vl.y().fieldN("Entity"),
      vl.text().fieldQ("Percentage").format(".1f")
    );

  return vl.layer(femaleBar, maleBar)//, femaleLabel, maleLabel)
    .data(data)
    .width(400)
    .height(230)
    .render();
}
display(await overlappingBarChart(data, {width: 700}));


```
De grafiek toont voor elk land de relatie tussen hoe comfortabel mensen zich voelen om met iemand te praten wanneer ze angstig of depressief zijn (x‑as) en hoe vaak ze dat in werkelijkheid doen (y‑as). Veel landen liggen boven de diagonaal, wat erop wijst dat mensen in de praktijk wel het gesprek aangaan, hoewel er minder aangeven zich comfortabel te voelen om erover te praten. De interactieve functies maken het mogelijk om individuele landen en regio’s duidelijk te vergelijken.

```js
const data = await FileAttachment("data/comfort_talked_about(3).csv").csv();
   
function scatterPlot(data, {width = 700, heightTop = 150, heightBottom = 300} = {}) 

{
  const selectPunt = vl.selectPoint()
  .fields("Continent");
 
const hover = vl.selectPoint()
  .on('mouseover')
  .toggle(false)
  .nearest(false);
const click = vl.selectPoint();

const hoverOrClick = vl.or(hover.empty(false));
 
const scatterPlot = vl.markCircle({filled : true})
  .data(data)
  .transform(
    vl.filter('datum.Entity != "Africa" && datum.Entity != "Europe" && datum.Entity != "Asia" && datum.Entity != "North America" && datum.Entity != "South America" && datum.Entity != "Oceania" && datum.Entity != "World" && datum.Entity !=  "High-income countries" && datum.Entity != "Low-income countries" && datum.Entity !=  "Lower-middle-income countries" && datum.Entity != "Upper-middle-income countries" && datum["Talked to friends or family"] != "" && datum["Very comfortable"] != ""'))
  .encode(
    vl.y().fieldQ("Talked to friends or family")
    .title('Mean percentage of people who spoke to friends or family'),
    vl.x().fieldQ("Comfortable")
    .title('Mean percentage of people who said they would feel comfortable speaking with someone they knew'),
    vl.color().fieldN("Continent"),
    vl.opacity().if(selectPunt, vl.value(0.9)).value(0.2),
   // vl.tooltip(['Entity', 'Share who spoke to friends or family', 'Share who said people would feel very comfortable speaking with someone they knew']),
  );

  const dottedLine =   vl.markLine({stroke: "grey", strokeDash: [4,4], strokeWidth: 2})
    .data([
      {"x": 0, "y": 0},
      {"x": 100, "y": 100}
    ])
    .encode(
      vl.x().fieldQ("x"),
      vl.y().fieldQ("y")
    );

const base = scatterPlot.transform(vl.filter(vl.or('datum.Entity=="Belgium"', hoverOrClick)));

    // mark properties for new layers
  const halo = {size: 100, stroke: 'firebrick', strokeWidth: 1};
  const label = {dx: 4, dy: -8, align: 'right'};
  const white = {stroke: 'white', strokeWidth: 2};

return vl.layer(
    scatterPlot.params(hover,click,selectPunt),dottedLine,
    base.markPoint(halo),
    base.markText(label, white)
    .encode(vl.text().fieldN('Entity')),
    base.markText(label).encode(vl.text().fieldN('Entity'))
)
  .width(400)
  .height(300)
  .render()
}
display(await scatterPlot(data, {width: 700}));
```

```js
