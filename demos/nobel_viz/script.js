/* global $, _, crossfilter, d3  */
(function(nbviz,  _, $) {
    'use strict';

    queue()
        .defer(d3.json, "data/world-110m.json")
        .defer(d3.csv, "data/world-country-names-nobel.csv")
        // .defer(d3.json, "data/nobel_winners_cleaned.json")
        .defer(d3.json, "data/nobel_winners_biopic.json")
        .defer(d3.json, "data/winning_country_data.json")
        .await(ready);

    function ready(error, world, names, winners, wcData) {
        // make filters
        nbviz.data.wcData = wcData;
        nbviz.filter = crossfilter(winners);
        nbviz.nat_dim = nbviz.filter.dimension(function(o){
            return o.nationality;
        });

        nbviz.cat_dim = nbviz.filter.dimension(function(o) {
            return o.category;
        });

        nbviz.gender_dim = nbviz.filter.dimension(function(o) {
            return o.gender;
        });
        
        
        nbviz.initUI();
        
        var data = nbviz.getCountryData();

        nbviz.drawMap(world, names, data);
        nbviz.drawBarChart(data);
        // nbviz.drawYearChart(nbviz.data.years);
        nbviz.filterByCountries([]);
    }
        
    
}(window.nbviz = window.nbviz || {}, _, $));
