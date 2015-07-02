/* global $, _, crossfilter, d3  */
(function(nbviz,  _, $) {
    'use strict';

    // Category Selector
    var catSel = d3.select("#nobel-ui").append('div')
        .attr('id', 'cat-select')
        .html('Category ');

    var cats = nbviz.categories.slice();
    cats.unshift(nbviz.ALL_CATS);
    catSel.append('select')
        .on('change', function(d) {
            var val = d3.select(this).property('value');
            nbviz.filterByCategory(val);
            // nbviz.updateCountryData();
            nbviz.onDataChange();
        })
        .selectAll('option')
        .data(cats).enter()
        .append('option')
        .attr('value', function(d) { return d; })
        .html(function(d) { return d; });
    
    // Gender selector 
    var genderData = ['All', 'female', 'male'];
    var genSel = d3.select("#nobel-ui").append('div')
        .attr('id', 'gender-select')
        .html('Gender ');
    
    genSel.append('select')
        .on('change', function(d) {
            var val = d3.select(this).property('value');
            // nbviz.filterByCategory(val);
            if(val === 'All'){
                // reset filter 
                nbviz.gender_dim.filter();
            }
            else{
                nbviz.gender_dim.filter(val);
            }
            nbviz.onDataChange();
        })
        .selectAll('option')
        .data(genderData).enter()
        .append('option')
        .attr('value', function(d) { return d; })
        .html(function(d) { return d; });
    
    // country selector
    nbviz.initUI = function() {
        var ALL_WINNERS = 'All Winners';
        var SINGLE_WINNERS = 'Single Winners';
        var DOUBLE_WINNERS = 'Double Winners';
        
        
        var nats = nbviz.countrySelectGroups = nbviz.nat_dim.group().all()
            .sort(function(a, b) {
                return b.value - a.value; // descending
            });
        
        // nats = d3.nest().key(function(d) {
        //     return d.value;
        // }).entries(nats);
        var fewWinners = {1:[], 2:[]};
        var fewWinnersThreshold = 2;
        var selectData = [ALL_WINNERS];

        nats.forEach(function(o) {
            if(o.value > fewWinnersThreshold){
                selectData.push(o.key);
            }
            else{
                fewWinners[o.value].push(o.key);
            }
        });

        selectData.push(
            DOUBLE_WINNERS,
            SINGLE_WINNERS
        );

        var natSel = d3.select("#nobel-ui").append('div')
            .attr('id', 'nat-select')
            .html('Country ');

        // var cats = nbviz.categories.slice();
        nats.unshift({key:nbviz.ALL_NATS, value:-1});
        natSel.append('select')
            .on('change', function(d) {
                var countries;
                var val = d3.select(this).property('value');
                if(val === ALL_WINNERS){
                    countries = [];
                }
                else if(val === DOUBLE_WINNERS){
                    countries = fewWinners[2];
                }
                else if(val === SINGLE_WINNERS){
                    countries = fewWinners[1];
                }
                else{
                    countries = [val];
                }
                nbviz.filterByCountries(countries);
                // nbviz.filterByCategory(val);
                // nbviz.updateCountryData();
            })
            .selectAll('option')
            .data(selectData).enter()
            .append('option')
            .attr('value', function(d) { return d; })
            .html(function(d){
                return d;
            });
        
        // Metric selector
        var metricRadio = d3.select("#nobel-ui").append('div')
            .attr('id', 'metric-radio')
            .html('Number of Winners: ');

        var dfault = (nbviz.valuePerCapita)?1:0;

        var form = metricRadio.append('form');
        
        var labels = form.selectAll("label")
            .data(['absolute', 'per-capita'])
            .enter()
            .append("label")
            .text(function(d) {return d;})
            .insert("input")
            .attr({
                type: "radio",
                class: "shape",
                name: "mode",
                value: function(d, i) {return i;}
            })
            .property("checked", function(d, i) {return i === dfault;})
            .on('change', function() {
                var val = d3.select(this).property('value');
                nbviz.valuePerCapita = parseInt(val)?true:false;
                // nbviz.updateCountryData();
                nbviz.onDataChange();
            });
        
        
    };
    
    
}(window.nbviz = window.nbviz || {}, _, $));
