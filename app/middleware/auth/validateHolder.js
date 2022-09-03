const { handleError } = require('../utils/handleError')
const ethers = require('ethers')
const { contractAddresses, MrCryptoAbi } = require('../../../web3Constants')

const validateHolder = async (req, res, next) => {
  try {
    //TODO: recibir por parametro | body el address a verificar

    const address = req.query.address
    if (!address) return res.status(404).json({ message: 'Not address given' })

    const CONTRACT_ADDRESS =
      process.env.CHAIN_ID in contractAddresses
        ? contractAddresses[process.env.CHAIN_ID]
        : null
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.RINKEBY_PROVIDER
    )

    const mrCrypto = new ethers.Contract(
      CONTRACT_ADDRESS.MRCRYPTO[0],
      MrCryptoAbi,
      provider
    )

    const nftBalance = await mrCrypto.balanceOf(address)

    if (nftBalance < 1)
      return res.status(400).json({ message: 'you need at least 1 token' })

    res.status(200).json({ nfts: nftBalance.toString() })
  } catch (error) {
    handleError(res, error)
  }
}

const validateHolderInternal = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!address) {
        return reject(null)
      }
      const CONTRACT_ADDRESS =
        process.env.CHAIN_ID in contractAddresses
          ? contractAddresses[process.env.CHAIN_ID]
          : null
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.RINKEBY_PROVIDER
      )

      const mrCrypto = new ethers.Contract(
        CONTRACT_ADDRESS.MRCRYPTO[0],
        MrCryptoAbi,
        provider
      )
      const nftBalance = await mrCrypto.balanceOf(address)
      resolve(parseInt(nftBalance.toString()))
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

module.exports = { validateHolder, validateHolderInternal }
