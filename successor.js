var inpColor = '#ca0020',
    opColor = '#0571b0';
function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}
// Background setup
var background = function(w, h) {
        return d3.select('body')
            .append('svg')
            .attr('class', 'background')
            .attr('width', w)
            .attr('height', h)
    }
    // State Machine
var statemachine = function(bg, w, h, padding) {
        var inpStartY, opStartY;
        var g = bg
            .append('g')
            .attr('transform', 'translate(' + (w / 9 + 3*padding)   + ',' + (h/3 - 2*padding) + ')')
        var machine = g
            .append('rect')
            .attr('class', 'statemachine')
            .attr('width', w / 10)
            .attr('height', w / 10)
            .attr('x', -w / 20)
            .attr('y', padding);
        d3.xml('sofx.svg', function(e, docFragment) {
            // Based on https://bl.ocks.org/mbostock/1014829
            if (e) { console.log(e);
                return; }
            g.node().appendChild(docFragment.documentElement);
            g
            .select('#sofx')
            .attr('x', 0 - padding)
            .attr('y', padding + w/30)
        })
        g
            .append('line')
            .attr('class', 'stateconnectors')
            .attr('y1', padding + w / 20)
            .attr('y2', padding + w / 20)
            .attr('x1', -2 * w / 20)
            .attr('x2', -w / 20)
            .attr('stroke', inpColor);
        g
            .append('text')
            .attr('id', 'sminp')
            .attr('class', 'analytical inp life-overlay')
            .attr('y', padding + 0.9 * w / 20)
            .attr('x', -1.75 * w / 20)
            .text(inpVal)
            .call(d3.drag()
                .on("start", function(){
                    inpStartY = d3.event.y;
                })
                .on("drag", function(){
                    length = inpStartY - d3.event.y
                    animations(length);
                }));
        g
            .append('line')
            .attr('class', 'stateconnectors')
            .attr('y1', padding + w / 20)
            .attr('y2', padding + w / 20)
            .attr('x1', w / 20)
            .attr('x2', w / 10)
            .attr('stroke', opColor);
        g
            .append('text')
            .attr('id', 'smop')
            .attr('class', 'analytical op life-overlay')
            .attr('y', padding + 0.9 * w / 20)
            .attr('x', 1.5 * w / 20)
            .text(inpVal + 1)
            .call(d3.drag()
                .on("start", function(){
                    opStartY = d3.event.y;
                })
                .on("drag", function(){
                    length = opStartY - d3.event.y
                    animations(length);
                }));

    }
    // Draw analytical form
var analyticalform = function(bg, w, h) {
    var inpStartY, opStartY;
    var txt = bg
        .append('text')
        .attr('transform', 'translate(' + w/9 + ',' + (2*h/3 - 3*padding)   + ')')
        .attr('class', 'analytical')
        .attr('x', padding)
        .attr('y', inpVal)
        .attr('fill', '#111111');
    txt.append('tspan')
        .text('S(x) = x + 1')
    var opS = txt
        .append('tspan')
        .text(inpVal + 1)
        .attr('id', 'analyticalop')
        .attr('class', 'analytical op life-overlay')
        .attr('x', padding + 10)
        .attr('dy', h / 20)
    opS
        .call(d3.drag()
            .on("start", function(){
                 opStartY = d3.event.y;
            })
            .on("drag", function(){
                length = opStartY - d3.event.y
                animations(length);
               })
            );
    txt.append('tspan')
        .text(' = ')
    var inpS = txt.append('tspan')
        .attr('id', 'analyticalinp')
        .attr('class', 'analytical inp life-overlay')
        .text(inpVal)
    inpS
        .call(d3.drag()
            .on("start", function(){
                 inpStartY = d3.event.y;
            })
            .on("drag", function(){
                length = inpStartY - d3.event.y
                animations(length);
               })
            );
    txt.append('tspan')
        .text(' + 1');
}
// Draw Graphical form
var graphicalform = function(bg, w, h) {
    var numberLineX = d3
        .axisBottom()
        .scale(xGraphScale)
        .tickValues([axisMin, 25, 50, 75, axisMax]);
    var numberLineY = d3
        .axisLeft()
        .scale(yGraphScale)
        .tickValues([axisMin, 25, 50, 75, axisMax]);
    var chart =  bg
    	.append('g')
    	.attr('transform', 'translate(' + w/3 + ',' + (2*h/3) + ')');
    chart.append('g')
    	.attr('class', 'graphical inp')
      	.call(numberLineX);
    chart.append('g')
        .attr('class', 'graphical op')
        .call(numberLineY);
    chart
        .append('line')
        .attr('id', 'graphpath')
        .attr('x1', function(d) {return xGraphScale(startInput)})
        .attr('y1', function(d) {return yGraphScale(startInput+1)})
        .attr('x2', function(d) {return xGraphScale(inpVal)})
        .attr('y2', function(d) {return yGraphScale(inpVal + 1)});
}

// Animate
var animations = function(length) {
    inpVal = Math.min(Math.max(inpVal + Math.floor(length), startInput), maxInput);
    d3.select('#analyticalop')
    .text(inpVal + 1);
    d3.select('#analyticalinp')
    .text(inpVal);
    d3.select('#smop')
    .text(inpVal + 1);
    d3.select('#sminp')
    .text(inpVal);
    d3.select('#graphpath')
    .attr('x2', xGraphScale(inpVal))
    .attr('y2', yGraphScale(inpVal + 1));

}

var w = 900,
    h = 600; // 3:2 aspect ratio
var padding = 20;
var bg = background(w, h);
var startInput = 1
var maxInput = 90 // Must be less than axisMax
var axisMin = 1
var axisMax = 100
var inpVal = startInput;
var xGraphScale = d3
    .scalePoint()
    .domain(range(axisMin, axisMax))
    .range([0, 2*h/5]);
var yGraphScale = d3
    .scalePoint()
    .domain(range(axisMin, axisMax))
    .range([0, -2*h/5]);
statemachine(bg, w, h, padding);
graphicalform(bg, w, h);
analyticalform(bg, w, h);
