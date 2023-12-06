const { Transaction } = require('../../models');

const getTransactions = async (req, res) => {
  const { _id: owner } = req.user;
  console.log("req.user: ", req);
  try {
    const result = await Transaction.find(
      { owner },
      '-createdAt -updatedAt'
    ).populate('owner', '_id name email');
    res.json({
      info: result
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = getTransactions;
