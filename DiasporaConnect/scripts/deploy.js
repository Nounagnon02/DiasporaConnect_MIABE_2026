const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of DiasporaConnect to Celo Alfajores...");

  const DiasporaConnect = await hre.ethers.getContractFactory("DiasporaConnect");
  const diasporaconnect = await DiasporaConnect.deploy();

  await diasporaconnect.waitForDeployment();

  const address = await diasporaconnect.getAddress();
  
  console.log("DiasporaConnect securely deployed to:", address);
  console.log("Verify on blockscout: https://explorer.celo.org/alfajores/address/" + address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
