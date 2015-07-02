/* global $, _, crossfilter, d3  */
(function(nbviz,  _, $) {
    'use strict';
    
    nbviz.data = {};
    nbviz.valuePerCapita = false;
    nbviz.ALL_CATS = 'All Categories';
    nbviz.ALL_NATS = 'All Nationalities';
    nbviz.activeCountry = null;
    nbviz.MAP_DURATION = 2000;
    nbviz.MAX_CENTROID_RADIUS = 30,
    nbviz.MIN_CENTROID_RADIUS = 2;
    nbviz.COLORS = {palegold:'#E6BE8A'};
    
    var cats = nbviz.categories = [
        "Physiology or Medicine", "Peace", "Physics", "Literature", "Chemistry", "Economics"]; 
    
    nbviz.categoryFill = function(category){
        var i = cats.indexOf(category);
        return d3.hcl(i / cats.length * 360, 60, 70);
    };

    var nestDataByYear = function(entries) {
        return nbviz.data.years = d3.nest()
            .key(function(w) {
                return w.year;
            })
            .entries(entries);
    };
    
    nbviz.filterByCountries = function(countryNames) {
        
        if(!countryNames.length){
            nbviz.nat_dim.filter();
        }
        else{
            nbviz.nat_dim.filter(function(d) {
                return countryNames.indexOf(d) > -1;
            });
        }
        
        if(countryNames.length === 1){
            nbviz.activeCountry = countryNames[0];
        }
        else{
            nbviz.activeCountry = null;
        }
        nbviz.onDataChange();
        // var data = nestDataByYear(nbviz.nat_dim.top(Infinity));

        // nbviz.drawYearChart(data);
    };

    nbviz.filterByCategory = function(cat) {
        if(cat === nbviz.ALL_CATS){
            nbviz.cat_dim.filter();
        }
        else{
            nbviz.cat_dim.filter(cat);
        }
        // var data = nestDataByYear(nbviz.cat_dim.top(Infinity));

        // nbviz.drawYearChart(data);
        nbviz.onDataChange();
    };

    nbviz.getCountryData = function() {
        var countryGroups = nbviz.nat_dim.group().all();

        // make main data-ball
        var data = nbviz.data.countries = countryGroups.map(function(c) {
            var cData = nbviz.data.wcData[c.key];
            var value = c.value;
            // if per-capita value then divide by pop. size
            if(nbviz.valuePerCapita === true){
                value /= cData.population;
            }
            return {
                key: c.key,
                value: value,
                code: cData.alpha3Code,
                population: cData.population
            };
        })
                .sort(function(a, b) {
                    return b.value - a.value; // descending
                });

        return data;
    };

    nbviz.onDataChange = function() {
        var data = nbviz.getCountryData();
        nbviz.drawBarChart(data);
        nbviz.updateMap(data);
        nbviz.loadWinners(nbviz.nat_dim.top(Infinity));
        var data = nestDataByYear(nbviz.nat_dim.top(Infinity));
        nbviz.drawYearChart(data);
    };
    
}(window.nbviz = window.nbviz || {}, _, $));
