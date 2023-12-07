const { ethers } = require('hardhat');
const {
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
} = require('../helper-hardhat-config');

const BASE_FEE = ethers.parseEther('2.0'); // 2.0 is the premium. It costs 2 LIMIT per gas tansaction
const GAS_PRICE_LINK = 1e9; // 1000000000

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log('Local network detected! Deploying mocks...');
    // deploy a mock vrfcoordinator...
    await deploy('VRFCoordinatorV2Mock', {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    });

    await deploy('MockV3Aggregator', {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });

    log('Mocks Deployed!');
    log('----------------------------------------------------------------');
  }
};

module.exports.tags = ['all', 'mocks'];
