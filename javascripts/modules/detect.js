/*
    Module: detect/detect.js
    Description: Used to detect various characteristics of the current browsing environment.
                 layout mode, connection speed, battery level, etc...
*/
/*jshint strict: false */

define(function () {

    var BASE_WIDTH     = 400,
        MEDIAN_WIDTH   = 650,
        EXTENDED_WIDTH = 900;
    
    function getLayoutMode() {
        var width = window.innerWidth,
            mode = "base";

        if (width > BASE_WIDTH) {
            mode = "median";
        }
        if (width > MEDIAN_WIDTH) {
            mode = "extended";
        }

        return mode;
    }

    function getPixelRatio() {
        return window.devicePixelRatio;
    }

    function getPageSpeed() {

        //https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html#sec-window.performance-attribute

        var start_time,
            end_time,
            total_time;

        var perf = window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
        if (perf && perf.timing) {
            start_time =  perf.timing.requestStart || perf.timing.fetchStart || perf.timing.navigationStart;
            end_time = perf.timing.responseStart;

            if (start_time && end_time) {
                total_time = end_time - start_time;
            }
        }

        return total_time;
    }

    function getConnectionSpeed() {

        var load_time = getPageSpeed();

        // Assume high speed for non supporting browsers.
        var speed = "high";

        if (load_time) {
            if (load_time > 1000) { // One second
                speed = 'medium';
                if (load_time > 4000) { // Four seconds
                    speed = 'low';
                }
            }
        }
        
        return speed;

    }

    function getFontFormatSupport(ua) {
        var format = 'woff';
            ua = ua.toLowerCase();
            
        if (ua.indexOf('android') > -1) {
            format = 'ttf';
        }
        if (ua.indexOf('iphone os') > -1 && ua.indexOf('iphone os 5') < 0) {
            format = 'ttf';
        }
        return format;
    }

    // http://modernizr.com/download/#-svg
    function hasSvgSupport() {
        var ns = {'svg': 'http://www.w3.org/2000/svg'};
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    }

    return {
        getLayoutMode: getLayoutMode,
        getPixelRatio: getPixelRatio,
        getConnectionSpeed: getConnectionSpeed,
        getFontFormatSupport: getFontFormatSupport,
        hasSvgSupport: hasSvgSupport
    };

});
