---
title: Comparison
toc: false
---
<div class="comp">
<h1>Comparison</h1>
<p>On this page we'll look deeper into the connection between the different ways in which people deal with anxiety/depression. Firstly, we give a dynamic plot, so you can explore these possible relations. After we highlight three specific connections.
</p>
</div>

<div class="plots">
  <p> In the following dynamic bar chart, we compare the possible approaches against each other.
By choosing two solutions in the menu bar, the mean number of people per continent who dealt with anxiety and/or depression
by using that approach are portrayed. By looking at different combinations, you can discover relations between the different approaches.</p>
  
```js
const questions= ['Engaged in religious/spiritual activities','Took prescribed medication','Improved healthy lifestyle behaviors','Made a change to work situation','Made a change to personal relationships','Talked to friends or family','Spent time in nature/the outdoors','Talked to mental health professional']
```
```js
const colors= ['blue','pink','yellow']
```
```js
// Define the input
const selection = view(Inputs.form({
  q1: Inputs.select(questions, {label: "Solution 1", value: questions[0]}),
  q2: Inputs.select(questions, {label: "Solution 2", value: questions[1]})
}));
```
```js
function Plot(data,selection,{width}={}){
return vl.markBar().data(data)
  .transform(
    vl.filter('datum.Continent != "All"'),
    // Reference the selection from the other cell here
    vl.calculate(`datum['${selection.q1}']`).as('dynamicQ1'),
    vl.calculate(`datum['${selection.q2}']`).as('dynamicQ2'),
    vl.fold(['dynamicQ1', 'dynamicQ2']).as('Category', 'Percentage')
  )
  .encode(
    vl.y().fieldN('Continent').title(null),
    vl.x().average('Percentage').title('Mean Percentage'),
    vl.yOffset().fieldN('Category'),
    vl.color().fieldN('Category').title('')
    .legend({
      labelExpr: `datum.label == 'dynamicQ1' ? '${selection.q1}' : '${selection.q2}'`,
      labelFontSize:'11',
      labelLimit:'250'
    })
  ).render()
}
display(await Plot(countries,selection,{width}))
```
<div class="plot-row">

<div class="comp-text">
<p> 
Below, some interesting relations between two approaches are displayed using scatterplots.
When you click on a dot, all points from that same continent will light up, so you can easily compare within the continents. 
</p>
<p> </p>
<p>The first plot shows the mean number of people who engaged in spiritiual/religious activities
versus the mean number of people who took prescribed medication. This plot clearly shows that taking prescribed medication
is a more common practice than engaging in religious activities in Europe and in Oceania. In Africa however, it's the opposite.
In Asia and North-and South-America there does not seem to be a real relation.</p>
</div>

<div class="plot-col">

```js
const countries = FileAttachment("./data/Countries_Comparison@1.csv").csv();
```

```js
function staticPlot1(data,{width}={}){
  const hover=vl.selectPoint().on('mouseover').toggle('false').nearest('false');
  const hoverOrClick=vl.or(hover.empty(false));
  const selectPunt=vl.selectPoint().fields('Continent');
  const values= [{"x":0, "y":0}, {"x":20, "y":20},{"x":40, "y":40},{"x":60, "y":60}, {"x":80, "y":80}, {"x":100, "y":100}];
  
  const line= vl.markLine({stroke:'grey',strokeDash:[4,4],strokeWidth:1.5}).data(values).encode(
  vl.x().fieldQ("x"),
  vl.y().fieldQ("y"),
);

  const plot= vl.markCircle()
  .data(countries) 
  .transform(
    vl.filter('datum.Continent != "All"')
  )
.encode(
  vl.x().fieldQ('Engaged in religious/spiritual activities').title('Mean percentage of people who engaged in religious/spiritual activities'),
  vl.y().fieldQ('Took prescribed medication').title('Mean percentage of people who took prescribed medication'),
  vl.color().fieldN('Continent').title('World region according to OWID'),
   vl.opacity().if(selectPunt, vl.value(0.9)).value(0.2),
);

  const base = plot.transform(vl.filter(vl.or('datum.Entity=="Belgium"', hoverOrClick)));
  const halo={size:100,stoke:'firebrick', strokewidth:2};
  const label={dx:4,dy:-8,align:'right'};
  const white={stroke:'white',strokeWidth:2};
  
   return vl.layer(
    plot.params(hover,selectPunt),
    base.markPoint(halo),
    base.markText(label, white)
    .encode(vl.text().fieldN('Entity')),
    base.markText(label).encode(vl.text().fieldN('Entity'))
    ,line).width(400)
  .height(300).render()
};
display(await staticPlot1(countries,{width}))

```
</div>
</div >

