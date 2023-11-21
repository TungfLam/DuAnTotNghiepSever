const sizemd = require('../models/sizes.model')



const getAll = async (req, res) => {
  const listSize = await sizemd.sizeModel.find()
  res.render('size/list', {
    title: 'Kích thước',
    listSize: listSize
  });
}

module.exports = { getAll }