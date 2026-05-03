# Eigen Plots



BACK-TO-BACK BAR CHART
- labels in bar chart
```js
const data = await FileAttachment("data/men-women-friends-TRANFS.csv").csv();

function splitPlot(data, {width = 700, heightTop = 150, heightBottom = 300} = {}){
  const selectContinent = vl.selectPoint().fields('Entity');

const backToBack = vl.markBar()
  .data(data)
  .transform(
    // Filter op de continenten
    vl.filter(
      'datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania"'
    ),

    // Maak Male negatief zodat hij links komt
    vl.calculate('datum.gender == "Male" ? -datum.Percentage : datum.Percentage')
      .as('NegPercentage')
  )
  .params(selectContinent)
  .encode(
    vl.x()
      .fieldQ("NegPercentage")
      .title("Percentage")
      .axis({ // toon positieve labels
        format: "d",
        labelExpr: "abs(datum.value)"
      }),
    vl.y().fieldN("Entity"),
    vl.tooltip().fieldQ('Percentage'),
    vl.color().fieldN('gender').scale({domain: ['Male', 'Female'], range: ['orange', 'purple']}),
    vl.opacity().if(selectContinent, vl.value(0.9)).value(0.2),

  );

 const labelsMale = vl.markText({ align: "right", dx: -4 })
   .data(data)
  .transform(
    vl.filter('datum.gender == "Male" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")' ),
    vl.calculate('datum.gender == "Male" ? -datum.Percentage : datum.Percentage')
      .as('NegPercentage')
  )
  .encode(
    vl.x().fieldQ("NegPercentage"),
    vl.y().fieldN("Entity"),
    vl.text().fieldQ("Percentage").format(".1f"),
    vl.color().value("orange")
  );


  const labelsFemale = vl.markText({ align: "left", dx:4 })
    .data(data)
  .transform(
    vl.filter('datum.gender == "Female" && (datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania")' ),
    vl.calculate('datum.gender == "Male" ? -datum.Percentage : datum.Percentage')
      .as('NegPercentage')
  )
  .encode(
    vl.x().fieldQ("Percentage"),
    vl.y().fieldN("Entity"),
    vl.text().fieldQ("Percentage").format(".1f"),
    vl.color().value("purple")
  );

return vl.layer(backToBack,  labelsMale, labelsFemale).width(400).height(230).render();
}

display(await splitPlot(data, {width: 700}));

```
SLOPE PLOT function, die dezelfde data weergeeft als de back-to-back bar chart alleen hopelijk meer gefocust op het verschil in gender
```js
const data = await FileAttachment("data/men-women-friends-TRANFS.csv").csv();

function slopePlot(data, {width = 700, heightTop = 150, heightBottom = 300} = {}){
  const selectedContinent = vl.selectPoint()
  .fields("Continent");

//continenten berekenen
const continentenCalc = vl.calculate(
  'datum["World region according to OWID"] == "NA" ? datum.Entity : datum["World region according to OWID"]'
).as("Continent");

//CONTINENTEN GRAPH
const continentenSlope = vl.markLine({ strokeWidth: 4 })
    .params(selectedContinent)
    .transform(
      vl.filter('datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania"'),
      vl.calculate('datum.gender == "Male" ? 0 : 1').as("GenderX"), continentenCalc)
    .encode(
      vl.x().fieldQ("GenderX")
      .scale({domain:[0, 1]}).title("Gender"),
      vl.y().fieldQ("Percentage")
          .title("Percentage")
          .axis({titleX: -35}),
      vl.color().fieldN("Continent")
        .legend({orient: 'left'}),
      vl.opacity().if(selectedContinent,  vl.value(0.9)).value(0.2)
    );

const labelsMale = vl.markText({ align: "right", dx: -5 })
    .transform(
      vl.filter(
        '(datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania") && datum.gender == "Male"'
      ),
      vl.calculate('0').as("GenderX"), continentenCalc
      )
  .encode(
    vl.x().fieldQ("GenderX"),
    vl.y().fieldQ("Percentage"),
    vl.text().fieldQ("Percentage").format(".1f"),
    vl.color().fieldN("Continent").legend(null)
  );

const labelsFemale = vl.markText({ align: "left", dx: 5 })
    .transform(
      vl.filter(
        '(datum.Entity == "Africa" || datum.Entity == "Europe" || datum.Entity == "Asia" || datum.Entity == "North America" || datum.Entity == "South America" || datum.Entity == "Oceania") && datum.gender == "Female"'
      ),
      vl.calculate('1').as("GenderX"), continentenCalc)
  .encode(
    vl.x().fieldQ("GenderX"),
    vl.y().fieldQ("Percentage"),
    vl.text().fieldQ("Percentage").format(".1f"),
    vl.color().fieldN("Continent").legend(null)
  );

// LANDEN GRAPH
const countriesSlope = vl.markLine({strokewidth : 1})
    .params(selectedContinent)
    .transform(
      vl.filter('datum["World region according to OWID"] != "NA"'), // alleen landen
      vl.calculate('datum.gender == "Male" ? 0 : 1').as('GenderX'), continentenCalc
    )
    .encode(
      vl.x().fieldQ("GenderX").scale({ domain: [0, 1] }).title("Gender"),
      vl.y().fieldQ("Percentage")
        .title("Percentage")
      // 'Percentage' titel meer doen verschuiven, x positie maar naar links
        .axis({titleX: -35}),
      // kleur op basis van verschil
      vl.color().fieldN("Continent") .legend(null),
      vl.detail().fieldN("Entity"),
      vl.opacity().if(selectedContinent, vl.value(0.9)).value(0.05)
    );

const continentenChart = vl.layer(continentenSlope, labelsFemale, labelsMale)
  .data(data)
  .width(250)
  .height(150);

const countriesChart = countriesSlope
  .data(data)
  .width(450)
  .height(300)
   
return vl.vconcat(continentenChart, countriesChart).render();
}
display(await slopePlot(data, {width: 700}));


```
SCATTERPLOT die weergeeft per land hoe comfortabel mensen zich voelen om erover te praten ten opzichte van hoeveel procent werkelijk familie of vrienden kent met angsstoornis(sen) of depressie