<div class="plot-row">
<div class="plot-col">

 
```js
function staticPlot2(data,{width}={}){
  const hover=vl.selectPoint().on('mouseover').toggle('false').nearest('false');
  const hoverOrClick=vl.or(hover.empty(false));
  const selectPunt=vl.selectPoint().fields('Continent');
 const values= [{"x":0, "y":0}, {"x":20, "y":20},{"x":40, "y":40},{"x":60, "y":60}, {"x":80, "y":80}, {"x":100, "y":100}];
 
  const line= vl.markLine({stroke:'grey',strokeDash:[4,4],strokeWidth:1.5}).data(values).encode(
  vl.x().fieldQ("x"),
  vl.y().fieldQ("y")

);

  const plot= vl.markCircle()
  .data(countries) 
  .transform(
    vl.filter('datum.Continent != "All"')
  )
.encode(
  vl.x().fieldQ('Engaged in religious/spiritual activities').title('Mean percentage of people who engaged in religious/spiritual activities'),
  vl.y().fieldQ('Talked to mental health professional').title('Mean percentage of people who talked to mental health professional'),
  vl.color().fieldN('Continent').title('World region according to OWID'),
  vl.opacity().if(selectPunt, vl.value(0.9)).value(0.2),
);
  const base = plot.transform(vl.filter(vl.or('datum.Entity=="Belgium"', hoverOrClick)));
  const halo={size:100,stoke:'firebrick', strokeWidth:2};
  const label={dx:4,dy:-8,align:'right'};
  const white={stroke:'white',strokeWidth:2};
  
 return vl.layer(
    plot.params(hover,selectPunt),
    base.markPoint(halo),
    base.markText(label, white)
    .encode(vl.text().fieldN('Entity')),
    base.markText(label).encode(vl.text().fieldN('Entity'))
    ,line).width(400)
  .height(300).render()
}
display(await staticPlot2(countries,{width}))
```

</div>
 <div class="comp-text">
The second plot displays the mean number of people who engaged in spiritiual/religious activities
versus the mean number of people who talked to a mental health professional. 
Once again the countries in Africa clearly lie below the diagonal. Europe is now a bit more scattered. 
When looking at the European countries in some more detail, we see that the 'Western' countries mostly lie in the upper left corner. Ireland however, is a real 'outlier'. 
 </div>
 </div>

<div class="plot-row">
<div class="comp-text">
<p>Since previous plots showed quite similar results, we also plotted the mean number of people who took prescribed medication
versus the mean number of people who talked to a mental health professional.
Here, most points lie around the diagonal, which we expected as taking medication implies you at least talked to a doctor.</p>
</div>

<div class="plot-col">

```js
function staticPlot3(data,{width}={}){
  const hover=vl.selectPoint().on('mouseover').toggle('false').nearest('false');
  const hoverOrClick=vl.or(hover.empty(false));
  const selectPunt=vl.selectPoint().fields('Continent');
   const values= [{"x":0, "y":0}, {"x":20, "y":20},{"x":40, "y":40},{"x":60, "y":60}, {"x":80, "y":80}, {"x":100, "y":100}];
  
  const line= vl.markLine({stroke:'grey',strokeDash:[4,4],strokeWidth:1.5}).data(values).encode(
  vl.x().fieldQ("x"),
  vl.y().fieldQ("y"),

);

  const plot= vl.markCircle()
  .data(countries) 
  .transform(
    vl.filter('datum.Continent != "All"')
  )
.encode(
  vl.x().fieldQ('Talked to mental health professional').title('Mean percentage of people who talked to mental health professional'),
  vl.y().fieldQ('Took prescribed medication').title('Mean percentage of people who took prescribed medication'),
  vl.color().fieldN('Continent').title('World region according to OWID'),
   vl.opacity().if(selectPunt, vl.value(0.9)).value(0.2),
);

  const base = plot.transform(vl.filter(vl.or('datum.Entity=="Belgium"', hoverOrClick)));
  const halo={size:100,stoke:'firebrick', strokewidth:2};
  const label={dx:4,dy:-8,align:'right'};
  const white={stroke:'white',strokeWidth:2};
  
  return vl.layer(
    plot.params(hover,selectPunt),
    base.markPoint(halo),
    base.markText(label, white)
    .encode(vl.text().fieldN('Entity')),
    base.markText(label).encode(vl.text().fieldN('Entity'))
    ,line).width(400)
  .height(300).render()
}
display(await staticPlot3(countries,{width}))
```
</div>
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
  text-align: center;
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


