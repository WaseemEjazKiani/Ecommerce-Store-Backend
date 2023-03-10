const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeatures");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")


exports.createProduct= catchAsyncErrors(async (req, res, next)=>{
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next)=>{

    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    const apiFeatures= new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()

    let product= await apiFeatures.query.clone();
    let filteredProductsCount = product.length;
    apiFeatures.pagination(resultPerPage);

    product= await apiFeatures.query;

    res.status(200).json({
        success: true,
        product,
        productCount,
        resultPerPage,
        filteredProductsCount
    })
});

exports.updateProducts = catchAsyncErrors(async (req , res , next)=>{

    let product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({
        success: true,
        product
    })
})

exports.deleteProduct = catchAsyncErrors(async(req, res , next)=>{

    const product = await Product.findById(req.params.id);
     
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }

    await product.remove();
    
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})


exports.getProductDetails = catchAsyncErrors(async(req, res , next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
        }
    
        res.status(200).json({
        success: true,
        product,
    });

});

exports.createReview = catchAsyncErrors(async(req, res , next)=>{

    const { rating, comment, productId} = req.body;
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating), 
            comment
        }

        const product = await Product.findById(productId);
        
        const isReveiwed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
            );

            if(isReveiwed){
                product.reviews.forEach(rev => {
                    if(rev.user.toString() === req.user._id.toString())
                    (rev.rating= rating), (rev.comment=comment)
                });
            } else{
                product.reviews.push(review);
                product.numOfReviews= product.reviews.length 
            }

            let avg = 0;
            product.reviews.forEach((rev) => {
                avg+=avg+rev.rating;
            });
            
            product.ratings= avg/product.reviews.length;

            await product.save({validateBeforeSave:false});

            res.status(200).json({
                success:true
            })
})


exports.getProductReviews = catchAsyncErrors(async(req, res , next)=>{

    const product = await Product.findById(req.query.productId);

    if(!product){
        return next( new ErrorHandler("Product Doesnot Exist",404));
    }

    res.status(201).json({
        success:"true",
        reviews: product.reviews
    })
})


exports.deleteReview = catchAsyncErrors(async(req, res , next)=>{

    const product = await Product.findById(req.query.productId);
    
    if(!product){
        return next( new ErrorHandler("Product Doesnot Exist",404));
    }
    
    const reviews= product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString() )
 
    console.log(reviews);
    let avg = 0;
            reviews.forEach((rev) => {
                avg+=avg+rev.rating;
            });
            const ratings = avg/reviews.length;
            const numOfReviews = reviews.length;

            product.ratings= ratings;
            product.numOfReviews= numOfReviews;
            product.reviews= reviews;

            await product.save();
            /* await Product.findByIdAndUpdate(req.query.productId,{
                ratings:ratings, 
                numOfReviews:numOfReviews, 
                reviews:reviews
            }) */
            

    res.status(201).json({
        success:"true",
        reviews: product.reviews
    })
})
















