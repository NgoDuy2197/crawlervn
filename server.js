const good = require('good');
const https = require('https');
var net = require('net');
// var fs = require('fs');
const { Readable } = require('stream');
const axios = require('axios');
const Hapi = require('@hapi/hapi');
let header = require('./model/header')
let controller = require('./controller/crawlData')
let routes = require('./route/route')

// var Crawler = require("js-crawler");
var Crawler = require("crawler");
var url = require('url');
let count = 0
let countPage = 0
let maxConnect = 100
let dataAll = []
let countHienTai = 0
let id = 0
let countTrung = 0
let tongSo = 0
let status = 'Sẵn sàng'
let tientoLink = 'https://thiendia.com/diendan/'
let downloadcontent = header

// create a server with a host and port
// var server = new hapi.Server(process.argv[2] || process.env.PORT, '0.0.0.0');

	const server = Hapi.server({
		port: process.env.PORT || 8001,
		host: '0.0.0.0'
	});


server.register(require('inert'));
server.register(require('hapi-response-time'))
//GET status


//ROUTE 
for(let i of routes){
  server.route(i)
}

                                                          //PAGE
//INDEX 
    server.route({
      method: 'GET',
      path: '/',
      handler: {
        file: {
            path: './html/index.html',
            confine: false
        }
    }
  });
    
    // Queue just one URL, with default callback
// set up logging
const good_options = {
    ops: {
        interval: 1000
    },
    reporters: {
      myConsoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }]
      }, {
          module: 'good-console'
      }, 'stdout'],
    }
  };
  
const init = async () => {
  try {
    await server.register([{
      plugin: good,
      options: good_options
    }]);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

init();