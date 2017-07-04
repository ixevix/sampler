function Sample(args){
    this.carrier = new p5.Oscillator();
    this.modulator = new p5.Oscillator();
    if ( typeof(args) === "undefined" ) {
        this.carrier.setType('sine');
        this.modulator.setType('sine');
        this.carrier.freq(240)
        this.modulator.freq(20);
        this.carrier.amp(0.5);
        this.modulator.amp(100);
    } else {
        this.carrier.setType(args.carrier.type);
        this.carrier.freq(args.carrier.freq);
        this.carrier.amp(args.carrier.amp);
    }
    //this.carrier.start();
    this.modulator.start();
    this.modulator.disconnect();
    this.carrier.freq(this.modulator);
}