const { run } = require('hardhat');

async function verify(contractAddress, args) {
  try {
    await run('verify:verify', {
      address: contractAddress,
      constractorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('Already Verified');
    } else {
      console.log(error);
    }
  }
}

module.exports = { verify };
