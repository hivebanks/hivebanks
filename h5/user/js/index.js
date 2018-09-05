$(function(){
    var smokyBG = $('#smoky-bg').waterpipe({
        gradientStart: '#51ff00',
        gradientEnd: '#001eff',
        smokeOpacity: 0.1,
        smokeSize: 100,
        numCircles: 1,
        maxMaxRad: 'auto',
        minMaxRad: 'auto',
        minRadFactor: 0,
        iterations: 8,
        drawsPerFrame: 10,
        lineWidth: 2,
        speed: 10,
        bgColorInner: "#111",
        bgColorOuter: "#000"
    });
});
