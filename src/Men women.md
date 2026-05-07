# Social Factors

The chart shows, for each continent, the percentage of men and women who report knowing friends or family members who struggle with anxiety or depression. In most continents, the percentage is higher for women, suggesting that women more often notice or report the presence of mental‑health issues within their social environment. In Africa and Asia, the difference between men and women is small, only about 1% to 1.5%.

```js
const data = await FileAttachment("data/men-women-friends-TRANFS.csv").csv();

function overlappingBarChart(data, {width = 700, heightTop = 150, heightBottom = 300} = {}){
  const selectContinent = vl.selectPoint().fields('Entity');

   const maleBar = vl.markBar({ opacity: 0.7, size: 20 })
    .transform(
      vl.filter('datum.gender == "Male" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")' ), 
      vl.calculate('format(datum.Percentage, ".1f") + "%"').as("PercentageLabel")
    )
    .encode(
      vl.x().fieldQ("Percentage"),
      vl.y().fieldN("Entity").title(null),
      vl.color().fieldN("gender")
        .scale({ domain: ["Male", "Female"], range: ["orange", "purple"] }).title('Gender'),
      vl.tooltip([
        { field: "gender", type: "nominal", title: "Gender" },
        { field: "PercentageLabel", type: "nominal", title: "Percentage"}
      ])    );

 
  const femaleBar = vl.markBar({ opacity: 0.7 , size : 30})
    .transform(
      vl.filter('datum.gender == "Female" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")' ), 
      vl.calculate('format(datum.Percentage, ".1f") + "%"').as("PercentageLabel")
    )
    .encode(
      vl.x().fieldQ("Percentage").title("Share who know friends or family who have been anxious or depressed"),
      vl.y().fieldN("Entity"),
      vl.color().fieldN("gender")
        .scale({ domain: ["Male", "Female"], range: ["orange", "purple"] }),
      vl.tooltip([
        { field: "gender", type: "nominal", title: "Gender" },
        { field: "PercentageLabel", type: "nominal", title: "Percentage" }
      ]) 
    );


  return vl.layer(femaleBar, maleBar)
    .data(data)
    .width(400)
    .height(230)
    .render();
}
display(await overlappingBarChart(data, {width: 700}));


```
The chart shows, for each country, the relationship between how comfortable people feel talking to someone when they are anxious or depressed (x‑axis) and how often they actually do so in practice (y‑axis). Many countries lie above the diagonal, indicating that people do initiate these conversations even though fewer report feeling comfortable discussing such issues. The interactive features make it possible to clearly compare individual countries and regions.

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
