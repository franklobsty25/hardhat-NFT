const { ethers } = require('hardhat');

const networkConfig = {
  11155111: {
    name: 'sepolia',
    vrfCoordinatorV2: '0x8103b0a8a00be2ddc778e6e7eaa21791cd364625',
    entranceFee: ethers.parseEther('0.01'),
    gasLane:
      '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c',
    subscriptionId: '6601',
    callbackGasLimit: '500000', // 500 000
    interval: '30',
    mintFee: '10000000000000000', // 0.01 ETH
    ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
  },
  31337: {
    name: 'localhost',
    entranceFee: ethers.parseEther('0.01'),
    gasLane:
      '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c', // 30 gwei
    subscriptionId: '0',
    callbackGasLimit: '500000', // 500 000
    interval: '30',
    mintFee: '10000000000000000', // 0.01 ETH
    ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
  },
  1: {
    name: 'mainnet',
    keepersUpdateInterval: '30',
  }
};

const DECIMALS = '18';
const INITIAL_PRICE = '200000000000000000000';
const developmentChains = ['hardhat', 'localhost'];

module.exports = { networkConfig, developmentChains, DECIMALS, INITIAL_PRICE };
