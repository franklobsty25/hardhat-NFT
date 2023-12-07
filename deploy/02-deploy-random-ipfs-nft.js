const { network, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../helper-hardhat-config');
const {
  storeImages,
  storeTokenUriMetadata,
} = require('../utils/uploadToPinata');
const { verify } = require('../utils/verify');
require('dotenv').config();

const VRF_SUB_FUND_AMOUNT = ethers.parseEther('2');
const BASE_FEE = ethers.parseEther('2.0'); // 2.0 is the premium. It costs 2 LIMIT per gas tansaction
const GAS_PRICE_LINK = 1e9; // 1000000000

const imagesLocation = './images/randomNFT';
const metadataTemplate = {
  name: '',
  description: '',
  image: '',
  attributes: [
    {
      trait_type: 'cuteness',
      value: 100,
    },
  ],
};

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let tokenUris = [
    'ipfs://QmQs4yASJakykKzcUYiJoQEFptCuufghNA3S5J2CkD47tp',
    'ipfs://QmXry9jwWVKfbt6V87Gzd97WJ5LGAmtyWY7znSQXCRysv9',
    'ipfs://QmX5V7Xc31vMfM8tYgrNefix1WCFmiMqpLzjDtk6PgTQd2',
  ];

  // get the IPFS hashes of our images
  if (process.env.UPLOAD_TO_PINATA === 'true')
    tokenUris = await handleTokenUris();

  // 1. With our own IPFS node https://docs.ipfs.io/
  // 2. pinata https://www.pinata.cloud/
  // 3. nft.storage https://nft.storage/

  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    // const vrfCoordinatorV2Mock = await ethers.getContract(
    //   'VRFCoordinatorV2Mock'
    // );
    const vrfCoordinatorV2Mock = await ethers.deployContract(
      'VRFCoordinatorV2Mock',
      [BASE_FEE, GAS_PRICE_LINK]
    );
    await vrfCoordinatorV2Mock.waitForDeployment();
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.target;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = tx.wait(1);
    // subscriptionId = txReceipt.events[0].args.subId;
    subscriptionId = networkConfig[chainId].subscriptionId;
    
    // await vrfCoordinatorV2Mock.fundSubscription(
    //   subscriptionId,
    //   VRF_SUB_FUND_AMOUNT
    // ); For testing
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  log('----------------------------------------------------------------');

  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ];

  const randomIPFSNFT = await deploy('RandomIPFSNFT', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // const randomIPFSNFT = await ethers.deployContract('RandomIPFSNFT', args);
  // await randomIPFSNFT.waitForDeployment();

  log('----------------------------------------------------------------');

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('----------------------------------------------------------------');
    await verify(randomIPFSNFT.address, args);
  }
};

async function handleTokenUris() {
  tokenUris = [];
  // store the image in IPFS
  // store the metadata in IPFS
  const { responses: imageUploadResponses, files } =
    await storeImages(imagesLocation);
  for (imageUploadResponseIndex in imageUploadResponses) {
    // create metadata
    // upload the metadata
    let tokenUriMetadata = { ...metadataTemplate };
    // pug.png, st-bernard.png
    tokenUriMetadata.name = files[imageUploadResponseIndex].replace('.png', '');
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetadata.name}...`);
    // store the JSON // IPFS
    const metadataUploadResponse =
      await storeTokenUriMetadata(tokenUriMetadata);
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  console.log(`Token URIs! They are: `);
  console.log(tokenUris);
  return tokenUris;
}

module.exports.tags = ['all', 'randomIPFS', 'main'];
