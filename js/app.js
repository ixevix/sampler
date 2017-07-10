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
    SampleApp.idCounter = 0;
    SampleApp.addSampleButton = createReactClass({
        clickHandler(){
            SampleApp.addSample();
            SampleApp.render();
        },
        render(){
            return React.createElement('input', { type: 'button', value: 'Add sample', onClick: this.clickHandler });
        }
    });
    SampleApp.addSample();
    SampleApp.render();
}

SampleApp.addSample = function(){
    Samples.push(React.createElement(new Sample().ui, { key: 's'+SampleApp.idCounter++, uniqId: SampleApp.idCounter++ }));
}

SampleApp.render = function(){
    var renderarray = [];
    renderarray.push(React.createElement(SampleApp.addSampleButton, { key: 'asbutton'}));
    renderarray.push(React.createElement('br', {key: 'asbr1'}));
    renderarray.push(React.createElement('br', {key: 'asbr2'}));
    for ( var i = 0; i < Samples.length; i++ ) {
        renderarray.push(Samples[i]);
    }
    ReactDOM.render( React.createElement('div', {}, renderarray ), document.getElementById('root'));
}

