const DietPlan = require("../models/DietPlan");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");
const fs = require('fs').promises;

// @desc    Create diet plan
// @route   POST /api/dietPlans
// @access  Creator
const createDietPlan = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      subtitle,
      category,
      description,
      duration,
      difficulty,
      planType,
      price,
      features,
      preview,
      detailedContent,
      tags
    } = req.body;

    let imageUrl = '';
    let imagePublicId = '';

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        console.log('Uploading file to Cloudinary:', req.file.filename, `(${(req.file.size / 1024 / 1024).toFixed(2)}MB)`);
        const uploadResult = await uploadToCloudinary(req.file, 'diet-plans');
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
        console.log('Successfully uploaded to Cloudinary:', uploadResult.public_id);
        
        // Delete the temporary file
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        // Delete the temporary file if upload fails
        if (req.file && req.file.path) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting temporary file:', unlinkError);
          }
        }
        res.status(400);
        throw new Error('Failed to upload image. Please try with a smaller image or different format.');
      }
    }

    const dietPlan = new DietPlan({
      creatorId: req.user.id,
      creatorName: req.user.name,
      name,
      subtitle,
      category,
      description,
      duration,
      difficulty,
      planType,
      price: planType === 'premium' ? price : 0,
      features: features ? features.split(',').map(f => f.trim()).filter(f => f) : [],
      preview,
      detailedContent: JSON.parse(detailedContent || '{}'),
      tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
      image: imageUrl,
      imagePublicId: imagePublicId
    });

    await dietPlan.save();
    console.log('Diet plan created successfully:', dietPlan.name);
    res.status(201).json(dietPlan);
  } catch (error) {
    console.error('Error in createDietPlan:', error);
    
    // Clean up uploaded file if something goes wrong
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }
    
    throw error;
  }
});

// @desc    Get creator's diet plans
// @route   GET /api/dietPlans/creator
// @access  Creator
const getCreatorDietPlans = asyncHandler(async (req, res) => {
  const plans = await DietPlan.find({ creatorId: req.user.id }).sort({ createdAt: -1 });
  res.json(plans);
});

// @desc    Get single diet plan for creator
// @route   GET /api/dietPlans/creator/:id
// @access  Creator
const getCreatorDietPlanById = asyncHandler(async (req, res) => {
  const plan = await DietPlan.findOne({
    _id: req.params.id,
    creatorId: req.user.id
  });
  
  if (!plan) {
    res.status(404);
    throw new Error("Diet plan not found");
  }
  
  res.json(plan);
});

