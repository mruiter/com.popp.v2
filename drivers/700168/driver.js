"use strict";

// author: roger at schobben dot com
// date: 20170818
// version: 1.00
//
// Driver for popp.eu Z-Rain (product 700168), https://shop.zwave.eu/products/sensors/other/1434/popp-z-rain
//
// Note 'leading 'Z' in driver / folder name used to work-around likely Athom Homey bug, flow triggers would not appear without

const path          = require('path');
const ZwaveDriver   = require('homey-zwavedriver');

module.exports = new ZwaveDriver( path.basename(__dirname), {
    //debug: true,
    capabilities: {
		'alarm_rain': {
				'command_class': 'COMMAND_CLASS_BASIC',
				'command_get': 'BASIC_GET',
				'command_report': 'BASIC_SET',
				'command_report_parser': (report, node) => {
						if (report.hasOwnProperty('Value'))
						{
							switch (report['Value'])
							{
								case 0: Homey.manager('flow').triggerDevice('700168_rain_stop', null, null, node.device_data); 
									break;
								case 1: Homey.manager('flow').triggerDevice('700168_heavy_rain_stop', null, null, node.device_data); 
									break;
								case 99: Homey.manager('flow').triggerDevice('700168_rain_start', null, null, node.device_data); 
									break;
								case 98: Homey.manager('flow').triggerDevice('700168_heavy_rain_start', null, null, node.device_data); 
									break;
							}
						}
						
					}	
				},
		 'meter_rain': { //reports total m3 per m2 measured
				'command_class': 'COMMAND_CLASS_METER',
				'command_get': 'METER_GET',
				'command_get_parser': () => {
					return {
				            'Sensor Type': 'Water meter',
							'Properties1': {
								'Scale' : 0,
								'Rate Type': 'Import'
						    },
							'Scale 2': 0
					};
				},
				'command_report': 'METER_REPORT',
				'command_report_parser': report => {
					if (report.hasOwnProperty('Properties1')
					&& report.Properties1.hasOwnProperty('Meter Type')
				    && report.Properties1['Meter Type'] === "Water meter"
					&& report.hasOwnProperty('Properties2')
                    && report.Properties2.hasOwnProperty('Scale bits 10')
                    && report.Properties2['Scale bits 10'] === 0) {
						return report['Meter Value (Parsed)'];
					    }
					return null;
				}
			},
			'measure_rain': { // reports mm/hour
				'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
				'command_get': 'SENSOR_MULTILEVEL_GET',
				'command_get_parser': () => {
					return {
				           'Sensor Type': 'Rain rate (version 2) ', // extra trailing space is what device reports
							'Properties1': {
								'Scale' : 0,
								'Rate Type': 'Import'
						    }
					};
				},
				'command_report': 'SENSOR_MULTILEVEL_REPORT',
				'command_report_parser': report => {
					if (report.hasOwnProperty('Sensor Type')
					&& report['Sensor Type'] == 'Rain rate (version 2) '
				    && report.hasOwnProperty('Sensor Value (Parsed)') ) {
						return report['Sensor Value (Parsed)'];
					    }
					return null;
				}
			},
			'alarm_battery': { 
    			'command_class': 'COMMAND_CLASS_BATTERY',
	    		'command_get': 'BATTERY_GET',
    			'command_report': 'BATTERY_REPORT',
    			'command_report_parser': (report, node) => { 
    				if(report.hasOwnProperty('Battery Level (Raw)')) {
    					if (report['Battery Level (Raw)'][0] == 255) {
    						return true
    						}
    					return false
   	        			}
   					}		
			},
			'measure_battery': { 
    			getOnWakeUp: true,
    			'command_class': 'COMMAND_CLASS_BATTERY',
	    		'command_get': 'BATTERY_GET',
    			'command_report': 'BATTERY_REPORT',
    			'command_report_parser': (report, node) => { 
    				if(report.hasOwnProperty('Battery Level (Raw)')) {
    					if(report['Battery Level (Raw)'][0] == 255) return 1;
        				return report['Battery Level (Raw)'][0];
						}
					return null;
    			}
			}
		},
  settings: {
            "rain_counter": {
				"index": 1,
				"size": 2,
            },
			"rain_start_command": {
				"index": 2,
				"size": 1,
            },
			"rain_stop_command": {
				"index": 3,
				"size": 1,
            },
			"meter_multiplier": {
				"index": 4,
				"size": 2,
            },
            "heavy_rain": {
                "index": 5,
                "size": 1,
            },
			"heavy_rain_start_command": {
                "index": 6,
                "size": 1,
            },
			"heavy_rain_stop_command": {
                "index": 7,
                "size": 1,
            }
        }
	}
);

module.exports.on('initNode', function( token ){
	var node = module.exports.nodes[ token ];
});