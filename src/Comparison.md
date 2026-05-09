---
title: Comparison
toc: false
---
On this page we'll look deeper into the connection between the different ways in which people deal with anxiety/depression. Firstly we give a dynamic plot so you can explore these possible relations. After we highlight 3 specific connections.

In the following dynamic bar chart we compare the possible solutions against each other.
By choosing 2 solutions in the menu bar, the mean number of people per continent who dealth with anxiety and/or depression
and used that solution are portrayed. By looking at different combinantions you can discover relations.


```js
const questions= ['Engaged in religious/spiritual activities','Took prescribed medication','Improved healthy lifestyle behaviors','Made a change to work situation','Made a change to personal relationships','Talked to friends or family','Spent time in nature/the outdoors','Talked to mental health professional']
```
```js
const colors= ['blue','pink','yellow']
```
```js
viewof selection = {
  const form = Inputs.form({
    q1: Inputs.select(questions, {label: "Solution 1", value: questions[0]}),
    q2: Inputs.select(questions, {label: "Solution 2", value: questions[1]})
  });
  return form;
}
```
```js
fuction Plot(data,{width}={}){
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
    vl.color().fieldN('Category').scale({ range:["orange", "purple"] }).title('World region')
    .legend({
      labelExpr: `datum.label == 'dynamicQ1' ? '${selection.q1}' : '${selection.q2}'`,
      labelFontSize:'11',
      labelLimit:'250'
    })
  ).render()
}
```
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => Plot(countries, {width}))}
  </div>
</div>

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
    vl.y().fieldN('Continent').title(null),
    vl.x().average('Percentage').title('Mean Percentage'),
    // 3. Use the new 'Category' field for grouping and color
    vl.yOffset().fieldN('Category'),
    vl.color().fieldN('Category').title('World region accrording to OWID')
    .legend({
      labelExpr: "datum.label == 'dynamicQ1' ? Question1 : Question2",
      labelFontSize:'11',
      labelLimit:'250'
    })
  )
  .render()
  //.scale({ range:["orange", "purple"] }).
 }
```
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => DynamicPlot(countries, {width}))}
  </div>
</div>

Below, some interesrting relations between 2 solutions are displayed using scatterplots.
When you click on a dot, all points from that continent will light up, so you can easily compare within the continents.

The first plot shows the mean number of people who engaged in spiritiual/religious activites
versus the mean number of people who took prescibed medication. This plot clearly shows that taking prescibed medication
is a more common practice than engaging in religious activities in Europe and in Oceania. In Africa however it's the opposite.
In Asia and North-and South-America there does not seem to be a real relation.

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

```
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
```
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
```
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => staticPlot1(countries, {width}))}
  </div>
</div>
The second plot displays the mean number of people who engaged in spiritiual/religious activities
versus the mean number of people who talked to a mental health professional. 
Once again the countries in Africa clearly lie below the diagonal. Europe is now a bit more scattered. 
When looking at the European countries in particular, we see that the 'Western' countries mostly lie in the upper left corner.
Ireland is a real 'outlier' however. 

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => staticPlot2(countries, {width}))}
  </div>
</div>

Since previous plots showed quite similar results, we also plotted the mean number of people who took prescribed medication
versus the mean number of people who talked to a mental health professional.
Here most points lie around the diagonal, which we expected as taking medication implies you talked to a doctor.
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => staticPlot3(countries, {width}))}
  </div>
</div>




