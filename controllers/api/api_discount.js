const mddiscount = require('../../models/discount.model');

const getAllDiscount = async (req, res) => {
    try {
        const listdiscount = await mddiscount.discountModel.find().populate('user_id',"username")
        .sort({ createdAt: -1});

        return res.status(200).json({ message: 'Success', listdiscount: listdiscount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getAllDiscount };
