const router = require('express').Router();
const md = require('./accounts-middleware');
const Account = require('./accounts-model');

router.get('/', async (req, res, next) => {
  try {
    const { limit, sortby, sortdir } = req.query;

    let query = Account.getAll();

    if (sortby) {
      const direction = sortdir || 'asc';
      query = query.orderBy(sortby, direction);
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const accounts = await query;
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', md.checkAccountId, async (req, res, next) => {
  try {
    res.json(req.account);
  } catch (err) {
    next(err);
  }
});

router.post('/',
  md.checkAccountPayload,
  md.checkAccountNameUnique,
  async (req, res, next) => {
    try {
      const { name, budget } = req.body;
      const newAccount = { name: name.trim(), budget };
      const createdAccount = await Account.create(newAccount);
      res.status(201).json(createdAccount);
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id',
  md.checkAccountId,
  md.checkAccountPayload,
  md.checkAccountNameUnique,
  async (req, res, next) => {
    try {
      const { name, budget } = req.body;
      const updatedAccount = { name: name.trim(), budget };
      const account = await Account.updateById(req.params.id, updatedAccount);
      res.json(account);
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', md.checkAccountId, async (req, res, next) => {
  try {
    const deletedAccount = await Account.deleteById(req.params.id);
    res.json(deletedAccount);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = router;
