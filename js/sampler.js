function Sample(args){
    this.loopEnvelope = function(){
        this.vars = instance;
        this.vars.envelope.play(this.vars.carrier);
        if ( this.vars.envelope.playing === true ) {
            setTimeout(this.vars.loopEnvelope, this.vars.envelope.freq);
        }
    };
    this.carrier = new p5.Oscillator();
    this.modulator = new p5.Oscillator();
    this.filter = new p5.Filter();
    this.envelope = new p5.Env();
    if ( typeof(args) === "undefined" ) {
        args = {};
        args.carrier = {};
        args.filter = {};
        args.modulator = {};
        args.env = {};
        args.carrier.type = 'sine';
        args.modulator.type = 'sine';
        args.carrier.freq = 240;
        args.modulator.freq = 20;
        args.carrier.amp = 1;
        args.modulator.amp = 0;
        args.filter.freq = 200;
        args.filter.res = 50;
        args.filter.type = 'lowpass';
        args.env.atkAmp = 1;
        args.env.relAmp = 0;
        args.env.atkTime = 0.001;
        args.env.decTime = 0.2;
        args.env.sustain = 0.2;
        args.env.release = 0.5;
        args.env.freq = 1000;
    }
    this.args = args;
    this.carrier.setType(args.carrier.type);
    this.modulator.setType(args.modulator.type);
    this.carrier.freq(args.carrier.freq);
    this.modulator.freq(args.modulator.freq);
    this.carrier.amp(args.carrier.amp);
    this.modulator.amp(args.modulator.amp);
    this.filter.res(args.filter.res);
    this.modulator.start();
    this.modulator.disconnect();
    this.carrier.freq(this.modulator);
    this.carrier.connect(this.filter);
    this.filter.disconnect();
    this.envelope.freq = args.env.freq;
    var instance = this;
    this.deleteButton = createReactClass({
        getInitialState(){
            this.vars = instance;
            return {};
        },
        clickHandler(){
            var newArray = [];
            for ( var i = 0; i < Samples.length; i++ ) {
                if ( this.vars.uniqId == Samples[i].props.uniqId ) {
                    this.vars.carrier.disconnect();
                } else {
                    newArray.push(Samples[i]);
                }
            }
            Samples = newArray.slice(0);
            SampleApp.render();
        },
        render(){
            return React.createElement('input', { key: 'delbutton', type: 'button', value: 'Delete', onClick: this.clickHandler });
        }
    });
    this.slider = createReactClass({
        getInitialState(){
            this.vars = instance;
            return { value: this.props.defaultValue }
        },
        updateState(value){
            var compvalue = this.props.id.replace(/\d/g,'');
            if ( compvalue === 'carrierFreq' ) {
                this.vars.carrier.freq(value);
            } else if ( compvalue === 'carrierAmp' ) {
                this.vars.carrier.amp(value);
            } else if ( compvalue === 'modFreq' ) {
                this.vars.modulator.freq(value);
            } else if ( compvalue === 'modAmp' ) {
                this.vars.modulator.amp(value);
            } else if ( compvalue === 'filterFreq' ) {
                this.vars.filter.freq(value);
            } else if ( compvalue === 'filterRes' ) {
                this.vars.filter.res(value);
            } else if ( compvalue === 'atkTime' ) {
                this.vars.envelope.setADSR( value, this.vars.envelope.dTime, this.vars.envelope.dLevel, this.vars.envelope.rTime );
            } else if ( compvalue === 'decTime' ) {
                this.vars.envelope.setADSR( this.vars.envelope.aTime, value, this.vars.envelope.dLevel, this.vars.envelope.rTime );
            } else if ( compvalue === 'sustain' ) {
                this.vars.envelope.setADSR( this.vars.envelope.aTime, this.vars.envelope.dTime, value, this.vars.envelope.rTime );
            } else if ( compvalue === 'release' ) {
                this.vars.envelope.setADSR( this.vars.envelope.aTime, this.vars.envelope.dTime, this.vars.envelope.dLevel, value );
            } else if ( compvalue === 'atkAmp' ) {
                this.vars.envelope.setRange( value, this.vars.envelope.aLevel );
            } else if ( compvalue === 'relAmp' ) {
                this.vars.envelope.setRange( this.vars.envelope.rLevel, value );
            } else if ( compvalue === 'envFreq' ) {
                this.vars.envelope.freq = value;
            }
        },
        changeHandler(){
        },
        render(){
            return React.createElement('input', { id: this.props.id, key: 'input'+this.props.uniqId, type: 'range', min: this.props.min, max: this.props.max, step: this.props.step, value: this.state.value, onChange: this.changeHandler });
        }
    });
    this.playButton = createReactClass({
        getInitialState(){
            this.vars = instance;
            return { startStop: this.props.defaultValue }
        },
        clickHandler(){
            if ( this.state.startStop === 'Start' ) {
                this.vars.carrier.start();
                this.setState({ startStop: 'Stop' });
            } else if ( this.state.startStop === 'Stop' ) {
                this.vars.carrier.stop();
                this.setState({ startStop: 'Start' });
            }
        },
        render(){
            return React.createElement('input', { id: 'startStop', className: 'startstop', type: 'button', value: this.state.startStop, onClick: this.clickHandler } )
        }
    });
    this.envelopeButton = createReactClass({
        getInitialState(){
            this.vars = instance;
            return { envelop: this.props.defaultValue, origValue: this.vars.carrier.amp().value }
        },
        clickHandler(){
            if ( this.state.envelop === 'Envelop' ) {
                this.vars.envelope.playing = true;
                this.setState({ envelop: 'Unenvelop', origValue: this.vars.carrier.amp().value });
                this.vars.carrier.amp(this.vars.envelope);
                // loop envelope at envelope.freq
                setTimeout(this.vars.loopEnvelope, this.vars.envelope.freq);
            } else if ( this.state.envelop === 'Unenvelop' ) {
                this.vars.envelope.playing = false;
                this.vars.carrier.amp(this.state.origValue);
                this.setState({ envelop: 'Envelop' });
            }
        },
        render(){
            return React.createElement('input', { id: 'envelop', type: 'button', value: this.state.envelop, onClick: this.clickHandler } );
        }
    });
    this.valueDisplay = createReactClass({
        getInitialState(){
            return { value: this.props.defaultValue }
        },
        updateState(val){
            this.setState( {value: val} );
        },
        render(){
            return React.createElement('span', {}, this.props.desc + ': ' + this.state.value );
        }
    });
    this.waveformSelect = createReactClass({
        getInitialState(){
            this.vars = instance;
            return { value: this.props.defaultValue };
        },
        updateState(e){
            var compvalue = this.props.id.replace(/\d/g,'');
            if ( compvalue === 'carrierWaveForm' ) {
                this.vars.carrier.setType(e.target.value);
            } else if ( compvalue === 'modWaveForm' ) {
                this.vars.modulator.setType(e.target.value);
            }
            this.setState({ value: e.target.value });
        },
        render(){
            return React.createElement('select', { id: this.props.id, value: this.state.value, onChange: this.updateState }, [
                React.createElement('option', { key: 'sineoption', value: 'sine' }, 'sine'),
                React.createElement('option', { key: 'triangleoption', value: 'triangle' }, 'triangle'),
                React.createElement('option', { key: 'sawtoothoption', value: 'sawtooth' }, 'sawtooth'),
                React.createElement('option', { key: 'squareoption', value: 'square' }, 'square')
            ]);
        }
    });
    this.filterSelect = createReactClass({
        getInitialState(){
            this.vars = instance;
            return { value: this.props.defaultValue };
        },
        updateState(e){
            if ( e.target.value === 'none' ) {
                this.vars.filter.disconnect();
            } else {
                this.vars.filter.connect();
                this.vars.filter.setType(e.target.value);
            }
            this.setState({ value: e.target.value });
        },
        render(){
            return React.createElement('select', { id: this.props.id, value: this.state.value, onChange: this.updateState }, [
                React.createElement('option', { key: 'nofilteroption', value: 'none'}, 'no filter'),
                React.createElement('option', { key: 'lowpassoption', value: 'lowpass' }, 'lowpass'),
                React.createElement('option', { key: 'highpassoption', value: 'highpass' }, 'highpass'),
                React.createElement('option', { key: 'bandpassoption', value: 'bandpass' }, 'bandpass'),
                React.createElement('option', { key: 'lowshelfoption', value: 'lowshelf' }, 'lowshelf'),
                React.createElement('option', { key: 'highshelfoption', value: 'highshelf' }, 'highshelf'),
                React.createElement('option', { key: 'peakingoption', value: 'peaking' }, 'peaking'),
                React.createElement('option', { key: 'notchoption', value: 'notch' }, 'notch')
            ]);
        }
    });
    this.ui = createReactClass({
        getInitialState(){
            this.vars = instance;
            this.vars.uniqId = this.props.uniqId;
            return {};
        },
        componentDidMount(){
            var updateCarrierFreqState = this.updateCarrierFreqState;
            var updateCarrierAmpState = this.updateCarrierAmpState;
            var updateModFreqState = this.updateModFreqState;
            var updateModAmpState = this.updateModAmpState;
            var updateFilterFreqState = this.updateFilterFreqState;
            var updateFilterResState = this.updateFilterResState;
            var updateAtkTimeState = this.updateAtkTimeState;
            var updateDecTimeState = this.updateDecTimeState;
            var updateSustainState = this.updateSustainState;
            var updateReleaseState = this.updateReleaseState;
            var updateAtkAmpState = this.updateAtkAmpState;
            var updateRelAmpState = this.updateRelAmpState;
            var updateEnvFreqState = this.updateEnvFreqState;
            $('#carrierFreq'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateCarrierFreqState(e) }, onSlideEnd: function(p,e){updateCarrierFreqState(e) }});
            $('#carrierAmp'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateCarrierAmpState(e) }, onSlideEnd: function(p,e){updateCarrierAmpState(e) }});
            $('#modFreq'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateModFreqState(e) }, onSlideEnd: function(p,e){updateModFreqState(e) }});
            $('#modAmp'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateModAmpState(e) }, onSlideEnd: function(p,e){updateModAmpState(e) }});
            $('#filterFreq'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateFilterFreqState(e) }, onSlideEnd: function(p,e){updateFilterFreqState(e) }});
            $('#filterRes'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateFilterResState(e) }, onSlideEnd: function(p,e){updateFilterResState(e) }});
            $('#atkTime'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateAtkTimeState(e) }, onSlideEnd: function(p,e){updateAtkTimeState(e) }});
            $('#decTime'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateDecTimeState(e) }, onSlideEnd: function(p,e){updateDecTimeState(e) }});
            $('#sustain'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateSustainState(e) }, onSlideEnd: function(p,e){updateSustainState(e) }});
            $('#release'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateReleaseState(e) }, onSlideEnd: function(p,e){updateReleaseState(e) }});
            $('#atkAmp'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateAtkAmpState(e) }, onSlideEnd: function(p,e){updateAtkAmpState(e) }});
            $('#relAmp'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateRelAmpState(e) }, onSlideEnd: function(p,e){updateRelAmpState(e) }});
            $('#envFreq'+this.props.uniqId).rangeslider({polyfill: false, onSlide: function(p,e){updateEnvFreqState(e) }, onSlideEnd: function(p,e){updateEnvFreqState(e) }});
        },
        updateCarrierFreqState(val){
            this.refs.carrierFreqSlider.updateState(val);
            this.refs.carrierFreqDisplay.updateState(val);
        },
        updateCarrierAmpState(val){
            this.refs.carrierAmpSlider.updateState(val);
            this.refs.carrierAmpDisplay.updateState(val);
        },
        updateModFreqState(val){
            this.refs.modFreqSlider.updateState(val);
            this.refs.modFreqDisplay.updateState(val);
        },
        updateModAmpState(val){
            this.refs.modAmpSlider.updateState(val);
            this.refs.modAmpDisplay.updateState(val);
        },
        updateFilterFreqState(val){
            this.refs.filterFreqSlider.updateState(val);
            this.refs.filterFreqDisplay.updateState(val);
        },
        updateFilterResState(val){
            this.refs.filterResSlider.updateState(val);
            this.refs.filterResDisplay.updateState(val);
        },
        updateAtkTimeState(val){
            this.refs.atkTimeSlider.updateState(val);
            this.refs.atkTimeDisplay.updateState(val);
        },
        updateDecTimeState(val){
            this.refs.decTimeSlider.updateState(val);
            this.refs.decTimeDisplay.updateState(val);
        },
        updateSustainState(val){
            this.refs.sustainSlider.updateState(val);
            this.refs.sustainDisplay.updateState(val);
        },
        updateReleaseState(val){
            this.refs.releaseSlider.updateState(val);
            this.refs.releaseDisplay.updateState(val);
        },
        updateAtkAmpState(val){
            this.refs.atkAmpSlider.updateState(val);
            this.refs.atkAmpDisplay.updateState(val);
        },
        updateRelAmpState(val){
            this.refs.relAmpSlider.updateState(val);
            this.refs.relAmpDisplay.updateState(val);
        },
        updateEnvFreqState(val){
            this.refs.envFreqSlider.updateState(val);
            this.refs.envFreqDisplay.updateState(val);
        },
        render() {
            return React.createElement('div', {}, [
                React.createElement(this.vars.playButton, { defaultValue: 'Start', key: 'button1'} ),
                React.createElement('span', { key: 'separator0' }, ' '),
                React.createElement(this.vars.deleteButton, { key: 'deletebutton' }),
                React.createElement('span', { key: 'separator1' }, ' '),
                React.createElement(this.vars.envelopeButton, { defaultValue: 'Envelop', key: 'envelopebutton' }),
                React.createElement('br', { key: 'br0' }),
                React.createElement('br', { key: 'br1' }),
                React.createElement(this.vars.waveformSelect, { id: 'carrierWaveForm'+this.props.uniqId, key: 'waveform1', ref: 'carrierWaveForm', defaultValue: this.vars.args.carrier.type }),
                React.createElement(this.vars.slider, { id: 'carrierFreq'+this.props.uniqId, key: 'slider1', ref: 'carrierFreqSlider', min: 0, max: 1000, step: 1, defaultValue: this.vars.args.carrier.freq }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.carrier.freq, key: 'value1', ref: 'carrierFreqDisplay', desc: 'carrier frequency' }),
                React.createElement('br', { key: 'br2' }),
                React.createElement(this.vars.slider, { id: 'carrierAmp'+this.props.uniqId, key: 'slider2', ref: 'carrierAmpSlider', min: 0, max: 1, step: 0.001, defaultValue: this.vars.args.carrier.amp }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.carrier.amp, key: 'value2', ref: 'carrierAmpDisplay', desc: 'volume (carrier amplification)' }),
                React.createElement('br', { key: 'br3' }),
                React.createElement(this.vars.waveformSelect, { id: 'modWaveForm'+this.props.uniqId, key: 'waveform2', ref: 'carrierWaveForm', defaultValue: this.vars.args.modulator.type }),
                React.createElement(this.vars.slider, { id: 'modFreq'+this.props.uniqId, key: 'slider3', ref: 'modFreqSlider', min: 0, max: 150, step: 1, defaultValue: this.vars.args.modulator.freq }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.modulator.freq, key: 'value3', ref: 'modFreqDisplay', desc: 'modulator frequency' }),
                React.createElement('br', { key: 'br4' }),
                React.createElement(this.vars.slider, { id: 'modAmp'+this.props.uniqId, key: 'slider4', ref: 'modAmpSlider', min: -150, max: 150, step: 1, defaultValue: this.vars.args.modulator.amp }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.modulator.amp, key: 'value4', ref: 'modAmpDisplay', desc: 'modulator amplification (times)' }),
                React.createElement('br', { key: 'br5' }),
                React.createElement(this.vars.filterSelect, { id: 'filterSelect'+this.props.uniqId, key: 'fselect1', defaultValue: this.vars.filter.type }),
                React.createElement(this.vars.slider, { id: 'filterFreq'+this.props.uniqId, key: 'slider5', ref: 'filterFreqSlider', min: 10, max: 1000, step: 1, defaultValue: this.vars.args.filter.freq }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.filter.freq, key: 'value5', ref: 'filterFreqDisplay', desc: 'filter cutoff frequency' }),
                React.createElement(this.vars.slider, { id: 'filterRes'+this.props.uniqId, key: 'slider6', ref: 'filterResSlider', min: 0, max: 1000, step: 1, defaultValue: this.vars.args.filter.res }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.filter.res, key: 'value6', ref: 'filterResDisplay', desc: 'filter resonance / bandpass frequency' }),
                React.createElement('br', { key: 'br6' }),
                React.createElement(this.vars.slider, { id: 'atkTime'+this.props.uniqId, key: 'slider7', ref: 'atkTimeSlider', min: 0.001, max: 1.000, step: 0.001, defaultValue: this.vars.args.env.atkTime }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.env.atkTime, key: 'value7', ref: 'atkTimeDisplay', desc: 'time before envelope reaches attack level' }),
                React.createElement(this.vars.slider, { id: 'decTime'+this.props.uniqId, key: 'slider8', ref: 'decTimeSlider', min: 0.001, max: 1.000, step: 0.001, defaultValue: this.vars.args.env.decTime }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.env.decTime, key: 'value8', ref: 'decTimeDisplay', desc: 'time until envelope reaches decay level' }),
                React.createElement(this.vars.slider, { id: 'sustain'+this.props.uniqId, key: 'slider9', ref: 'sustainSlider', min: 0.001, max: 1.000, step: 0.001, defaultValue: this.vars.args.env.sustain }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.env.sustain, key: 'value9', ref: 'sustainDisplay', desc: 'the envelope will sustain here until it is released' }),
                React.createElement(this.vars.slider, { id: 'release'+this.props.uniqId, key: 'slider10', ref: 'releaseSlider', min: 0.001, max: 1.000, step: 0.001, defaultValue: this.vars.args.env.release }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.env.release, key: 'value10', ref: 'releaseDisplay', desc: 'time before the envelope is released' }),
                React.createElement(this.vars.slider, { id: 'atkAmp'+this.props.uniqId, key: 'slider11', ref: 'atkAmpSlider', min: 0.001, max: 1.000, step: 0.001, defaultValue: this.vars.args.env.atkAmp }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.env.atkAmp, key: 'value11', ref: 'atkAmpDisplay', desc: 'level once attack is complete' }),
                React.createElement(this.vars.slider, { id: 'relAmp'+this.props.uniqId, key: 'slider12', ref: 'relAmpSlider', min: 0.001, max: 1.000, step: 0.001, defaultValue: this.vars.args.env.relAmp }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.env.relAmp, key: 'value12', ref: 'relAmpDisplay', desc: 'level at the end of the release' }),
                React.createElement(this.vars.slider, { id: 'envFreq'+this.props.uniqId, key: 'slider13', ref: 'envFreqSlider', min: 10, max: 6000, step: 10, defaultValue: this.vars.args.env.freq }),
                React.createElement(this.vars.valueDisplay, { defaultValue: this.vars.args.env.freq, key: 'value13', ref: 'envFreqDisplay', desc: 'repeat envelope at this frequency' }),
                React.createElement('br', { key: 'lastbr1' }),
                React.createElement('br', { key: 'lastbr2' })
            ]);
        }
    });
}