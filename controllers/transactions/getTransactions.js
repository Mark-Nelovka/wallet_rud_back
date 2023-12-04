const { Transaction } = require('../../models');

const getTransactions = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(_id);
  try {
    const result = await Transaction.find(
      { owner },
      '-createdAt -updatedAt'
    ).populate('owner', ' _id name email');
    res.json(`info: ${JSON.stringify(result)}`);
  } catch (error) {
    return error;
  }
};

module.exports = getTransactions;
