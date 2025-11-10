// src/admin/controllers/properties.controller.js
import Property from '../../models/property.model.js';
import PropertyRoom from '../../models/propertyRoom.model.js';
import mongoose from 'mongoose';
import { 
  calculatePropertyRatings, 
  getPropertyRoomCounts,
  getPropertiesByAmenities
} from '../../utils/propertyUtils.js';

// Dummy data for fallback
const dummyProperties = []; // Add your dummy properties array here if needed

// Helper function to handle errors
const handleError = (res, error, message = 'Server error') => {
  console.error(`${message}:`, error);
  return res.status(500).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Get all properties with filters
export const getAllProperties = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      city, 
      status,
      propertyType,
      minRating,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    // Build query
    if (search) {
      query['basicPropertyDetails.name'] = { $regex: search, $options: 'i' };
    }
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (status) {
      query.status = status;
    }
    if (propertyType) {
      query.propertyType = propertyType;
    }
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Get properties with pagination
    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'firstName lastName email phone')
        .lean(),
      Property.countDocuments(query)
    ]);

    // If no properties found, use dummy data
    if (properties.length === 0) {
      console.log('Using dummy properties data');
      // ... (keep your existing dummy data fallback)
    }

    // Get additional data
    const propertyIds = properties.map(p => p._id);
    const [roomCounts, propertyRatings] = await Promise.all([
      getPropertyRoomCounts(propertyIds),
      calculatePropertyRatings(propertyIds)
    ]);

    // Filter by minimum rating if specified
    let filteredProperties = properties;
    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      filteredProperties = properties.filter(property => {
        const rating = propertyRatings[property._id.toString()]?.rating || 0;
        return rating >= minRatingNum;
      });
    }

    // Enhance properties with additional data
    const enhancedProperties = filteredProperties.map(property => {
      const propertyId = property._id.toString();
      return {
        ...property,
        roomCount: roomCounts[propertyId] || 0,
        rating: propertyRatings[propertyId]?.rating || 0,
        totalRatings: propertyRatings[propertyId]?.totalRatings || 0
      };
    });

    res.status(200).json({
      success: true,
      data: enhancedProperties,
      pagination: {
        total: filteredProperties.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error in getAllProperties:', error);
    return handleError(res, error, 'Error fetching properties');
  }
};

// Get featured properties
export const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 4, amenities } = req.query;
    
    // Get featured properties
    let featured;
    if (amenities) {
      featured = await getPropertiesByAmenities(amenities, parseInt(limit));
    } else {
      featured = await Property.find({ isFeatured: true })
        .limit(parseInt(limit))
        .populate('userId', 'firstName lastName')
        .lean();
    }

    // Fallback to dummy data if no featured properties found
    if (!featured || featured.length === 0) {
      console.log('Using dummy featured properties');
      featured = dummyProperties
        .filter(p => p.isFeatured)
        .slice(0, parseInt(limit));
    }

    // Get additional data
    const propertyIds = featured.map(p => p._id);
    const [roomCounts, propertyRatings] = await Promise.all([
      getPropertyRoomCounts(propertyIds),
      calculatePropertyRatings(propertyIds)
    ]);

    // Enhance properties with additional data
    const enhancedProperties = featured.map(property => {
      const propertyId = property._id.toString();
      return {
        ...property,
        roomCount: roomCounts[propertyId] || 0,
        rating: propertyRatings[propertyId]?.rating || 0,
        totalRatings: propertyRatings[propertyId]?.totalRatings || 0
      };
    });

    res.status(200).json({
      success: true,
      data: enhancedProperties
    });

  } catch (error) {
    console.error('Error in getFeaturedProperties:', error);
    return handleError(res, error, 'Error fetching featured properties');
  }
};

