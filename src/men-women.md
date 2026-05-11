---
title: Social Factors
toc: false
---

<div class="comp">
<h1>Social Factors</h1>
<p>
Social connections play a crucial role in how people cope with anxiety and depression.  
In this section, we examine how men and women differ in their comfort levels when talking about mental health, and whether they know someone close to them who struggles with anxiety or depression. We also focus on the role of friends and family: how comfortable people feel discussing their mental health, and how often they actually rely on these social connections when dealing with anxiety or depression.
</p>
</div>

<div class="plots">
<div class = "plot-row">
  <div class="plot-col">

```js
const data = await FileAttachment("data/men-women-friends-TRANFS.csv").csv();

function overlappingBarChart(data, {width = 700, heightTop = 150, heightBottom = 300} = {}){
  const selectContinent = vl.selectPoint().fields('Entity');

   const maleBar = vl.markBar({ opacity: 0.8, size: 20 })
    .transform(
      vl.filter('datum.gender == "Male" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")' ), 
      vl.calculate('format(datum.Percentage, ".1f") + "%"').as("PercentageLabel")
    )
    .encode(
      vl.x().fieldQ("Percentage"),
      vl.y().fieldN("Entity").title(null),
      vl.color().fieldN("gender")
        .scale({ domain: ["Male", "Female"] }).title('Gender'),
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
        .scale({ domain: ["Male", "Female"] }),
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
</div>
<div class="comp-text">
This chart shows, for each continent, the mean percentage of men and women who report knowing friends or family members who struggle with anxiety or depression. In most continents, this percentage is higher for women, suggesting that women notice or report the presence of mental‑health issues within their social environment more often. In Africa and Asia, the difference between men and women is small, only about 1 to 1.5 percent.
  </div>
</div>


<div class="plot-row">
<div class="comp-text">
The following chart displays the difference between how comfortable people are with talking about anxiety/depression and what percentage of people actually talked about it when they were anxious/depressed. Here, the means are showed per continent. As shown by the plot, on average the number of people who talk about it lies significantly higher than the number of people who are comfortable talking about it. 
</div>

<div class="plot-col">

```js
const data = await FileAttachment("data/comfort_talked_about.csv").csv();
// BASIS: dezelfde filtering + continentselectie

function connectedPlot(data, {width = 700, heightTop = 150, heightBottom = 300 } = {}) {
  const base = {
    data: data,
    transform: [
      vl.filter(
        'datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania"'
      )
    ]
  };

  //PLOT1
  const comfortableTransform = [
    ...base.transform,
      vl.calculate('+(datum["Very comfortable"]) + +(datum["Somewhat comfortable"])').as('Comfortable')
  ];

  const lineComfortable = vl
    .markRule({ strokeWidth: 2, color: "grey" })
    .data(base.data)
    .transform(...comfortableTransform)
    .encode(
      vl.y().fieldN("Entity").sort("-Comfortable").title(""),
      vl.x().fieldQ("Comfortable").title('Mean percentage'),
      vl.x2().fieldQ("Talked to friends or family")
    );

  const comfortPoints = vl
    .markPoint({ filled: true, size: 80 })
    .data(base.data)
    .transform(...comfortableTransform,
       vl.calculate('"Comfortable"').as("Type") )
    .encode(
      vl.y().fieldN("Entity"),
      vl.x().fieldQ("Comfortable"),
      vl.color()
      .fieldN("Type")
     // .scale({ domain: ["Comfortable", "Talked"], range:      ["orange", "purple"] })
      .legend({ title: "Indicator" }),
      vl.tooltip().fieldQ("Comfortable"),  
      vl.order("descending").fieldQ("Comfortable")
    );

  const talkedPoints1 = vl
    .markPoint({ filled: true, size: 80 })
    .data(base.data)
    .transform(...comfortableTransform,
                 vl.calculate('"Talked"').as("Type"))
    .encode(
      vl.y().fieldN("Entity").sort("-Comfortable"),
      vl.x().fieldQ("Talked to friends or family"),
      vl.color()
      .fieldN("Type")
     // .scale({ domain: ["Comfortable", "Talked"], range: ["orange", "purple"] })
      .legend({ title: "Indicator" }),
      vl.tooltip().fieldQ("Talked to friends or family"),
    );

  return vl
    .layer(lineComfortable, comfortPoints, talkedPoints1)
    .width(250)
    .height(150)
    .title("Perceived comfort vs doing so").render();
}
display(await connectedPlot(data, {width: 700}));
```
</div>
</div>

<div class="plot-row">
<div class="plot-col">

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
const input = await FileAttachment("data/comfort_talked_about.csv").csv();
```
</div>
<div class="comp-text">
We look at this data a little more in detail in the following chart. It shows, for each country, the relationship between how comfortable people feel talking to someone when they are anxious or depressed (x‑axis) and how often they actually do so in practice (y‑axis). Many countries lie above the diagonal, indicating that people do initiate these conversations even though fewer report feeling comfortable discussing such issues. The interactive features make it possible to clearly compare individual countries and regions.
</div>
</div>

---
<style>
  html {
  scroll-behavior: smooth;
}

.comp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--sans-serif);
  margin: 0 auto;
  text-wrap: balance;
  text-align: center;
  max-width: 1000px;
  padding: 2rem 1rem;
}

.comp h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 2.4rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
 
.plots {
  margin-top: 0rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

  /* Each plot+text pair sits in a two-column row */
  .plot-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
    padding: 2rem 0;
    border-bottom: 1px solid #f3f4f6;
        border-radius: 12px;

  }

  .plot-row:last-child {
    border-bottom: none;
  }

    .plot-col {
      border-radius: 12px;
      border: 1.5px solid  #e5e7eb;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    width: fit-content;
  }

  .text-col {
    font-family: var(--sans-serif);
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--theme-foreground-muted, #374151);
    padding: 0 0.5rem;
  }
    /* Narrow screens: stack vertically */
  @media (max-width: 700px) {
    .plot-row {
      grid-template-columns: 1fr;
    }
  }
  </style>
