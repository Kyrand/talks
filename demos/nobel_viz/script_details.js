/* global $, _, crossfilter, d3  */
(function(nbviz,  _, $) {
    'use strict';

    var infoboxAttrs = ['category', 'year', 'nationality']; 
    
    nbviz.displayWinner = function(wData) {
        // we may be selecting from an empty list
        if(!wData){
            return;
        }
        var nw = d3.select('#nobel-winner');
        nw.style('border-color', nbviz.categoryFill(wData.category));
        
        nw.select('#title').html(wData.name);
        var attrs = nw.select('#infobox').selectAll('.attr')
            .data(infoboxAttrs);
        
        attrs.enter()
            .append('div').classed('attr', true);
        
        attrs.html(function(d) {
                return '<div class="label ' + d + '"/>' + d + ':</div>' + wData[d];
            });
        nw.select('#biobox').html(wData.mini_bio);
        if(wData.bio_image){
            nw.select('#picbox').html('<img src="static/images/winners/' + wData.bio_image + '"/>');
        }
        else{
            nw.select('#picbox img').remove();
        }

        nw.select('#readmore a').attr('href', wData.link);
    };
    
    nbviz.loadWinners = function(data) {
        var rows;
        var data = data.sort(function(a, b) {
            return +b.year - +a.year;
        });
        
        d3.selectAll('#nobel-list tbody tr')
            .remove('*');
            // .selectAll('tr')
            // .data(data, function(d) {
            //     return d.name;
            // });
        rows = d3.select('#nobel-list tbody')
            .selectAll('tr')
            .data(data);

        rows.enter().append('tr')
            .style('cursor', 'pointer')
            .on('click', function(d) {
                console.log('You clicked a row ' + JSON.stringify(d));
                nbviz.displayWinner(d);
            })
            .selectAll('td')
            .data(function(d) {
                return [d.year, d.category, d.name];  
            })
            .enter().append('td')
            .html(function(d) {
                return d;
            });

        // rows.exit().remove();

        // display random winner
        nbviz.displayWinner(data[Math.floor(Math.random() * data.length)]);
        
    };
}(window.nbviz = window.nbviz || {}, _, $));
