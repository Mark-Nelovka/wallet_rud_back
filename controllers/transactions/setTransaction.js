const {Transaction} = require("../../models")

const setTransaction = async (req, res) => {
  const {_id: owner} = req.user
  console.log(_id);
  try {
    const result = await Transaction.create({...req.body, owner})
    console.log(result);
    res.status(201).json(`info: ${JSON.stringify(result)}`);
  } catch (error) {
    return error;
  }

}

module.exports = setTransaction;