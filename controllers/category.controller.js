const catemd = require('../models/category.model')



const getAll = async (req,res)=>{
const listCate = await catemd.categoryModel.find()
    res.render('category/list', {
      title:'Thể loại',
      listCate:listCate
    });
}

module.exports = {getAll}