// @desc    Update diet plan
// @route   PUT /api/dietPlans/:id
// @access  Creator
const updateDietPlan = asyncHandler(async (req, res) => {
  const {
    name,
    subtitle,
    category,
    description,
    duration,
    difficulty,
    planType,
    price,
    features,
    preview,
    detailedContent,
    tags
  } = req.body;

  const plan = await DietPlan.findOne({
    _id: req.params.id,
    creatorId: req.user.id
  });

  if (!plan) {
    res.status(404);
    throw new Error("Diet plan not found");
  }

  const updateData = {
    name,
    subtitle,
    category,
    description,
    duration,
    difficulty,
    planType,
    price: planType === 'premium' ? price : 0,
    features: features ? features.split(',') : [],
    preview,
    detailedContent: detailedContent ? JSON.parse(detailedContent) : undefined,
    tags: tags ? tags.split(',') : [],
    updatedAt: new Date()
  };

  // Handle new image upload
  if (req.file) {
    try {
      // Delete old image from Cloudinary if exists
      if (plan.imagePublicId) {
        await deleteFromCloudinary(plan.imagePublicId);
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file, 'diet-plans');
      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
      
      // Delete the temporary file
      await fs.unlink(req.file.path);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  const updatedPlan = await DietPlan.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(updatedPlan);
});

// @desc    Delete diet plan
// @route   DELETE /api/dietPlans/:id
// @access  Creator
const deleteDietPlan = asyncHandler(async (req, res) => {
  console.log('Delete request for plan ID:', req.params.id);
  console.log('Creator ID:', req.user.id);
  
  const plan = await DietPlan.findOne({
    _id: req.params.id,
    creatorId: req.user.id
  });

  if (!plan) {
    res.status(404);
    throw new Error("Diet plan not found or you don't have permission to delete it");
  }

  // Delete image from Cloudinary if exists
  if (plan.imagePublicId) {
    try {
      await deleteFromCloudinary(plan.imagePublicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }

  await DietPlan.findByIdAndDelete(req.params.id);

  res.json({ 
    message: "Diet plan deleted successfully",
    deletedPlan: plan.name
  });
});

// @desc    Publish/Unpublish diet plan
// @route   PUT /api/dietPlans/:id/publish
// @access  Creator
const togglePublishDietPlan = asyncHandler(async (req, res) => {
  const plan = await DietPlan.findOne({
    _id: req.params.id,
    creatorId: req.user.id
  });

  if (!plan) {
    res.status(404);
    throw new Error("Diet plan not found");
  }

  plan.isPublished = !plan.isPublished;
  plan.updatedAt = new Date();
  await plan.save();

  res.json({ 
    message: `Diet plan ${plan.isPublished ? 'published' : 'unpublished'} successfully`,
    isPublished: plan.isPublished
  });
});

// @desc    Get all published diet plans for users
// @route   GET /api/dietPlans/public
// @access  Public/User
const getPublishedDietPlans = asyncHandler(async (req, res) => {
  const { category, difficulty, planType, search } = req.query;
  
  let query = { isPublished: true };
  
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (planType) query.planType = planType;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const plans = await DietPlan.find(query)
    .select('-detailedContent.shoppingLists -detailedContent.mealPrepGuides -detailedContent.videoContent -detailedContent.personalizedMacros')
    .sort({ avgRating: -1, totalPurchases: -1 });

  // If user is logged in, track viewed plans
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $set: { lastViewedDietPlans: Date.now() }
    });
  }

  res.json(plans);
});

// @desc    Get single published diet plan
// @route   GET /api/dietPlans/public/:id
// @access  Public/User
const getPublishedDietPlanById = asyncHandler(async (req, res) => {
  const plan = await DietPlan.findOne({
    _id: req.params.id,
    isPublished: true
  });

  if (!plan) {
    res.status(404);
    throw new Error("Diet plan not found");
  }

  console.log('Plan found:', plan.name);
  console.log('User from request:', req.user ? req.user.name : 'No user');
  console.log('Plan type:', plan.planType);

  // If user is logged in, track that they viewed this plan
  if (req.user) {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { viewedDietPlans: plan._id }
      });
      console.log('Tracked view for user:', req.user.name);
    } catch (error) {
      console.error('Error tracking view:', error);
      // Don't throw error, just log it
    }
  }

  // Return limited data for regular plans, full data for premium if purchased
  let responseData = { ...plan.toObject() };
  
  if (plan.planType === 'premium') {
    if (req.user) {
      try {
        const user = await User.findById(req.user.id);
        const hasPurchased = user.purchasedDietPlans.some(p => p.planId.equals(plan._id));
        
        console.log('User has purchased plan:', hasPurchased);
        
        if (!hasPurchased) {
          // Remove premium content for non-purchasers
          if (responseData.detailedContent) {
            delete responseData.detailedContent.shoppingLists;
            delete responseData.detailedContent.mealPrepGuides;
            delete responseData.detailedContent.videoContent;
            delete responseData.detailedContent.personalizedMacros;
          }
          console.log('Removed premium content for non-purchaser');
        } else {
          console.log('User has purchased - returning full content');
        }
      } catch (error) {
        console.error('Error checking user purchase:', error);
        // If there's an error checking purchase, treat as non-purchased
        if (responseData.detailedContent) {
          delete responseData.detailedContent.shoppingLists;
          delete responseData.detailedContent.mealPrepGuides;
          delete responseData.detailedContent.videoContent;
          delete responseData.detailedContent.personalizedMacros;
        }
      }
    } else {
      // Remove premium content for non-logged users
      if (responseData.detailedContent) {
        delete responseData.detailedContent.shoppingLists;
        delete responseData.detailedContent.mealPrepGuides;
        delete responseData.detailedContent.videoContent;
        delete responseData.detailedContent.personalizedMacros;
      }
      console.log('No user logged in - removed premium content');
    }
  }

  res.json(responseData);
});

