var fs = require('fs');
const billMD = require('../models/bill.model');
const mongoose = require('mongoose');

let title = 'Hóa Đơn'
let heading = 'Danh sách hóa đơn'
let msg = ''
let msg2 = ''

const { log } = require('console');

exports.loc = async (req, res, next) => {

    if (req.method == 'GET') {
        try {

            // phân trang
            // Thêm mã này để xử lý phân trang
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;


            //==============
            let dieu_kien_loc = {};
            if (req.query['payments']) {
                dieu_kien_loc.payments = req.query['payments'];
            }
            //== loc status
            if (req.query['status']) {
                dieu_kien_loc.status = req.query['status'];
            }
            //== loc ma don
            if (req.query['from-date'] && req.query['to-date']) {
                dieu_kien_loc.date = {
                    $gte: new Date(req.query['from-date']),
                    $lte: new Date(req.query['to-date'])
                };
            }
            //== loc ma don hang
            if (req.query['id_']) {
                dieu_kien_loc._id = req.query['id_'];
            }
            //== loc ma nguoi dung
            if (req.query['user-id']) {
                dieu_kien_loc.user_id = req.query['user-id'];
            }
            //===
            //=== lọc theo giá
            if (req.query['min-price'] && req.query['max-price']) {
                dieu_kien_loc.total_amount = {
                    $gte: Number(req.query['min-price']),
                    $lte: Number(req.query['max-price'])
                };
            }
            //===



            var bills = await billMD.billModel.find(dieu_kien_loc)
                .skip(skip)
                .limit(limit)
                .populate('user_id')
                .populate({
                    path: 'cart_id',
                    populate: {
                        path: 'product_id'
                    }
                })
                .sort({ date: -1 });

            // Tính tổng số trang
            const totalBills = await billMD.billModel.countDocuments(dieu_kien_loc);
            const totalPages = Math.ceil(totalBills / limit);

            // thống kê màn hình hóa đơn
            // Tính tổng số hóa đơn
            let tong_so_hoa_don = await billMD.billModel.countDocuments(dieu_kien_loc);
            // Tính tổng số hóa đơn đã thanh toán
            let tong_so_hoa_don_da_thanh_toan = await billMD.billModel.countDocuments({ ...dieu_kien_loc, status: 2 });

            // Tính tỷ lệ phần trăm
            let ti_le_thanh_toan = ((tong_so_hoa_don_da_thanh_toan / tong_so_hoa_don) * 100).toFixed(2);

            // Tính tổng tiền
            let tong_tien = await billMD.billModel.aggregate([
                { $match: dieu_kien_loc },
                { $group: { _id: null, total: { $sum: "$total_amount" } } }
            ]);

            // Tính tổng tiền đã thanh toán
            let tong_tien_da_thanh_toan = await billMD.billModel.aggregate([
                { $match: { ...dieu_kien_loc, status: 2 } },
                { $group: { _id: null, total: { $sum: "$total_amount" } } }
            ]);
            // Tính tổng số hóa đơn có payments = 1
            let tong_so_hoa_don_payments_1 = await billMD.billModel.countDocuments({ ...dieu_kien_loc, payments: 1 });

            // Tính tổng số hóa đơn có payments = 2
            let tong_so_hoa_don_payments_2 = await billMD.billModel.countDocuments({ ...dieu_kien_loc, payments: 2 });
            // Kiểm tra kết quả và gán giá trị
            tong_tien = tong_tien.length > 0 ? tong_tien[0].total : 0;
            tong_tien_da_thanh_toan = tong_tien_da_thanh_toan.length > 0 ? tong_tien_da_thanh_toan[0].total : 0;
            //===
            if (!bills) {
                res.status(404).send('Tìm kiếm thất bại');
                msg2 = 'Tìm kiếm thất bại';
                msg = '';

            } else {
                res.render('bill/index', {
                    msg: msg,
                    msg2: msg2,
                    title: title,
                    heading: heading,
                    bills: bills,
                    totalPages: totalPages,
                    currentPage: page,
                    query: req.query,
                    tong_so_hoa_don: tong_so_hoa_don,
                    tong_tien: tong_tien,
                    tong_tien_da_thanh_toan, tong_tien_da_thanh_toan,
                    tong_so_hoa_don_payments_1: tong_so_hoa_don_payments_1,
                    tong_so_hoa_don_payments_2: tong_so_hoa_don_payments_2,
                    ti_le_thanh_toan: ti_le_thanh_toan
                });
            }

        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    } else if (req.method == 'POST') {
        try {
            // Lấy ID của bill từ req.body
            const billId = req.body.billId;
            // Lấy trạng thái mới từ req.body
            const newStatus = req.body.status;

            // Tìm bill bằng ID và cập nhật trạng thái
            await billMD.billModel.findByIdAndUpdate(billId, { status: newStatus });

            console.log(`PUT /bill 200/${billId} with status ${newStatus}`);

            res.redirect('back');
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }


}
exports.detail = async (req, res, next) => {
    let id = req.params.id;

    try {
        var bill = await billMD.billModel.findById(id)
            .populate('user_id')
            .populate({
                path: 'cart_id',
                populate: {
                    path: 'product_id',
                    populate: {
                        path: 'category_id'
                    }
                }
            })

    } catch (error) {

    }


    res.render('bill/detail', {
        title: title,
        heading: heading,
        bill: bill
    });

}



