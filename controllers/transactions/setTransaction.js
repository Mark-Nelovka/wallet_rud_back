const {Transaction} = require("../../models")

const setTransaction = async (req, res) => {
  const {_id: owner} = req.user
  console.log("req.user: ", req.user);
  console.log("req.body: ", req.body)
  try {
    const result = await Transaction.create({...req.body, owner})
    const transactions = {
      _id: result._id,
      date: result.date,
      type: result.type,
      category: result.category,
      comment: result.comment || "",
      sum: result.sum,
      balance: result.balance,
      owner: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    }
    console.log(transactions);
    res.status(201).json({
      info: transactions
    });
  } catch (error) {
    return error;
  }

}

module.exports = setTransaction;
// {
  // "email": "test_email_test@ukr.net",
  // "password": "password1Q"
// }
// {
//   "date": "Sat Dec 09 2023 16:24:25",
// "type": "income",
// "category": "Products",
// "comment": "safdsafsf",
// "sum": 2000,
// "balance": 2000

// }
    //   {
    //   info: {...result, _id: req.user._id, owner: {
    //     _id: req.user._id,
    //     name: req.user.name,
    //     email: req.user.email
    //   }}
    // }