const Comment = require('../models/commentModel');


exports.getCommentsById = async(req, res) => {
    await Comment.find({productId: req.params.id}).populate('user').exec((err, result) => {
        if(result) {
            return res.status(200).json({result});
        }
         else {
            return res.status(404).json({errorMessage: 'No Comments found'});
         }
    });  
}

exports.getVenderReviewsById = async(req, res) => {
    await Comment.find({vendorId: req.params.id, responseTo: null}).populate('user productId').exec((err, result) => {
        if(result) {
             res.status(200).json(result);
        }
         else {
             res.status(404).json({errorMessage: 'No Comments found'});
         }
    });  
}

exports.getUserReviewsById = async(req, res) => {
    await Comment.find({user: req.params.id}).populate('productId').exec((err, result) => {
        if(result) {
            return res.status(200).json(result);
        }
         else {
            return res.status(404).json({errorMessage: 'No Comments found'});
         }
    });  
}

exports.postComment = async (req, res) => {
    const newComment = new Comment({
      text: req.body.commentValue,
      user: req.user._id,
      productId: req.body.productId,
      vendorId: req.body.vendorId,
      responseTo: req.body.responseTo,
      timeOfSubmit: req.body.timeOfSubmit,
      rating: req.body.rating
    });
    await newComment.save((error, saved) => {
        if(error) {
            return res.status(400).json({errorMessage: 'comments posting error', error});
          }
          if(saved) {
             Comment.findOne({_id: saved._id}).populate('user').exec((err, result) => {
              if(result) {
                  return res.status(200).json({result});
              }
               else {
                  return res.status(404).json({errorMessage: 'No Comments found'});
               }
              });
          }
    })
}


exports.deleteComment =  async(req, res) => {
    Comment.findOneAndDelete({productId: req.body.productId, _id: req.body.commentId, user: req.user._id}).exec((error, result) => {
        if(error) res.status(400).json({errorMessage: 'Failed to delete Comment'});
         else {
            res.status(200).send({result});
         }
    })   
}
