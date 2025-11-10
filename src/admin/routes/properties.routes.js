// src/admin/routes/properties.routes.js
import express from 'express';
import { query } from 'express-validator';
import {
  getAllProperties,
  getPropertyStats,
  getPropertyById,
  getPropertyRooms,
  getPropertyPhotos,
} from '../controllers/properties.controller.js';

const router = express.Router();

// Get all properties with filters
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().trim(),
    query('city').optional().trim(),
    query('status').optional().isIn(['Under Review', 'Accepted', 'Rejected']),
    query('propertyType').optional().trim(),
    query('sortBy').optional().isIn(['createdAt', 'basicPropertyDetails.name', 'status']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
  ],
  getAllProperties
);

// Get property statistics
router.get(
  '/stats',
  getPropertyStats
);

// Get property by id
router.get(
  '/:id',
  getPropertyById
);

// Get all rooms for a specific property with filters
router.get(
  '/:propertyId/rooms',
  getPropertyRooms
);

// Photo Management Routes

// Get all photos for a property
router.get(
  '/:propertyId/photos',
  getPropertyPhotos
);

export default router;