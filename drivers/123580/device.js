'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P123580 extends ZwaveDevice {
	onMeshInit() {
		// this.enableDebug();
		// this.printNode();
		this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
		this.registerCapability('dim', 'SWITCH_MULTILEVEL');
	}

}

module.exports = P123580;
