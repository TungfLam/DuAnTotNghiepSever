let colormd = require('../models/color.model')

let title = 'Màu sắc'
let heading = 'Danh sách màu sắc'

const getAll = async (req, res) => {
  const listColor = await colormd.colorModel.find();
  res.render('color/list', {
    title: title,
    heading: heading,
    listColor: listColor
  });
}
const addColor = async (req, res) => {
  try {
    const { name, codecolor } = req.body;

    // Tạo một bản ghi mới trong cơ sở dữ liệu

    await colormd.colorModel.create({
      name: name,
      colorcode: codecolor,

    });
    res.redirect('/color');
  } catch (error) {
    res.status(500).json({ error: error, message: 'Có lỗi xảy ra khi thêm màu sắc' });
  }
};


const deleteColor = async (req, res) => {
  const idColor = req.params.idColor;
  console.log(idColor);
  try {
    await colormd.colorModel.findByIdAndDelete(idColor);
    res.redirect('/color');
  } catch (error) {
    res.status(500).json({ error: error, message: 'Có lỗi xảy ra khi xóa màu sắc' });
  }
};

const updateColor =async (req,res)=>{
  const idCate = req.params.idColor;
  const newName = req.body.nameColor;
  const newcodecolor = req.body.codecolor
  console.log(newcodecolor);
  try {
      await colormd.colorModel.findByIdAndUpdate(idCate, { name: newName,colorcode:newcodecolor });
      res.redirect('/color');
  } catch (error) {
      res.status(500).json({ error: error, message: 'Có lỗi xảy ra' });
  }
}
module.exports = { getAll, addColor, deleteColor,updateColor }