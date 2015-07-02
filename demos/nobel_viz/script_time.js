/* global $, _, crossfilter, d3  */
(function(nbviz,  _, $) {
    'use strict';
    
    var chartHolder = d3.select('#nobel-time');
    
    var margin = {top:20, right:20, bottom:30, left:40},
        width = parseInt(chartHolder.style('width')) - margin.left - margin.right,
        height = parseInt(chartHolder.style('height')) - margin.top - margin.bottom;

    // SCALES
    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

    var y = d3.scale.ordinal()
            .rangePoints([height, 0]);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(20);

    var svg = chartHolder.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x and y domains won't change
    x.domain(d3.range(1900, 2015));
    y.domain(d3.range(15));

    xAxis.tickValues(x.domain().filter(function(d,i) {return !(d%10);}));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"; 
        });

    // Labels
    var catLabels = chartHolder.select('svg').append('g')
            .attr('transform', "translate(10, 10)")
            .attr('class', 'labels')
            .selectAll('label').data(nbviz.categories)
            .enter().append('g')
            .attr('transform', function(d, i) {
                return "translate(0," + i * 10 + ")";
            });

    catLabels.append('circle')
        .attr('fill', (nbviz.categoryFill))
        .attr('r', x.rangeBand()/2);

    catLabels.append('text')
        .text(function(d) {
            return d;
        })
        .attr('dy', '0.4em')
        .attr('x', 10);
    
    nbviz.drawYearChart = function(data) {
        var years = svg.selectAll(".year")
                .data(data, function(d) {
                    return d.key;
                });

        years.enter().append('g')
            .classed('year', true)
            .attr('name', function(d) { return d.key;})
            .attr("transform", function(year) {
                return "translate(" + x(+year.key) + ",0)";
            });

        years.exit().remove();

        var winners = years.selectAll(".winner")
                .data(function(d) {
                    return d.values;
                }, function(d) {
                    return d.name;
                });

        winners.enter().append('circle')
            .classed('winner', true)
            .attr('cy', height)
            .attr('cx', -x.rangeBand()/2)
            .attr('r', x.rangeBand()/2);

        winners
            // .attr('fill', 'white')
            .attr('fill', function(d) {
                return nbviz.categoryFill(d.category);
            })
            .transition().duration(2000)
            .attr('cy', function(d, i) {
            return y(i);
            });

        winners.exit().remove();
        
        
    };
    
}(window.nbviz = window.nbviz || {}, _, $));
