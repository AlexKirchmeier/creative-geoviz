const defaultLimit = 20;

// setup controls
const satInput = document.querySelector('#sat');
const lumInput = document.querySelector('#lum');
const limitSelect = document.querySelector('#limit');
const shuffleSelect = document.querySelector('#shuffle');
const options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
options.forEach((val, i) => limitSelect.options[i] = new Option(val));
limitSelect.selectedIndex = defaultLimit - 1;

limitSelect.addEventListener('change', render);
shuffleSelect.addEventListener('change', render)

render();

function render() {
  let idx = 0;
  const limit = limitSelect.selectedIndex + 1;
  const doShuffle = shuffleSelect.selectedIndex === 0;
  document.querySelector('#chart').innerHTML = '';
  
var json = {
  'children': [
    {name: 'Utrecht', value: 20, info: 'wonderful city where lifelong memories were made'},
    {name: 'UFO', value: 19, info: 'de inktpot'},
    {name: 'Sunset', value: 18, info: 'splendid evening destination'},
    {name: 'Memories', value: 17, info: 'my favorite space in an unforgettable summer of travel'},
    {name: 'Exploration', value: 16, info: 'stumbling upon this bridge was a beautiful moment'},
    {name: 'Views', value: 15, info: 'the urban views here are spectacular'},
    {name: 'Reflections', value: 14, info: 'feels as if this location encapsulates the essence of my travels'},
    {name: 'Beautiful Day', value: 13, info: 'beautiful summer days here in Utrecht'},
    {name: 'Travel', value: 12, info: 'this is right above a major transit center, after all'},
    {name: 'Friends', value: 11, info: 'cozy reminder of great times'},
    {name: 'Summer', value: 10, info: 'the bright skies say it all'},
    {name: 'Art', value: 9, info: 'ufos and teapots, living their best lives'},
    {name: 'Urban Design', value: 8, info: 'quite a bit to learn from this incredible spot'},
    {name: 'De diepte', value: 7, info: 'oehoe aha'},
    {name: 'Movies', value: 6, info: 'theater not far from here, watched horror film in english/danish/dutch with dutch subtitles'},
    {name: 'Mobility', value: 5, info: 'sustainable urban mobility, the namesake of the program'},
    {name: 'Relax', value: 4, info: 'always a satisfying memory to return to'},
    {name: 'Utrecht Centraal', value: 3, info: 'great station, but amsterdam centraal has vegan burgers'},
    {name: 'Hoog Catharijne', value: 2, info: 'so close to the big screen with the dancing bear'},
    {name: 'Moreelsebrug', value: 1, info: 'the bridge does indeed have a name'}
  ].slice(0, limit)
}
if (doShuffle) {
  json.children = _.shuffle(json.children);  
}
const values = json.children.map(d => d.value);
const min = Math.min.apply(null, values);
const max = Math.max.apply(null, values);
const total = json.children.length; 
  
var diameter = 600,
    color = d3.scaleOrdinal(d3.schemeCategory20c);

var bubble = d3.pack()
  .size([diameter, diameter])
  .padding(0); // changes spacing of the bubbles

var tip = d3.tip()
  .attr('class', 'd3-tip-outer')
  .offset([-38, 0])
  .html((d, i) => {
    const item = json.children[i];
    const color = getColor(item.value);
    return `<div class="d3-tip" style="background-color: ${color}">${item.info}</div><div class="d3-stem" style="border-color: ${color} transparent transparent transparent"></div>`;
  });
  
var margin = {
  left: 25,
  right: 25,
  top: 25,
  bottom: 25
}

var svg = d3.select('#chart').append('svg')
  .attr('viewBox','0 0 ' + (diameter + margin.right) + ' ' + diameter)
  .attr('width', (diameter + margin.right))
  .attr('height', diameter)
  .attr('class', 'chart-svg');

var root = d3.hierarchy(json)
  .sum(function(d) { return d.value; });
  // .sort(function(a, b) { return b.value - a.value; });

bubble(root);

var node = svg.selectAll('.node')
  .data(root.children)
  .enter()
  .append('g').attr('class', 'node')
  .attr('transform', function(d) { return 'translate(' + d.x + ' ' + d.y + ')'; })
  .append('g').attr('class', 'graph');

node.append("circle")
  .attr("r", function(d) { return d.r; })
  .style("fill", getItemColor)
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

node.call(tip);
  
node.append("text")
  .attr("dy", "0.2em")
  .style("text-anchor", "middle")
  .style('font-family', 'Roboto')
  .style('font-size', getFontSizeForItem)
  .text(getLabel)
  .style("fill", "#ffffff")
  .style('pointer-events', 'none');

node.append("text")
  .attr("dy", "1.3em")
  .style("text-anchor", "middle")
  .style('font-family', 'Roboto')
  .style('font-weight', '100')
  .style('font-size', getFontSizeForItem)
  //.text(getValueText)
  .style("fill", "#ffffff")
  .style('pointer-events', 'none');  
  
function getItemColor(item) {
  return getColor(item.value);
}

function getColor(value) {
  const colorList = ['white', '#DC7633'];
  const colorScale = chroma.scale(colorList).domain([0,max]);
  return colorScale(value).alpha(0.5);
}

// function getColor(idx, total) {
//   const start = 14;
//   const end = 210;
//   const interval = Math.min(18, (end - start) / total);
//   let hue = start - Math.round(interval * idx);
//   if (hue > 360) {
//     hue -= 360;
//   }
//   if (hue < 0) {
//     hue += 360;
//   }
//   return `hsl(${hue},${sat}%,${lum}%)`;
// }
  function getLabel(item) {
    // if (item.data.value < max / 3.3) {
    //   return '';
    // }
    return truncate(item.data.name);
  }

  // Adds number to chart
  // function getValueText(item) {
  //   // if (item.data.value < max / 3.3) {
  //   //   return '';
  //   // }
  //   if (noValues) {
  //     return '';
  //   } else {
  //     return item.data.value;
  //   }
  // }
  function truncate(label) {
    // const max = 11;
    // if (label.length > max) {
    //   label = label.slice(0, max) + '...';
    // }
    return label;
  }
  function getFontSizeForItem(item) {
    return getFontSize(item.data.value, min, max, total);
  }
  function getFontSize(value, min, max, total) {
    const minPx = 6;
    const maxPx = 25;
    const pxRange = maxPx - minPx;
    const dataRange = max - min;
    const ratio = pxRange / dataRange;
    const size = Math.min(maxPx, Math.round(value * ratio) + minPx);
    return `${size}px`;
  }
}