// main javascript here:
/* global $, _, crossfilter, d3  */
(function(kcharts) {
    'use strict';
    var NUM_POINTS = 50;
    var MAX_THETA = 2*Math.PI;
    var DTHETA = MAX_THETA/NUM_POINTS;
    var WIDTH=parseInt(d3.select('#chart').style('width')),
    HEIGHT=parseInt(d3.select('#chart').style('height'));
    var i=0, data = [];
    
    for(i=0; i<NUM_POINTS; i++){
        var theta = i*DTHETA;
        data.push({theta:theta, c: Math.cos(theta), s:Math.sin(theta)});
    } 
    
    var yScale = d3.scale.linear()
        .domain([0, NUM_POINTS])
        .range([0, HEIGHT]);

    var yThetaScale = d3.scale.linear()
        .domain([1, -1])
        .range([0, HEIGHT]);
    
    var xThetaScale = d3.scale.linear()
        .domain([0, MAX_THETA])
        .range([0, WIDTH]);
    
    var dlines = d3.select('#chart').selectAll('data-line').data(data);
    
    dlines = dlines.enter().append('g')
        .classed('data-point', true);

    dlines.each(function(d, i) {
        var s, c, t;
        var g = d3.select(this);
        s = g.append('text').classed('s', true).text(d.s.toPrecision(3));
        c = g.append('text').classed('c', true).text(d.c.toPrecision(3));
        t = g.append('text').classed('t', true).text(d.theta.toPrecision(3));
    });
    
    kcharts.update = function(updateType) {
        dlines.each(function(d,i){
            var tr, tx, ty, cx, cy, sx, sy;
            var g = d3.select(this);
            switch(updateType){
            case 'ordered':
                tr = 0;
                tx = 0; ty = yScale(i);
                cx = 100; cy = yScale(i);
                sx = 200; sy = yScale(i);
                break;
            case 'orig':
                tr = 0;
                tx = Math.random()*WIDTH; ty = Math.random()*HEIGHT;
                cx = Math.random()*WIDTH; cy = Math.random()*HEIGHT;
                sx = Math.random()*WIDTH; sy = Math.random()*HEIGHT;
                break;
            case 'alt':
                tr = -45; tx = xThetaScale(d.theta); ty = HEIGHT+20;
                cx = xThetaScale(d.theta); cy = yThetaScale(d.c);
                sx = xThetaScale(d.theta); sy = yThetaScale(d.s);
                break;
            }
            g.select('.t')
                .transition().duration(3000)
                .attr('transform', 'translate(' + tx + ',' + ty + ') rotate(' + tr + ')'); 
            g.select('.c')
                .transition().duration(3000)
                .attr('transform', 'translate(' + cx + ',' + cy + ')'); 
            g.select('.s')
                .transition().duration(3000)
                .attr('transform', 'translate(' + sx + ',' + sy + ')'); 
        });
    };

    d3.select('#control-buttons').selectAll('buttons')
        .data(['ordered', 'orig', 'alt']).enter()
        .append('button').text(function(d) {
            return d;
        })
        .on('click', function(d) {
            kcharts.update(d);
        });
    
    kcharts.update('ordered');
    
}(window.kcharts = window.kcharts || {}));