// Get property statistics
export const getPropertyStats = async (req, res) => {
  try {
    const [
      totalProperties,
      propertiesByStatus,
      propertiesByType,
      propertiesByCity,
      recentProperties
    ] = await Promise.all([
      // Total properties count
      Property.countDocuments(),
      
      // Properties grouped by status
      Property.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Properties grouped by type
      Property.aggregate([
        { $group: { _id: '$propertyType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Properties grouped by city (top 5)
      Property.aggregate([
        { $group: { _id: '$location.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      
      // Recent properties
      Property.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('basicPropertyDetails.name location.city status createdAt')
        .populate('userId', 'firstName lastName')
        .lean()
    ]);

    // Get room counts and ratings for recent properties
    const recentPropertyIds = recentProperties.map(p => p._id);
    const [roomCounts, propertyRatings] = await Promise.all([
      getPropertyRoomCounts(recentPropertyIds),
      calculatePropertyRatings(recentPropertyIds)
    ]);

    // Enhance recent properties with room counts and ratings
    const enhancedRecentProperties = recentProperties.map(property => {
      const propertyId = property._id.toString();
      return {
        ...property,
        roomCount: roomCounts[propertyId] || 0,
        rating: propertyRatings[propertyId]?.rating || 0,
        totalRatings: propertyRatings[propertyId]?.totalRatings || 0
      };
    });

    // Prepare statistics object
    const stats = {
      totalProperties,
      propertiesByStatus,
      propertiesByType,
      propertiesByCity,
      recentProperties: enhancedRecentProperties
    };

    // Fallback to dummy data if no stats found
    if (totalProperties === 0) {
      console.log('Using dummy statistics data');
      // Add dummy data fallback here if needed
    }

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error in getPropertyStats:', error);
    return handleError(res, error, 'Error fetching property statistics');
  }
};

// Get property by id
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id).populate('userId', 'firstName lastName');
    const propertyRoom = await PropertyRoom.find({ propertyId: id });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, data: { property, propertyRoom } });
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    return handleError(res, error, 'Error fetching property by ID');
  }
};

// Get all room details for a specific property
export const getPropertyRooms = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { type, minPrice, maxPrice, amenities, sortBy = 'price.oneNight', sortOrder = 'asc' } = req.query;

    // Build query
    const query = { propertyId };
    
    // Add filters
    if (type) {
      query.type = { $in: Array.isArray(type) ? type : [type] };
    }
    
    if (minPrice || maxPrice) {
      query['price.oneNight'] = {};
      if (minPrice) query['price.oneNight'].$gte = Number(minPrice);
      if (maxPrice) query['price.oneNight'].$lte = Number(maxPrice);
    }
    
    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $all: amenitiesList };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch rooms with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      PropertyRoom.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      PropertyRoom.countDocuments(query)
    ]);

    // Get unique room types and amenities for filters
    const [roomTypes, allAmenities] = await Promise.all([
      PropertyRoom.distinct('type', { propertyId }),
      PropertyRoom.distinct('amenities', { propertyId })
    ]);

    // Get price range for all rooms
    const priceStats = await PropertyRoom.aggregate([
      { $match: { propertyId: new mongoose.Types.ObjectId(propertyId) } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price.oneNight' },
          maxPrice: { $max: '$price.oneNight' },
          avgPrice: { $avg: '$price.oneNight' }
        }
      }
    ]);

    // ----- NEW: totalRoom and occupancyRate -----
    // totalRoom: total rooms for the property (ignores filters)
    const totalRoom = await PropertyRoom.countDocuments({ propertyId });

    // occupancyRate: percentage of rooms currently occupied.
    // Assumes a Booking model exists. Adjust model/fields if different.
    let occupancyRate = 0;
    try {
      const now = new Date();

      // Find distinct roomIds that are currently occupied.
      // Adjust status values if you use different naming.
      const occupiedRoomIds = await Booking.distinct('roomId', {
        propertyId,
        status: { $in: ['BOOKED', 'CHECKED_IN'] },
        checkIn: { $lte: now },
        checkOut: { $gte: now }
      });

      const occupiedRoomsCount = occupiedRoomIds.length;

      occupancyRate = totalRoom > 0
        ? Math.round((occupiedRoomsCount / totalRoom) * 100 * 100) / 100 // two decimals
        : 0;
    } catch (bookErr) {
      // If Booking model doesn't exist or query fails, keep occupancyRate = 0
      console.warn('Could not calculate occupancy rate:', bookErr);
      occupancyRate = 0;
    }
    // --------------------------------------------

    // Format response
    const response = {
      success: true,
      data: {
        rooms,
        totalRoom,            // <-- added
        occupancyRate,        // <-- added (percentage)
        filters: {
          roomTypes,
          amenities: [...new Set(allAmenities.flat())].filter(Boolean).sort(),
          priceRange: priceStats.length > 0 ? {
            min: priceStats[0].minPrice,
            max: priceStats[0].maxPrice,
            avg: Math.round(priceStats[0].avgPrice * 100) / 100
          } : { min: 0, max: 0, avg: 0 }
        },
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error in getPropertyRooms:', error);
    return handleError(res, error, 'Error fetching property rooms');
  }
};

// Get all photos for a property
export const getPropertyPhotos = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const property = await Property.findById(propertyId)
      .select('photos')
      .lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        propertyId,
        photos: property.photos || []
      }
    });

  } catch (error) {
    console.error('Error in getPropertyPhotos:', error);
    return handleError(res, error, 'Error fetching property photos');
  }
};