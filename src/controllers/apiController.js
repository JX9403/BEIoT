const getServer = async (req, res) => {
  return res.status(200).json({
    errorCode: 0,
  })
}

module.exports = {
  getServer
}