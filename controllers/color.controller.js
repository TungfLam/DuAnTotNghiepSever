const colormd = require('../models/color.model')

let title = 'Màu sắc'
let heading = 'Danh sách màu sắc'

const getAll = async (req,res)=>{
  const listColor = await colormd.colorModel.find();
    res.render('color/list', {
      title:title,
      heading:heading,
      listColor:listColor
    });
}

module.exports = {getAll}