```js
const data = await FileAttachment("data/perceived-comfort-speaking-anxiety-depression-vs-talked-to-family-friends-when-had-anxiety-depression.csv").csv();
   
function scatterPlot(data, {width = 700, heightTop = 150, heightBottom = 300} = {}) {
  const selectPunt = vl.selectPoint()
  .fields("World region according to OWID");
 
const hover = vl.selectPoint()
  .on('mouseover')
  .toggle(false)
  .nearest(false);
const click = vl.selectPoint();

const hoverOrClick = vl.or(hover.empty(false));
 
const scatterPlot = vl.markCircle({filled : true})
  .data(data)
  .transform(
    vl.filter('datum.Entity != "Africa" && datum.Entity != "Europe" && datum.Entity != "Asia" && datum.Entity != "North America" && datum.Entity != "South America" && datum.Entity != "Oceania" && datum.Entity != "World" && datum.Entity !=  "High-income countries" && datum.Entity != "Low-income countries" && datum.Entity !=  "Lower-middle-income countries" && datum.Entity != "Upper-middle-income countries"')
  )
  .encode(
    vl.y().fieldQ("Share who spoke to friends or family")
    .title('Share who spoke to friends or family'),
    vl.x().fieldQ("Share who said people would feel very comfortable speaking with someone they knew")
    .title('Share who said people would feel very comfortable speaking with someone they knew'),
    vl.color().fieldN("World region according to OWID"),
    vl.opacity().if(selectPunt, vl.value(0.9)).value(0.2),
    vl.tooltip(['Entity', 'Share who spoke to friends or family', 'Share who said people would feel very comfortable speaking with someone they knew']),
  );

  const dottedLine =   vl.markLine({stroke: "black", strokeDash: [4,4], strokeWidth: 2})
    .data([
      {"x": 0, "y": 0},
      {"x": 100, "y": 100}
    ])
    .encode(
      vl.x().fieldQ("x"),
      vl.y().fieldQ("y")
    );

  const base = scatterPlot.transform(
    vl.filter(hoverOrClick)
  );

    // mark properties for new layers
  const halo = {size: 100, stroke: 'firebrick', strokeWidth: 1};
  const label = {dx: 4, dy: -8, align: 'right'};
  const white = {stroke: 'white', strokeWidth: 2};

return vl.layer(
    scatterPlot.params(hover, click,selectPunt),
    base.markPoint(halo),
    base.markText(label, white)
    .encode(vl.text().fieldN('Entity')),
    base.markText(label).encode(vl.text().fieldN('Entity'))
    ,dottedLine)
  .width(400)
  .height(300)
  .render()
}
display(await scatterPlot(data, {width: 700}));
```
CONNECTED DOT PLOT die weergeeft hoe comfortable local people zich voelen om over angsstoornissen en depressie te praten t.o.v. hoeveel procent erover heeft gepraat wanneer ze zelf lijden aan een angsstoornis of depressie

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
    vl.calculate('datum["Very comfortable"] + datum["Somewhat comfortable"]').as("Comfortable")
  ];

  const lineComfortable = vl
    .markRule({ strokeWidth: 2, color: "grey" })
    .data(base.data)
    .transform(...comfortableTransform)
    .encode(
      vl.y().fieldN("Entity").sort("-Comfortable"),
      vl.x().fieldQ("Comfortable"),
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
      .scale({ domain: ["Comfortable", "Talked"], range:      ["orange", "purple"] })
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
      .scale({ domain: ["Comfortable", "Talked"], range: ["orange", "purple"] })
      .legend({ title: "Indicator" }),
      vl.tooltip().fieldQ("Talked to friends or family"),
    );

  const chartComfortable = vl
    .layer(lineComfortable, comfortPoints, talkedPoints1)
    .width(250)
    .height(150)
    .title("Comfortable");

