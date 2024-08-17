const Account = require('./accounts-model')

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;

  if (name === undefined || budget === undefined) {
    return res.status(400).json({ message: "name and budget are required" });
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return res.status(400).json({ message: "name of account must be between 3 and 100" });
  }

  const budgetNumber = parseFloat(budget);
  if (isNaN(budgetNumber)) {
    return res.status(400).json({ message: "budget of account must be a number" });
  }

  if (budgetNumber < 0 || budgetNumber > 1000000) {
    return res.status(400).json({ message: "budget of account is too large or too small" });
  }

  next();
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const { name } = req.body;
    const trimmedName = name.trim();
    const accounts = await Account.getAll(); 
    const nameExists = accounts.some(account => account.name.trim() === trimmedName);

    if (nameExists) {
      return res.status(400).json({ message: "that name is taken" });
    }

    next();
  } catch (err) {
    next(err);
  }
};

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'account not found' });
    } else {
      req.account = account;
      next();
    }
  } catch (err) {
    next(err);
  }
};
