# Admin API Reference

Base URL: http://localhost:3000
Base Path: /api/admin

## Dashboard & Overview

- Method: GET
  - URL: /api/admin/overview
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "header": {
          "totalBookings": 1234,
          "totalRevenue": 4511000,
          "activeUsers": 8426,
          "pendingVerifications": 42
        },
        "revenueTrends": {
          "period": { "from": "2025-12-16T00:00:00.000Z", "to": "2025-12-22T23:59:59.999Z" },
          "interval": "daily",
          "series": [
            { "date": "2025-12-16", "amount": 65000 },
            { "date": "2025-12-17", "amount": 61000 },
            { "date": "2025-12-18", "amount": 72000 },
            { "date": "2025-12-19", "amount": 83000 },
            { "date": "2025-12-20", "amount": 91000 },
            { "date": "2025-12-21", "amount": 98000 },
            { "date": "2025-12-22", "amount": 93000 }
          ],
          "averageDaily": 76142,
          "peakDay": { "date": "2025-12-21", "amount": 98000 },
          "total7Days": 532000
        },
        "quickActions": {
          "pendingVerifications": 42,
          "withdrawalRequests": 5,
          "failedBookings": 13,
          "newHotelListings": 3
        },
        "recentActivity": [
          { "type": "booking", "id": "b1", "status": "Completed", "amount": 8200, "createdAt": "2025-12-22T09:40:00.000Z" },
          { "type": "property", "id": "p1", "title": "Hotel Sunrise", "status": "New", "createdAt": "2025-12-22T09:20:00.000Z" },
          { "type": "settlement", "id": "stl_8347", "status": "processing", "amount": 5200, "createdAt": "2025-12-22T08:55:00.000Z" }
        ],
        "kpis": {
          "hourlyBookings": 324,
          "goLiveHotels": 156,
          "avgCommission": 12.5
        }
      }
    }

- Method: GET
  - URL: /api/admin/guests/:id/activity?page=1&limit=20
  - Description: Paginated recent activity timeline for a single guest (login, booking, wallet, referral, etc.).
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 4,
      "total": 28,
      "page": 1,
      "limit": 20,
      "data": [
        { "type": "login", "description": "Logged in from Mumbai", "meta": { "ip": "1.2.3.4" }, "createdAt": "2025-01-15T11:20:00.000Z" },
        { "type": "booking", "description": "Completed booking at Hotel Taj", "meta": { "bookingId": "b123" }, "createdAt": "2025-01-14T09:00:00.000Z" },
        { "type": "wallet", "description": "Added funds to wallet", "meta": { "amount": 1000 }, "createdAt": "2025-01-13T10:00:00.000Z" },
        { "type": "referral", "description": "Referred new user", "meta": { "refereeId": "u_101" }, "createdAt": "2025-01-12T15:00:00.000Z" }
      ]
    }

- Method: GET
  - URL: /api/admin/guests/:id/searches?page=1&limit=10
  - Description: Paginated list of recent searches by the guest with tags and timestamps.
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 4,
      "total": 12,
      "page": 1,
      "limit": 10,
      "data": [
        { "query": "Hotels in Mumbai", "tags": ["Luxury", "5-star", "location:Mumbai"], "createdAt": "2025-01-15T11:20:00.000Z" },
        { "query": "Budget hotels near Airport", "tags": ["Budget", "near:Airport", "location:Mumbai"], "createdAt": "2025-01-14T09:00:00.000Z" },
        { "query": "Hourly booking Delhi", "tags": ["Hourly", "location:Delhi NCR"], "createdAt": "2025-01-13T10:00:00.000Z" },
        { "query": "Hotels with pool in Goa", "tags": ["Luxury", "Pool", "location:Goa"], "createdAt": "2025-01-12T15:00:00.000Z" }
      ]
    }

