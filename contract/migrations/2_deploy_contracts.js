//Configuration
const config = require('web3-utils');

//Storage Layer
const eternalStorage = artifacts.require("./BaseStorage.sol");

//Main Contracts
const asset = artifacts.require("./Asset.sol");
const erc721Contract = artifacts.require("./ERC721.sol");
const erc20Contract = artifacts.require("./ERC20.sol");
const marketplace = artifacts.require("./Marketplace.sol");

//exports all the deployed contracts
module.exports = async (deployer, network) => {

  return deployer.deploy(eternalStorage).then(() => {

    return deployer.deploy(asset, eternalStorage.address).then(() => {

      return deployer.deploy(erc721Contract, "NFT Token", "NFT", eternalStorage.address).then(() => {

        return deployer.deploy(erc20Contract, "Currency Token", "CKT", 2, eternalStorage.address).then(() => {

          return deployer.deploy(marketplace, eternalStorage.address).then(() => {

            return eternalStorage.deployed().then(async eternalStorageInstance => {
              //Update the storage with new address
              console.log('\n');

              // Log it
              console.log('\x1b[33m%s\x1b[0m:', 'Set Storage Address');
              console.log(eternalStorage.address);

              // Asset Registration Contracts
              await eternalStorageInstance.setAddress(
                config.soliditySha3('contract.address', asset.address),
                asset.address
              );
              await eternalStorageInstance.setAddress(
                config.soliditySha3('contract.name', 'assetRegistration'),
                asset.address
              );
              // Log it
              console.log('\x1b[33m%s\x1b[0m:', 'Set Asset Storage Address');
              console.log(asset.address);

              // ERC 721 Contracts
              await eternalStorageInstance.setAddress(
                config.soliditySha3('contract.address', erc721Contract.address),
                erc721Contract.address
              );
              await eternalStorageInstance.setAddress(
                config.soliditySha3('contract.name', 'erc721Contract'),
                erc721Contract.address
              );
              // Log it
              console.log('\x1b[33m%s\x1b[0m:', 'Set ERC721 Address');
              console.log(erc721Contract.address);

              // ERC 20 Contracts
              await eternalStorageInstance.setAddress(
                config.soliditySha3('contract.address', erc20Contract.address),
                erc20Contract.address
              );
              await eternalStorageInstance.setAddress(
                config.soliditySha3('contract.name', 'erc20Contract'),
                erc20Contract.address
              );
              // Log it
              console.log('\x1b[33m%s\x1b[0m:', 'Set ERC20 Address');
              console.log(erc20Contract.address);

              // Auction Repositroy Contract
              await eternalStorageInstance.setAddress(
                config.soliditySha3('contract.address', marketplace.address),
                marketplace.address
              );
              await eternalStorageInstance.setAddress(
                config.soliditySha3('contract.name', 'auctionRepository'),
                marketplace.address
              );
              // Log it
              console.log('\x1b[33m%s\x1b[0m:', 'Set Marketplace Address');
              console.log(marketplace.address);

              return deployer;
            });
          });
        });
      });
    });
  });
};

