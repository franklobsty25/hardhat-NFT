require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-deploy');
require('solidity-coverage');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: '0.8.7',
  solidity: {
    compilers: [
      { version: '0.8.7' },
      { version: '0.8.20' },
      { version: '0.6.0' },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmation: 6,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currench: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: 'MATIC',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 300000, // 300 seconds max
  },
};