- Method: GET
  - URL: /api/admin/guests/:id/searches/preferences
  - Description: Derived search preferences based on guest's search history (locations, price range, rating, booking type).
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "preferredLocations": ["Mumbai", "Delhi", "Goa"],
        "priceRange": "₹2,000 – ₹10,000",
        "preferredRating": "4+ Stars",
        "bookingType": "Mostly Luxury"
      }
    }

- Method: GET
  - URL: /api/admin/guests/:id/favorites/summary
  - Description: Get summary statistics about guest's favorite properties including total count, top tags, price range, and most recent favorite.
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "totalFavorites": 8,
        "topTags": [
          { "name": "Luxury", "count": 4 },
          { "name": "Beachfront", "count": 3 },
          { "name": "Business", "count": 2 },
          { "name": "Resort", "count": 2 },
          { "name": "Weekend Getaway", "count": 1 }
        ],
        "priceRange": {
          "min": 3500,
          "max": 25000,
          "avg": 12000
        },
        "mostRecent": {
          "propertyId": "6612a1b2c3d4e5f6a7b8c9d1",
          "propertyName": "Taj Lands End",
          "city": "Mumbai",
          "addedAt": "2025-11-03T14:30:00.000Z"
        },
        "demo": true  // Only present when using demo data
      }
    }

- Method: GET
  - URL: /api/admin/guests/:id/favorites?page=1&limit=10&sort=recent|price_asc|price_desc&tag=beachfront&search=mumbai&status=active&minPrice=1000&maxPrice=10000
  - Query Parameters:
    - page: Page number (default: 1)
    - limit: Items per page (default: 10)
    - sort: Sort order - 'recent' (default), 'price_asc', or 'price_desc'
    - tag: Filter by tag (e.g., 'beachfront', 'luxury')
    - search: Search in property name, city, or locality
    - status: Filter by property status (e.g., 'active', 'soldout')
    - minPrice/maxPrice: Filter by price range
  - Description: Get paginated list of guest's favorite properties with filtering and sorting options.
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 2,
      "total": 8,
      "page": 1,
      "limit": 10,
      "data": [
        {
          "_id": "6612a1b2c3d4e5f6a7b8c9d1",
          "propertyId": "6612a1b2c3d4e5f6a7b8c9d1",
          "property": {
            "_id": "6612a1b2c3d4e5f6a7b8c9d1",
            "name": "Taj Lands End",
            "thumbnail": "https://example.com/taj-lands-end.jpg",
            "city": "Mumbai",
            "locality": "Bandra West",
            "price": 15000,
            "rating": 4.8,
            "status": "active"
          },
          "addedAt": "2025-11-03T14:30:00.000Z",
          "notes": "Perfect for weekend getaway",
          "tags": ["Luxury", "Beachfront"]
        },
        {
          "_id": "6612a1b2c3d4e5f6a7b8c9d2",
          "propertyId": "6612a1b2c3d4e5f6a7b8c9d2",
          "property": {
            "_id": "6612a1b2c3d4e5f6a7b8c9d2",
            "name": "ITC Grand Chola",
            "thumbnail": "https://example.com/itc-grand-chola.jpg",
            "city": "Chennai",
            "locality": "Guindy",
            "price": 12000,
            "rating": 4.7,
            "status": "active"
          },
          "addedAt": "2025-10-31T10:15:00.000Z",
          "notes": "Great business hotel",
          "tags": ["Business", "Luxury"]
        }
      ]
    }

- Method: GET
  - URL: /api/admin/guests/:id/referrals/summary
  - Description: Referral header metrics for the Referrals tab (code, totals, active, earnings).
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "referralCode": "RAHUL2024",
        "totalReferrals": 12,
        "activeReferrals": 9,
        "earnings": 15000
      }
    }

