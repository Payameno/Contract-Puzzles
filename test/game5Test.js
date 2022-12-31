const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    let validAddress;
    let wallet;
    let address;
    
    while(!validAddress) {
      const randomWallet = ethers.Wallet.createRandom();
      const walletAddress = await randomWallet.getAddress();
      
      //Javascript converting string to number and comparing
      if (walletAddress < threshold) {
        console.log("Valid Address Found", walletAddress);
        
        wallet = randomWallet;
        address = walletAddress;
        validAddress = true;
      }
    }
    
    //Add balance to the valid address for tx gas fee
    wallet = wallet.connect(ethers.provider);
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({ to: address, value: ethers.utils.parseEther("200")})
  
    return { game, wallet };
  }
  it('should be a winner', async function () {
    const { game, wallet } = await loadFixture(deployContractAndSetVariables);

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
