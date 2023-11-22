const sizemd = require('../models/sizes.model')


let title = 'Kích thước'
let heading = 'Danh sách kích thước'

const getAll = async (req, res) => {
  const listSize = await sizemd.sizeModel.find()
  res.render('size/list', {
    title:title,
    heading:heading,
    listSize: listSize
  });
}

module.exports = { getAll }