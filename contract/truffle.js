const Web3 = require('web3');

require("babel-register")({
  presets: [
    ["env", {
      "targets": {
        "node": "8.0"
      }
    }]
  ],
  retainLines: true,
});
require("babel-polyfill");


//Here you can multiple networks, For adding another network on to different environemnt use comma seperateion and repeat the same. -
module.exports = {
  web3: Web3,
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      gas: "6617818",
     // from: "0x062d42d125aff12ac3980b74882ec3ef1fd16929",
      network_id: "*"// Match any network id
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      gas: 190725550,
      gasPrice: 2e10,
      port: 8545
    }
  }
}