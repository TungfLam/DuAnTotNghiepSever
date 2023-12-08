var md = require('../../models/user.model');
var objReturn = {
    status: 1,
    msg: 'OK'
}
// get
exports.listAddress = async (req, res, next) => {
    let list = [];
    try {
        list = await md.addressModel.find();
        if (list.length > 0)
            objReturn.data = list;
        else {
            objReturn.status = 0;
            objReturn.msg = 'Không có dữ liệu phù hợp';
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    

    res.json(objReturn);
}
// validate address
const Joi = require('joi');

const schema = Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalcode: Joi.string().required(),
    country: Joi.string().required()
});
// add address 
exports.addAddress = async (req, res, next) => {
    try {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ message: 'Validation Error', error: validation.error.details });
        }
        const address = req.body;
        const newAddress = md.addressModel(address);
        await newAddress.save();
        console.log(newAddress);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.toString() });
    }

    res.json(objReturn);
}
// Update address
exports.updateAddress = async (req, res, next) => {
    try {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ message: 'Validation Error', error: validation.error.details });
        }

        const address = req.body;
        const updatedAddress = await md.addressModel.findByIdAndUpdate(req.params.id, address, { new: true });
        if (!updatedAddress) {
            return res.status(404).json({ message: 'address not found' });
        }

        console.log(updatedAddress);
        res.json(updatedAddress);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server Error', error: err.toString() });
    }
}


// Delete address
exports.deleteAddress = async (req, res, next) => {
    try {
        const deletedAddress = await md.addressModel.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({ message: 'address not found' });
        }

        console.log(deletedAddress);
        res.json({ message: 'address deleted', address: deletedAddress });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server Error', error: err.toString() });
    }
}
