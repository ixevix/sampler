var SampleApp = {};
var React, ReactDOM, createReactClass, rangeslider;

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
                SampleApp.initApp();
            });
        });
    });
});

SampleApp.initApp = function(){
    SampleApp.slider = createReactClass({
        getInitialState(){
            return { value: this.props.value }
        },
        componentDidMount(){
            updateState = this.updateState;
            $('#carrierFreq').rangeslider({polyfill: false, onSlide: function(p,e){updateState(e) }, onSlideEnd: function(p,e){updateState(e) }});
        },
        updateState(value){
            console.log(value);
        },
        render(){
            return React.createElement('input', { id: 'carrierFreq', type: 'range', min: 0, max: 44000, step: 1, value: this.state.value });
        }
    });
    ReactDOM.render( React.createElement('div', {}, React.createElement(SampleApp.slider)), document.getElementById('root'));
}

