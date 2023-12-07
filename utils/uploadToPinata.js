/**
 * const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const JWT = process.env.PINATA_JWT_KEY

const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = "path/to/file.png";
    
    const file = fs.createReadStream(src)
    formData.append('file', file)
    
    const pinataMetadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${JWT}`
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}
pinFileToIPFS()

 */

// IPFS Restricted access url: https://tan-holy-whippet-921.mypinata.cloud
// Gateway API KEY for retrieval: process.env.PINATA_GATEWAY_API_KEY
// Gateway retrival url format: https://tan-holy-whippet-921.mypinata.cloud/{CID}?pinataGatewayToken={Gateway API Key}
// Gateway retrival url for the CID: curl 'https://tan-holy-whippet-921.mypinata.cloud/ipfs/QmPyCYfL5oF79cfXjbt5cyr5hAZcyNrPNV9ytvUPdk8KT9?pinataGatewayToken=process.env.PINATA_GATEWAY_API_KEY'
const pinataSDK = require('@pinata/sdk');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const pinataJWTKey = process.env.PINATA_JWT_KEY;

// Use the JWT key
const pinata = new pinataSDK({ pinataJWTKey });

async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);
  let responses = [];
  console.log('-----Uploading to IPFS------------');
  for (fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );
    const options = {
      pinataMetadata: {
        name: files[fileIndex],
        keyvalues: {
          customKey: `${fileIndex}`,
        },
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    try {
      const response = await pinata.pinFileToIPFS(
        readableStreamForFile,
        options
      );
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }
  return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { storeImages, storeTokenUriMetadata };