// @desc    Purchase diet plan
// @route   POST /api/dietPlans/:id/purchase
// @access  User
const purchaseDietPlan = asyncHandler(async (req, res) => {
  console.log('Purchase attempt - User:', req.user ? req.user.name : 'No user');
  console.log('Purchase attempt - Plan ID:', req.params.id);

  // Check if user is authenticated
  if (!req.user) {
    res.status(401);
    throw new Error("Please log in to purchase this diet plan");
  }

  const plan = await DietPlan.findOne({
    _id: req.params.id,
    isPublished: true
  });

  if (!plan) {
    res.status(404);
    throw new Error("Diet plan not found");
  }

  if (plan.planType === 'regular') {
    res.status(400);
    throw new Error("Regular plans are free to access");
  }

  const user = await User.findById(req.user.id);
  
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  
  // Check if already purchased
  const alreadyPurchased = user.purchasedDietPlans.some(p => p.planId.equals(plan._id));
  if (alreadyPurchased) {
    res.status(400);
    throw new Error("Diet plan already purchased");
  }

  console.log('Processing purchase for user:', user.name, 'Plan:', plan.name);

  // In a real app, you would process payment here
  // For now, we'll simulate a successful payment

  // Add plan to user's purchased plans
  user.purchasedDietPlans.push({
    planId: plan._id,
    purchasedAt: Date.now(),
    progress: 0,
    currentWeek: 1
  });

  await user.save();

  // Update plan's total purchases
  plan.totalPurchases += 1;
  await plan.save();

  console.log('Purchase completed successfully');

  res.json({
    message: "Diet plan purchased successfully",
    plan: {
      _id: plan._id,
      name: plan.name,
      subtitle: plan.subtitle,
      price: plan.price
    }
  });
});

// @desc    Rate diet plan
// @route   POST /api/dietPlans/:id/rate
// @access  User
const rateDietPlan = asyncHandler(async (req, res) => {
  const { stars, review } = req.body;
  
  if (!stars || stars < 1 || stars > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5 stars");
  }

  const plan = await DietPlan.findOne({
    _id: req.params.id,
    isPublished: true
  });

  if (!plan) {
    res.status(404);
    throw new Error("Diet plan not found");
  }

  // Check if user has purchased the plan (only purchasers can rate)
  const user = await User.findById(req.user.id);
  const hasPurchased = user.purchasedDietPlans.some(p => p.planId.equals(plan._id));
  
  if (!hasPurchased && plan.planType === 'premium') {
    res.status(403);
    throw new Error("You must purchase this plan to rate it");
  }

  // Check if user already rated
  const existingRating = plan.ratings.find(r => r.userId.equals(req.user.id));
  
  if (existingRating) {
    existingRating.stars = stars;
    existingRating.review = review;
  } else {
    plan.ratings.push({
      stars,
      review,
      userId: req.user.id
    });
  }

  await plan.save();
  res.json({ message: "Rating submitted successfully" });
});

// @desc    Check authentication status
// @route   GET /api/dietPlans/auth-status
// @access  User
const checkAuthStatus = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } else {
    res.status(401).json({
      isAuthenticated: false,
      message: 'Not authenticated'
    });
  }
});

module.exports = {
  createDietPlan,
  getCreatorDietPlans,
  getCreatorDietPlanById,
  updateDietPlan,
  deleteDietPlan,
  togglePublishDietPlan,
  getPublishedDietPlans,
  getPublishedDietPlanById,
  purchaseDietPlan,
  rateDietPlan,
  checkAuthStatus
};
