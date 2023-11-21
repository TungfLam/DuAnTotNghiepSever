const colormd = require('../models/color.model')



const getAll = async (req,res)=>{
  const listColor = await colormd.colorModel.find();
    res.render('color/list', {
      title:'Màu sắc',
      listColor:listColor
    });
}

module.exports = {getAll}