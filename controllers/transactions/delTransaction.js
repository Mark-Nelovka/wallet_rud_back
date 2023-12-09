const {Transaction} = require("../../models")

const delTransaction = async (req, res) => {
  const {id: _id} = req.params
  console.log("DELETE: ", _id);
  try {
    await Transaction.findByIdAndDelete(_id)
    res.json({ 
      message: "transaction deleted",
    })
  } catch (error) {
    return error;
  }
}

module.exports = delTransaction