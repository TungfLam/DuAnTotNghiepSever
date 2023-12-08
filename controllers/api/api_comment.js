const mongoose = require('mongoose');
const mProduct = require('../../models/product.model');
const mUser = require('../../models/user.model');

exports.getCommentByProduct = async (req , res , next) => {
    let product_id = req.params.ProductId;
    let listComment = await mProduct.commentModel.find({product_id : product_id});
    res.status(200).json(listComment);
}




exports.newComment = async (req , res , next) => {
    let message = "";

    if(req.method == 'POST'){
        let product_id = req.body.ProductId;
        let user_id = req.body.UserId;
        let comment = req.body.Comment;
        let sRating = req.body.rating;

        let objProductChek = await mProduct.productModel.findById(product_id);
        let objUserChek = await mUser.userModel.findById(user_id);

        if(!objProductChek){
            message = "Product null";
        }else if(!objUserChek){
            message = "User null";
        }else if(isNaN(sRating)){
            message = "Rating is not a number";
        }else {
            let rating = Number(sRating);
            if(rating <= 0 || rating >= 6){
                message = "Rating illegal => (1|2|3|4|5)"
            }else{
                let newComment = new mProduct.commentModel();
                let currentDate = new Date();
                let sDate = currentDate.getFullYear() + "-" 
                    + (currentDate.getMonth() + 1) + "-"
                    + currentDate.getDate() + " "
                    + currentDate.getHours() + ":" + currentDate.getMinutes();
                
                newComment.product_id = product_id;
                newComment.user_id = user_id;
                newComment.comment = comment;
                newComment.rating = rating;
                newComment.date = sDate;

                try {
                    await newComment.save();
                    message = "Comment added";
                    err = false;
                    reStar(product_id);
                } catch (error) {
                    console.log("error : " + error);
                    message = "Add comment failed"
                }
            }
        }
    }

    res.status(200).json(
        { 
            message : message
        }   
    );
}


exports.updateComment = async (req , res , next) => {
    let message = "";   
    let err = true;

    if(req.method == 'PUT'){
        let comment_id = req.params.CommentId;
        let comment = req.body.Comment;
        let sRating = req.body.rating;

        let objComment = await mProduct.commentModel.findById(comment_id);

        if(!objComment){
            message = "Comment null";
        }else if(isNaN(sRating)){
            message = "Rating is not a number";
        }else {
            let rating = Number(sRating);
            if(rating <= 0 || rating >= 6){
                message = "Rating illegal => (1 -> 10)"
            }else{
                objComment.comment = comment;
                objComment.rating = rating;

                try {
                    await mProduct.commentModel.findByIdAndUpdate(comment_id , objComment);
                    message = "Comment update";
                    err = false;
                } catch (error) {
                    console.log("error : " + error);
                    message = "Update comment failed"
                }
            }
        }
    }

    res.status(200).json(
        { 
            err : err,
            message : message
        }   
    );
}

async function reStar(product_id){
    try {
        const result = await mProduct.commentModel.aggregate([
            {   
                $match : {"product_id" : new mongoose.Types.ObjectId(product_id)}
            },
            {
                $group : {_id : null, total : {$sum : "$rating"}}
            }
        ]);

        const countRating = await mProduct.commentModel.find({product_id : product_id}).count();
        
        let rating = parseInt(result[0].total / countRating) ;
        if(parseFloat(result[0].total / countRating) > parseInt(result[0].total / countRating) + 0.5){
            rating += 1;
        }

        let objProduct = await mProduct.productModel.findById(product_id);
        objProduct.rating = rating;

        try {
            await mProduct.productModel.findByIdAndUpdate(product_id , objProduct);
        } catch (error) {
            console.log("error : " + error);
        }

    } catch (error) {
        console.log(error);
    }

}