- Method: GET
  - URL: /api/admin/guests/:id/referrals?page=1&limit=10
  - Description: Paginated genealogy (Level 1) of referees with join date and earned amount.
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 3,
      "total": 12,
      "page": 1,
      "limit": 10,
      "data": [
        {
          "referee": { "_id": "u_101", "firstName": "User", "lastName": "One", "phone": "9999990001", "createdAt": "2024-12-16T08:00:00.000Z" },
          "status": "Active",
          "rewardAmount": 500,
          "joinedAt": "2024-12-16T08:00:00.000Z",
          "createdAt": "2024-12-16T08:00:00.000Z"
        },
        {
          "referee": { "_id": "u_102", "firstName": "User", "lastName": "Two", "phone": "9999990002", "createdAt": "2024-12-17T08:00:00.000Z" },
          "status": "Active",
          "rewardAmount": 500,
          "joinedAt": "2024-12-17T08:00:00.000Z",
          "createdAt": "2024-12-17T08:00:00.000Z"
        },
        {
          "referee": { "_id": "u_103", "firstName": "User", "lastName": "Three", "phone": "9999990003", "createdAt": "2024-12-18T08:00:00.000Z" },
          "status": "Pending",
          "rewardAmount": 500,
          "joinedAt": "2024-12-18T08:00:00.000Z",
          "createdAt": "2024-12-18T08:00:00.000Z"
        }
      ]
    }

- Method: GET
  - URL: /api/admin/guests/:id/bookings/summary
  - Description: Booking analytics for a single guest used in the Bookings tab (cards, timeline, preferred types, frequency).
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "avgBookingValue": 7300,
        "cancellationRate": 8.5,
        "monthlyFrequency": 4.8,
        "totalBookings": 45,
        "timeline": {
          "upcoming": 2,
          "ongoing": 1,
          "completed": 38,
          "cancelled": 4
        },
        "preferredTypes": [
          { "type": "Budget", "percent": 40 },
          { "type": "Luxury", "percent": 35 },
          { "type": "Hourly Booking", "percent": 25 }
        ],
        "frequency": {
          "dailyAvg": 0.15,
          "weeklyAvg": 1.2,
          "monthlyAvg": 4.8
        }
      }
    }

- Method: GET
  - URL: /api/admin/guests/:id/bookings?page=1&limit=10
  - Description: Paginated recent bookings list for a single guest.
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 6,
      "total": 45,
      "page": 1,
      "limit": 10,
      "data": [
        { "status": "Booked", "priceSummary": { "totalAmount": 12500 }, "stayDetails": { "roomType": "Luxury", "checkInDate": "2025-01-15T10:00:00.000Z" }, "propertyId": "p_oberoi", "createdAt": "2025-01-10T08:30:00.000Z" },
        { "status": "CheckIn", "priceSummary": { "totalAmount": 3500 }, "stayDetails": { "roomType": "Budget", "checkInDate": "2025-01-10T12:00:00.000Z" }, "propertyId": "p_taj", "createdAt": "2025-01-08T11:00:00.000Z" },
        { "status": "CheckOut", "priceSummary": { "totalAmount": 3850 }, "stayDetails": { "roomType": "Budget", "checkInDate": "2024-12-15T09:00:00.000Z" }, "propertyId": "p_sunrise", "createdAt": "2024-12-12T07:45:00.000Z" },
        { "status": "CheckOut", "priceSummary": { "totalAmount": 21500 }, "stayDetails": { "roomType": "Luxury", "checkInDate": "2024-12-10T13:00:00.000Z" }, "propertyId": "p_lux", "createdAt": "2024-12-08T09:20:00.000Z" },
        { "status": "Cancel", "priceSummary": { "totalAmount": 2500 }, "stayDetails": { "roomType": "Budget", "checkInDate": "2024-12-05T11:00:00.000Z" }, "propertyId": "p_budget", "createdAt": "2024-12-04T10:10:00.000Z" },
        { "status": "CheckOut", "priceSummary": { "totalAmount": 1800 }, "stayDetails": { "roomType": "Hourly", "checkInDate": "2024-12-03T16:00:00.000Z" }, "propertyId": "p_quick", "createdAt": "2024-12-02T15:00:00.000Z" }
      ]
    }

### Offers

