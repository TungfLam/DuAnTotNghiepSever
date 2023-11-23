const catemd = require('../models/category.model')

let title = 'Thể loại'
let heading = 'Danh sách thể loại'
let message = ''
const getAll = async (req, res) => {
  const listCate = await catemd.categoryModel.find()
console.log(listCate);
  res.render('category/list', {
    title: title,
    heading: heading,
    listCate: listCate
  });
}
const addCate = async (req, res) => {
  const nameCate = req.body.name;
  console.log('nameCate', nameCate);

  try {
    if (req.method === 'POST') {
      await catemd.categoryModel.create({ name: nameCate });
      res.redirect('/category');
    }
  } catch (error) {
    res.status(500).json({ error: error, message: 'Có lỗi xảy ra' });
  }
};

  const deleteCate = async (req, res) => {
    const idCate = req.params.idCate;
    console.log(idCate)
    try {
      await catemd.categoryModel.findByIdAndDelete(idCate);
      res.redirect('/category');
      // res.render('category/list', {
      //   title: title,
      //   heading: heading,
      //   listCate: listCate,
      //   message:'Xóa thành công'
      // });

    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

const updateCate = async (req, res) => {
    const idCate = req.params.idCate;
    const newName = req.body.nameCate;
    try {
        await catemd.categoryModel.findByIdAndUpdate(idCate, { name: newName });
        res.redirect('/category');
    } catch (error) {
        res.status(500).json({ error: error, message: 'Có lỗi xảy ra' });
    }
};

  module.exports = { getAll, deleteCate, addCate,updateCate }