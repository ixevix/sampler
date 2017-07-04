var SampleApp = {};
var Samples = [];
var React, ReactDOM, createReactClass, rangeslider, p5

requirejs.config({
    baseUrl: 'js/'
});

require(['react'], function(react){
    React = react;
    require(['create-react-class'], function(crc){
        createReactClass = crc;
        require(['react-dom'], function(reactdom){
            ReactDOM = reactdom;
            require(['rangeslider'], function(rs){
                rangeslider = rs;
                require(['p5'], function(pfive){
                    p5 = pfive;
                    require(['p5.sound'], function(pfs){
                        p5.sound = pfs;
                        SampleApp.initApp();
                    });
                });
            });
        });
    });
});

SampleApp.initApp = function(){
    sample = new Sample();
    Samples.push(sample);
    ReactDOM.render( React.createElement(sample.ui), document.getElementById('root'));
}