- Method: GET
  - URL: /api/admin/guests/:id/offers/summary
  - Description: Get summary statistics about guest's offers including total count, active offers, and distribution by type.
  - Query Parameters: None
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "totalOffers": 5,
        "activeOffers": 2,
        "recentOffer": {
          "title": "Summer Special 25% Off",
          "discountType": "percentage",
          "discountValue": 25,
          "validUntil": "2025-08-31T23:59:59.999Z",
          "isActive": true
        },
        "offersByType": {
          "percentage": 3,
          "fixed": 1,
          "free_night": 1
        },
        "demo": true
      }
    }
    ```

- Method: GET
  - URL: /api/admin/guests/:id/offers
  - Description: Get paginated list of guest's offers with filtering and sorting options.
  - Query Parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `status`: Filter by status - 'all', 'active', 'expired', 'upcoming' (default: 'all')
    - `type`: Filter by offer type - 'percentage', 'fixed', 'free_night'
    - `sort`: Sort order - 'recent' (default), 'oldest', 'highest_discount', 'lowest_discount'
  - Response:
    ```json
    {
      "success": true,
      "count": 2,
      "total": 5,
      "page": 1,
      "limit": 10,
      "data": [
        {
          "_id": "6612a1b2c3d4e5f6a7b8c9d1",
          "title": "Summer Special 25% Off",
          "description": "Get 25% off on all bookings for summer season",
          "discountType": "percentage",
          "discountValue": 25,
          "minStay": 2,
          "minAmount": 0,
          "validFrom": "2025-05-01T00:00:00.000Z",
          "validUntil": "2025-08-31T23:59:59.999Z",
          "promoCode": "SUMMER25",
          "isActive": true,
          "usedCount": 3,
          "usageLimit": 50,
          "isCurrentlyActive": true
        },
        {
          "_id": "6612a1b2c3d4e5f6a7b8c9d2",
          "title": "Weekend Getaway - Flat ₹2000 Off",
          "description": "Flat ₹2000 off on weekend bookings",
          "discountType": "fixed",
          "discountValue": 2000,
          "minStay": 1,
          "minAmount": 5000,
          "validFrom": "2025-04-01T00:00:00.000Z",
          "validUntil": "2025-12-31T23:59:59.999Z",
          "promoCode": "WEEKEND2K",
          "isActive": true,
          "usedCount": 12,
          "usageLimit": 100,
          "isCurrentlyActive": true
        }
      ],
      "demo": true
    }
    ```

### App Usage

- **Get Guest App Usage Summary**
  - Method: GET
  - URL: /api/admin/guests/:id/app-usage/summary
  - Description: Get comprehensive analytics about guest's app usage including session statistics, most used screens, device distribution, and usage trends.
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "summary": {
          "totalSessions": 42,
          "sessions7Days": 12,
          "sessions30Days": 42,
          "avgSessionDuration": 325,
          "maxSessionDuration": 1280,
          "minSessionDuration": 45,
          "lastActive": "2025-12-22T12:30:45.000Z"
        },
        "mostUsedScreens": [
          { "name": "Home", "duration": 4560, "count": 15 },
          { "name": "Search", "duration": 3240, "count": 12 },
          { "name": "Property Details", "duration": 2870, "count": 8 },
          { "name": "Bookings", "duration": 1840, "count": 5 },
          { "name": "Profile", "duration": 920, "count": 2 }
        ],
        "deviceDistribution": [
          { "platform": "android", "count": 28, "percentage": 66.67 },
          { "platform": "ios", "count": 12, "percentage": 28.57 },
          { "platform": "web", "count": 2, "percentage": 4.76 }
        ],
        "usageTrend": [
          { "date": "2025-12-16", "sessions": 5 },
          { "date": "2025-12-17", "sessions": 7 },
          { "date": "2025-12-18", "sessions": 4 },
          { "date": "2025-12-19", "sessions": 8 },
          { "date": "2025-12-20", "sessions": 6 },
          { "date": "2025-12-21", "sessions": 9 },
          { "date": "2025-12-22", "sessions": 3 }
        ],
        "demo": true
      }
    }
    ```

