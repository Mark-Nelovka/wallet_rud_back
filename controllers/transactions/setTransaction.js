const {Transaction} = require("../../models")

const setTransaction = async (req, res) => {
  const {_id: owner} = req.user
  console.log("req.user._id: ", req.user._id);
  console.log("req.body: ", req.body)
  try {
    const result = await Transaction.create({...req.body, owner})
    console.log("result: ", result);
    res.status(201).json({
      info: result
    });
  } catch (error) {
    return error;
  }

}

module.exports = setTransaction;