---
theme: dashboard
title: Comparison
toc: false
---
``` js
import {vl} from "@vega/vega-lite-api-v5";
```
# Dynamic Plot
Here is a dynamic bar chart, were you can plot any two solutions against each other.

```js
const questions= ['Engaged in religious/spiritual activities','Took prescribed medication','Improved healthy lifestyle behaviors','Made a change to work situation','Made a change to personal relationships','Talked to friends or family','Spent time in nature/the outdoors','Talked to mental health professional']
```
```js
const colors= ['blue','pink','yellow']
```
```js
function DynamicPlot(data,{width}={}){
return vl.markBar().data(data)
  .params(
    vl.param('Question1').value(questions[0]).bind(vl.menu(questions)),
    vl.param('Question2').value(questions[1]).bind(vl.menu(questions))
  )
  .transform(
    vl.filter('datum.Continent != "All"'),
    // 1. Create the dynamic field first
    vl.calculate('datum[Question1]').as('dynamicQ1'),
     vl.calculate('datum[Question2]').as('dynamicQ2'),
    // 2. "Fold" the two columns you want to compare into rows
    vl.fold(['dynamicQ1', 'dynamicQ2',])
      .as('Category', 'Percentage')
  )
  .encode(
    vl.x().fieldN('Continent'),
    vl.y().average('Percentage').title('Mean Percentage'),
    // 3. Use the new 'Category' field for grouping and color
    vl.xOffset().fieldN('Category'),
    vl.color().fieldN('Category')
    .legend({
      labelExpr: "datum.label == 'dynamicQ1' ? Question1 : Question2",
      labelFontSize:'11',
      labelLimit:'200'
    })
  )
  .render()
 }
```
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => DynamicPlot(countries, {width}))}
  </div>
</div>

# Static Plots
Here we show some interesting relations between 2 'solutions'. We see that in Europe the 'took prescribed medication' is
higher than de religious however in Africa it is the opposite. This is easily seen from the plots as the countries in Europe all lie above the diagonal, and the countries in Africa all lie below.
The same kind of relation exists between 'talked to a mental health professional' 
and 'engaged in religious activities'. For that reason we also plotted the relation between 'took prescribed medication' and 'talked to a mental health professional'.
It can be seen from the plot that there is a definite connection between the two. The relation is not exaclty lineair, but it is relatively close.

```js
const countries = FileAttachment("./data/Countries_Comparison@1.csv").csv();
```

```js
function staticPlot(data, {width} = {}) {
 return vl.markCircle()
  .data(data) 
  .transform(
    vl.filter('datum.Continent != "All"')
  )
.encode(
  vl.x().fieldQ('Engaged in religious/spiritual activities'),
  vl.y().fieldQ('Took prescribed medication'),
  vl.color().fieldN('Continent'),
  vl.tooltip(['Entity'])
).title('Static plot').render()
};
//display( await staticPlot(countries));
```

```js
function staticPlot1(data,{width}={}){
  const hover=vl.selectPoint().on('mouseover').toggle('false').nearest('false');
  const hoverOrClick=vl.or(hover.empty(false));
  const values= [{"x":0, "y":0}, {"x":20, "y":20},{"x":40, "y":40},{"x":60, "y":60}, {"x":80, "y":80}, {"x":100, "y":100}];
  const line= vl.markLine({stroke:'black',strokeDash:[4,4],strokeWidth:1.5}).data(values).encode(
  vl.x().fieldQ("x"),
  vl.y().fieldQ("y"),

);

  const plot= vl.markCircle()
  .data(data) 
  .transform(
    vl.filter('datum.Continent != "All"')
  )
.encode(
  vl.x().fieldQ('Engaged in religious/spiritual activities').title('Engaged in religious/spiritual activities'),
  vl.y().fieldQ('Took prescribed medication').title('Took prescribed medication'),
  vl.color().fieldN('Continent')
);

  const base = plot.transform(vl.filter(vl.or('datum.Entity=="Belgium"', hoverOrClick)));
  const halo={size:100,stoke:'firebrick', strokewidth:2};
  const label={dx:4,dy:-8,align:'right'};
  const white={stroke:'white',strokeWidth:2};
  
  return vl.layer(plot.params(hover),base.markPoint(halo), base.markText(label).encode(vl.text().fieldN('Entity')),line).render()
};
//display( await staticPlot1(countries));
```
```js
function staticPlot2(data,{width}={}){
  const hover=vl.selectPoint().on('mouseover').toggle('false').nearest('false');
  const hoverOrClick=vl.or(hover.empty(false));
  const values= [{"x":0, "y":0}, {"x":20, "y":20},{"x":40, "y":40},{"x":60, "y":60}, {"x":80, "y":80}, {"x":100, "y":100}];
  
  const line= vl.markLine({stroke:'black',strokeDash:[4,4],strokeWidth:1.5}).data(values).encode(
  vl.x().fieldQ("x"),
  vl.y().fieldQ("y"),

);

  const plot= vl.markCircle()
  .data(data) 
  .transform(
    vl.filter('datum.Continent != "All"')
  )
.encode(
  vl.x().fieldQ('Talked to mental health professional').title('Talked to mental health professional'),
  vl.y().fieldQ('Took prescribed medication').title('Took prescribed medication'),
  vl.color().fieldN('Continent'),
);

  const base = plot.transform(vl.filter(vl.or('datum.Entity=="Belgium"', hoverOrClick)));
  const halo={size:100,stoke:'firebrick', strokewidth:2};
  const label={dx:4,dy:-8,align:'right'};
  const white={stroke:'white',strokeWidth:2};
  
  return vl.layer(plot.params(hover),base.markPoint(halo), base.markText(label).encode(vl.text().fieldN('Entity')),line).render()
 }
```
```js
function staticPlot3(data,{width}={}){
  const hover=vl.selectPoint().on('mouseover').toggle('false').nearest('false');
  const hoverOrClick=vl.or(hover.empty(false));
  const values= [{"x":0, "y":0}, {"x":20, "y":20},{"x":40, "y":40},{"x":60, "y":60}, {"x":80, "y":80}, {"x":100, "y":100}];
  
  const line= vl.markLine({stroke:'black',strokeDash:[4,4],strokeWidth:1.5}).data(values).encode(
  vl.x().fieldQ("x"),
  vl.y().fieldQ("y"),

);

  const plot= vl.markCircle()
  .data(data) 
  .transform(
    vl.filter('datum.Continent != "All"')
  )
.encode(
  vl.x().fieldQ('Engaged in religious/spiritual activities').title('Engaged in religious/spiritual activities'),
   vl.y().fieldQ('Talked to mental health professional').title('Talked to mental health professional'),
  vl.color().fieldN('Continent'),
);

  const base = plot.transform(vl.filter(vl.or('datum.Entity=="Belgium"', hoverOrClick)));
  const halo={size:100,stoke:'firebrick', strokewidth:2};
  const label={dx:4,dy:-8,align:'right'};
  const white={stroke:'white',strokeWidth:2};
  
  return vl.layer(plot.params(hover),base.markPoint(halo), base.markText(label).encode(vl.text().fieldN('Entity')),line).render()
 }
```
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => staticPlot1(countries, {width}))}
  </div>
 <div class="card">
    ${resize((width) => staticPlot2(countries, {width}))}
  </div>
 <div class="card">
    ${resize((width) => staticPlot3(countries, {width}))}
  </div>
</div>