- **Get Guest App Usage Logs**
  - Method: GET
  - URL: /api/admin/guests/:id/app-usage/logs
  - Description: Get detailed logs of guest's app usage sessions with filtering and pagination.
  - Query Parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `startDate`: Filter sessions after this date (ISO format)
    - `endDate`: Filter sessions before this date (ISO format)
    - `platform`: Filter by platform (android, ios, web)
    - `minDuration`: Filter by minimum session duration in seconds
    - `maxDuration`: Filter by maximum session duration in seconds
  - Response:
    ```json
    {
      "success": true,
      "count": 5,
      "total": 42,
      "page": 1,
      "limit": 10,
      "data": [
        {
          "_id": "5f8d7a6d4d8e1f2b3c4d5e6f",
          "sessionId": "sess_abc123xyz",
          "deviceInfo": {
            "platform": "ios",
            "osVersion": "15.2.1",
            "appVersion": "2.3.0",
            "deviceModel": "iPhone 13 Pro"
          },
          "startTime": "2025-12-22T12:30:45.000Z",
          "endTime": "2025-12-22T12:52:30.000Z",
          "duration": 1305,
          "screens": [
            {
              "name": "Home",
              "startTime": "2025-12-22T12:30:45.000Z",
              "endTime": "2025-12-22T12:35:10.000Z",
              "duration": 265
            },
            {
              "name": "Search",
              "startTime": "2025-12-22T12:35:10.000Z",
              "endTime": "2025-12-22T12:52:30.000Z",
              "duration": 1040
            }
          ],
          "actions": [
            {
              "type": "screen_view",
              "name": "Home",
              "timestamp": "2025-12-22T12:30:45.000Z"
            },
            {
              "type": "button_click",
              "name": "Search",
              "timestamp": "2025-12-22T12:35:10.000Z"
            }
          ],
          "networkType": "wifi",
          "appState": {
            "isBackground": false,
            "isActive": true
          },
          "ipAddress": "192.168.1.100",
          "location": {
            "type": "Point",
            "coordinates": [72.8777, 19.0760]
          },
          "createdAt": "2025-12-22T12:30:45.000Z",
          "demo": true
        }
      ]
    }
    ```

### Guest Detail

- Method: GET
  - URL: /api/admin/guests/:id
  - Description: Guest profile header for the detail modal with verification and aggregate stats.
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "user": {
          "_id": "u1",
          "firstName": "Rahul",
          "lastName": "Sharma",
          "phone": "9876543210",
          "role": "customer",
          "isVerified": true,
          "status": "active",
          "createdAt": "2024-01-15T10:00:00.000Z"
        },
        "verification": {
          "phoneVerified": true
        },
        "stats": {
          "totalBookings": 45,
          "totalSpent": 125000,
          "reviews": 12
        }
      }
    }

## Guests Management

- Method: GET
  - URL: /api/admin/guests/stats
  - Description: Returns top-card counters for Guests Management (total, active, inactive, suspended, verified, unverified).
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "total": 8426,
        "active": 7892,
        "inactive": 412,
        "suspended": 122,
        "verified": 6234,
        "unverified": 2192
      }
    }

- Method: GET
  - URL: /api/admin/guests?search=rahul&status=Active&kyc=Verified&page=1&limit=20
  - Description: Guests list (role=customer) with search and filters for status and KYC.
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 2,
      "total": 200,
      "page": 1,
      "limit": 20,
      "data": [
        {
          "firstName": "Rahul",
          "lastName": "Sharma",
          "phone": "9876543210",
          "role": "customer",
          "isVerified": true,
          "status": "active",
          "createdAt": "2025-12-22T09:00:00.000Z"
        },
        {
          "firstName": "Priya",
          "lastName": "Patel",
          "phone": "9876543211",
          "role": "customer",
          "isVerified": true,
          "status": "active",
          "createdAt": "2025-12-21T14:12:00.000Z"
        }
      ]
    }
