const { Transaction } = require('../../models');

const getCategories = async (req, res) => {
  const { _id } = req.user;
  const expense = await Transaction.aggregate([
    {
      $match: {
        owner: _id,
        type: 'expense',
      },
    },
    {
      $group: {
        _id: {
          type: 'expense',
          month: {
            $month: '$date',
          },
          year: {
            $year: '$date',
          },
        },
        totalPrice: {
          $sum: '$sum',
        },
        category: {
          $push: {
            category: '$category',
            sum: '$sum',
          },
        },
      },
    },
  ]);

  const income = await Transaction.aggregate([
    {
      $match: {
        owner: _id,
        type: 'income',
      },
    },
    {
      $group: {
        _id: {
          type: 'income',
          month: {
            $month: '$date',
          },
          year: {
            $year: '$date',
          },
        },
        totalPrice: {
          $sum: '$sum',
        },
        category: {
          $push: {
            category: '$category',
            sum: '$sum',
          },
        },
      },
    },
  ]);
  
  const newKeyExpense = {month: expense[0]._id.month, year: expense[0]._id.year, totalPrice: expense[0].totalPrice, category: expense[0].category};
  const newKeyIncome = {month: income[0]._id.month, year: income[0]._id.year, totalPrice: income[0].totalPrice, category: income[0].category};

  res.status(200).json({
    statusCode: 200,
    message: "Success",
    expense: newKeyExpense,
    income: newKeyIncome
  });
};

module.exports = getCategories;
