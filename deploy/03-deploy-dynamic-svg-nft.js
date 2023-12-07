const { ethers, network } = require('hardhat');
const fs = require('fs');
const {
  developmentChains,
  networkConfig,
  DECIMALS,
  INITIAL_PRICE,
} = require('../helper-hardhat-config');
require('dotenv').config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;
  let args = [DECIMALS, INITIAL_PRICE];

  if (developmentChains.includes(network.name)) {
    const EthUsdAggregator = await ethers.deployContract(
      'MockV3Aggregator',
      args
    );
    await EthUsdAggregator.waitForDeployment();
    ethUsdPriceFeedAddress = EthUsdAggregator.target;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  const lowSVG = await fs.readFileSync('./images/dynamicNFT/frown.svg', {
    encoding: 'utf8',
  });
  const highSVG = await fs.readFileSync('./images/dynamicNFT/happy.svg', {
    encoding: 'utf8',
  });

  args = [ethUsdPriceFeedAddress, lowSVG, highSVG];
  const dynamicSVGNFT = await deploy('DynamicSVGNFT', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...');
    await verify(dynamicSVGNFT.address, args);
  }
};

module.exports.tags = ['all', 'dynamicsvg', 'main'];