// PLOT2
  const notComfortableTransform = [
    ...base.transform,
    vl.calculate('datum["Not at all comfortable"]').as("NotComfortable")
  ];

  const lineNotComfortable = vl
    .markRule({ strokeWidth: 2, color: "grey" })
    .data(base.data)
    .transform(...notComfortableTransform)
    .encode(
      vl.y().fieldN("Entity"),
      vl.x().fieldQ("NotComfortable"),
      vl.x2().fieldQ("Talked to friends or family")
    );

  const notComfortPoints = vl
    .markPoint({ filled: true, color: 'orange', size: 80 })
    .data(base.data)
    .transform(...notComfortableTransform)
    .encode(
      vl.y().fieldN("Entity"),
      vl.x().fieldQ("NotComfortable"),
      vl.tooltip().fieldQ("NotComfortable"),
      vl.order().fieldQ("NotComfortable")
    );

  const talkedPoints2 = vl
    .markPoint({ filled: true, color: 'purple', size: 80 })
    .data(base.data)
    .transform(...notComfortableTransform)
    .encode(
      vl.y().fieldN("Entity"),
      vl.x().fieldQ("Talked to friends or family"),
      vl.tooltip().fieldQ("Talked to friends or family"),
      vl.order().fieldQ("Talked to friends or family")
    );

  const chartNotComfortable = vl
    .layer(lineNotComfortable, notComfortPoints, talkedPoints2)
    .width(250)
    .height(150)
    .title("Not Comfortable");


// gecombineerd
  return vl
    .hconcat(chartComfortable, chartNotComfortable)
    .render();
}
display(await connectedPlot(data, {width: 700}));
```
