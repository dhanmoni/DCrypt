const { fundingAccountAddress, alchemyUrl } = require("./constants");

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks:{
    ropsten:{
      url:alchemyUrl,
      accounts:[fundingAccountAddress]
    }
  }
};
