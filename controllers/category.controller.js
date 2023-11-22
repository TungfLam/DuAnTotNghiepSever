const catemd = require('../models/category.model')

let title = 'Thể loại'
let heading = 'Danh sách thể loại'

const getAll = async (req,res)=>{
const listCate = await catemd.categoryModel.find()
    res.render('category/list', {
      title:title,
      heading:heading,
      listCate:listCate
    });
}

module.exports = {getAll}