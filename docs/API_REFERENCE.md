# justStay API Reference

This document lists the implemented APIs with method, endpoint, minimal payload, and sample response.

Base URL: http://localhost:3000

Note: Auth guards are mostly open in current routes. Add `protect/authorizeRoles` later if required.

## Profile
- Method: GET
  - URL: /api/profile?userId=<USER_ID>
  - Payload: {}
  - Response:
    {"success":true,"data":{"user":{...},"property":{...}}}

- Method: PUT
  - URL: /api/profile
  - Payload:
    {"userId":"<USER_ID>","firstName":"Hotel","lastName":"Owner","phone":"...","email":"...","avatar":"..."}
  - Response:
    {"success":true,"message":"Profile updated","data":{...}}

- Method: PUT
  - URL: /api/profile/property/:id
  - Payload:
    {"name":"Hotel","phone":"...","email":"...","logo":"uploads/hotel/logo.png"}
  - Response:
    {"success":true,"message":"Property updated","data":{...}}

- Method: GET
  - URL: /api/profile/summary?userId=<USER_ID>
  - Payload: {}
  - Response:
    {"success":true,"data":{"bookings":0,"rooms":0,"reviews":0,"supportTickets":0}}

## Reviews
- Method: POST
  - URL: /api/reviews
  - Payload:
    {"userId":"...","propertyId":"...","roomId":"...","bookingId":"...","rating":5,"comment":"...","images":[]}
  - Response: {"success":true,"data":{...}}

- Method: GET
  - URL: /api/reviews
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 1,
      "total": 1,
      "data": [
        {
          "_id": "rev_1",
          "userId": "u1",
          "propertyId": "p1",
          "roomId": "r1",
          "bookingId": "b1",
          "rating": 5,
          "comment": "Great stay!",
          "images": ["uploads/reviews/r1.jpg"],
          "reply": { "message": "Thank you!", "repliedBy": "admin1", "repliedAt": "2025-11-02T10:00:00.000Z" },
          "isPublished": true,
          "createdAt": "2025-11-01T12:30:00.000Z"
        }
      ]
    }

- Method: GET
  - URL: /api/reviews/:id
  - Payload: {}
  - Response: {"success":true,"data":{...}}

- Method: POST
  - URL: /api/reviews/:id/reply
  - Payload:
    {"message":"Thanks","repliedBy":"<USER_ID>"}
  - Response: {"success":true,"message":"Replied", "data":{...}}

- Method: DELETE
  - URL: /api/reviews/:id
  - Payload: {}
  - Response: {"success":true,"message":"Review deleted successfully"}

## Rooms: Pricing & Promotions (PropertyRoom)
- Method: GET
  - URL: /api/rooms/:id/pricing
  - Payload: {}
  - Response: {"success":true,"data":{"price":{...},"discounts":{...},"promo":{...}}}

- Method: PUT
  - URL: /api/rooms/:id/pricing
  - Payload:
    {"price":{"oneNight":3600,"threeHours":1300,"sixHours":2100},"discounts":{"oneNightPercent":5},"promo":{"code":"WELCOME5","discountPercent":5,"isActive":true}}
  - Response: {"success":true,"message":"Pricing & promotions updated","data":{...}}

- Method: PATCH
  - URL: /api/rooms/:id/price
  - Payload: {"oneNight":3800,"threeHours":1400,"sixHours":2200}
  - Response: {"success":true,"message":"Price updated","data":{...}}

- Method: PATCH
  - URL: /api/rooms/:id/discounts
  - Payload: {"oneNightPercent":10,"threeHoursPercent":0,"sixHoursPercent":10}
  - Response: {"success":true,"message":"Discounts updated","data":{...}}

- Method: PUT
  - URL: /api/rooms/:id/promo
  - Payload: {"code":"NEWYEAR20","discountPercent":20,"isActive":true}
  - Response: {"success":true,"message":"Promo updated","data":{...}}

- Method: PATCH
  - URL: /api/rooms/bulk/pricing
  - Payload:
    {"roomIds":["..."],"price":{"oneNight":4000},"discounts":{"oneNightPercent":5}}
  - Response: {"success":true,"message":"Bulk update applied","data":{"matched":0,"modified":0}}

## Cancellations & Refunds
- Method: POST
  - URL: /api/cancellations
  - Payload:
    {"bookingId":"...","userId":"...","propertyId":"...","reason":"...","priceSummary":{"totalPaid":8480},"calculation":{"cancellationFee":0,"refundableAmount":8480}}
  - Response: {"success":true,"message":"Cancellation initiated","data":{...}}

- Method: GET
  - URL: /api/cancellations
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 1,
      "total": 1,
      "data": [
        {
          "_id": "cxl1",
          "bookingId": { "_id": "b1", "status": "Booked" },
          "userId": { "_id": "u1", "firstName": "Hotel" },
          "propertyId": { "_id": "p1" },
          "status": "Initiated",
          "reason": "Change of plans",
          "priceSummary": { "basePrice": 12480, "discount": 5480, "taxAndFees": 1480, "totalPaid": 8480 },
          "calculation": { "cancellationFee": 0, "refundableAmount": 8480 },
          "createdAt": "2025-12-22T09:00:00.000Z"
        }
      ]
    }

- Method: GET
  - URL: /api/cancellations/:id
  - Payload: {}
  - Response: {"success":true,"data":{...}}

- Method: POST
  - URL: /api/cancellations/:id/review
  - Payload: {"reviewerId":"...","action":"approve","cancellationFee":0,"refundableAmount":8480,"notes":"..."}
  - Response: {"success":true,"message":"Cancellation approved","data":{...}}

- Method: POST
  - URL: /api/cancellations/:id/refund/initiate
  - Payload: {"operatorId":"...","method":"Original","transactionId":"PG-TXN-001"}
  - Response: {"success":true,"message":"Refund initiated","data":{...}}

- Method: POST
  - URL: /api/cancellations/:id/refund/complete
  - Payload: {"operatorId":"...","transactionId":"PG-TXN-001"}
  - Response: {"success":true,"message":"Refund completed","data":{...}}

- Method: PATCH
  - URL: /api/cancellations/:id/calc
  - Payload: {"cancellationFee":500,"refundableAmount":7980}
  - Response: {"success":true,"message":"Calculation updated","data":{...}}

## Inventory
- Method: GET
  - URL: /api/inventory/calendar?roomId=<ROOM_ID>&month=YYYY-MM
  - Payload: {}
  - Response: {"success":true,"meta":{...},"data":[{"roomId":"...","days":[{"date":"YYYY-MM-DD","allotment":5,"open":true}]}]}

- Method: PUT
  - URL: /api/inventory/day/:roomId/:date
  - Payload: {"allotment":5,"open":true,"stopSell":false}
  - Response: {"success":true,"message":"Inventory upserted","data":{...}}

- Method: PATCH
  - URL: /api/inventory/bulk
  - Payload: {"roomIds":["..."],"dateFrom":"YYYY-MM-DD","dateTo":"YYYY-MM-DD","allotment":5,"open":true}
  - Response: {"success":true,"message":"Inventory updated","data":{"affected":0}}

- Method: POST
  - URL: /api/inventory/toggle
  - Payload: {"roomIds":["..."],"dateFrom":"YYYY-MM-DD","dateTo":"YYYY-MM-DD","open":true}
  - Response: {"success":true,"message":"Open/close updated","data":{"matched":0,"modified":0}}

- Method: POST
  - URL: /api/inventory/save
  - Payload: {"inventory":[{"roomId":"...","date":"YYYY-MM-DD","allotment":5,"open":true}],"rates":[]}
  - Response: {"success":true,"message":"Changes saved","data":{"inventoryUpserts":0,"rateUpserts":0}}

## Rates
- Method: GET
  - URL: /api/rates/calendar?roomId=<ROOM_ID>&month=YYYY-MM&plans=RO,CP
  - Payload: {}
  - Response: {"success":true,"meta":{...},"data":[{"roomId":"...","days":[{"date":"YYYY-MM-DD","plans":{"RO":{"price":1200}}}]}]}

- Method: PUT
  - URL: /api/rates/day/:roomId/:date/:plan
  - Payload: {"price":1200,"extraAdultPrice":400,"extraChildPrice":200,"overrideLevel":"override"}
  - Response: {"success":true,"message":"Rate upserted","data":{...}}

- Method: PATCH
  - URL: /api/rates/bulk
  - Payload: {"roomIds":["..."],"plans":["RO","CP"],"dateFrom":"YYYY-MM-DD","dateTo":"YYYY-MM-DD","price":1200,"overrideLevel":"override"}
  - Response: {"success":true,"message":"Rates updated","data":{"affected":0}}

- Method: GET
  - URL: /api/rates/room/:roomId?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
  - Payload: {}
  - Response: {"success":true,"data":[{"date":"YYYY-MM-DD","plan":"RO","price":1200}]}

- Method: DELETE
  - URL: /api/rates/day/:roomId/:date/:plan?overrideLevel=override
  - Payload: {}
  - Response: {"success":true,"message":"Rate override deleted"}

## Notifications
- Method: POST
  - URL: /api/notifications
  - Payload: {"userId":"...","title":"New Booking","message":"...","type":"booking","link":"/bookings/.."}
  - Response: {"success":true,"message":"Notification created","data":{...}}

- Method: GET
  - URL: /api/notifications?userId=<USER_ID>&isRead=false
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 2,
      "total": 2,
      "data": [
        { "_id": "n1", "title": "New Booking Received", "message": "Room #301 booked by Rajesh Kumar", "type": "booking", "isRead": false, "createdAt": "2025-12-22T09:10:00.000Z" },
        { "_id": "n2", "title": "Settlement Processed", "message": "₹5,200 settled to your account", "type": "settlement", "isRead": false, "createdAt": "2025-12-22T11:30:00.000Z" }
      ]
    }

- Method: GET
  - URL: /api/notifications/:id
  - Payload: {}
  - Response: {"success":true,"data":{...}}

- Method: POST
  - URL: /api/notifications/:id/read
  - Payload: {}
  - Response: {"success":true,"message":"Marked as read","data":{...}}

- Method: POST
  - URL: /api/notifications/read-all
  - Payload: {"userId":"..."}
  - Response: {"success":true,"message":"All marked as read","data":{...}}

- Method: POST
  - URL: /api/notifications/:id/archive
  - Payload: {}
  - Response: {"success":true,"message":"Archived","data":{...}}

- Method: DELETE
  - URL: /api/notifications/:id
  - Payload: {}
  - Response: {"success":true,"message":"Deleted"}

## Revenue
- Method: GET
  - URL: /api/revenue/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
  - Payload: {}
  - Response: {"success":true,"data":{"totalRevenue":0,"settledAmount":0,"availableForSettlement":0,"autoSettlementEta":null}}

- Method: GET
  - URL: /api/revenue/feed?groupBy=daily&from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&limit=20
  - Payload: {}
  - Response: {"success":true,"count":0,"total":0,"data":[]}

- Method: GET
  - URL: /api/revenue/booking/:bookingId
  - Payload: {}
  - Response: {"success":true,"data":{...}}

## Settlements
- Method: GET
  - URL: /api/settlements?status=processing&page=1&limit=20
  - Payload: {}
  - Response: {"success":true,"count":0,"total":0,"data":[]}

- Method: GET
  - URL: /api/settlements/:id
  - Payload: {}
  - Response: {"success":true,"data":{...}}

- Method: POST
  - URL: /api/settlements/settle-now
  - Payload: {"userId":"...","propertyId":"...","amount":115000,"method":"NEFT","notes":"..."}
  - Response: {"success":true,"message":"Settlement initiated","data":{...}}

- Method: POST
  - URL: /api/settlements/:id/status
  - Payload: {"status":"delayed","note":"...","referenceId":"NEFT-REF-001"}
  - Response: {"success":true,"message":"Settlement status updated","data":{...}}

## Reports
- Method: POST
  - URL: /api/reports/generate
  - Payload: {"userId":"...","reportType":"revenue","granularity":"weekly","from":"YYYY-MM-DD","to":"YYYY-MM-DD","format":"csv"}
  - Response: {"success":true,"message":"Report started","data":{"jobId":"...","status":"queued"}}

- Method: GET
  - URL: /api/reports/status/:jobId
  - Payload: {}
  - Response: {"success":true,"data":{"jobId":"...","status":"completed","downloadUrl":"/api/reports/download/rep_<JOB_ID>.csv"}}

- Method: GET
  - URL: /api/reports/download/:file
  - Payload: {}
  - Response: (file download)

## Analytics
- Method: GET
  - URL: /api/analytics/summary?period=this_week&propertyId=<PROPERTY_ID>
  - Payload: {}
  - Response:
    {"success":true,"period":{...},"data":{"bookings":0,"checkins":0,"checkouts":0,"occupancyRate":0,"ADR":0,"RevPAR":0,"sources":[...]}}

## Support: Tickets
- Method: POST
  - URL: /api/support/
  - Payload: {"userId":"...","category":"Payout","priority":"High","subject":"...","description":"..."}
  - Response: {"success":true,"message":"Ticket created","data":{...}}

- Method: GET
  - URL: /api/support/
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 1,
      "total": 1,
      "data": [
        {
          "_id": "tick_01",
          "ticketNo": "SUP-20251222-0007",
          "subject": "Payout not received for BK-123456",
          "status": "InProgress",
          "priority": "High",
          "category": "Payout",
          "createdBy": { "_id": "u1", "firstName": "Hotel", "lastName": "Owner" },
          "assignee": { "_id": "agent1", "firstName": "Support", "lastName": "Agent" },
          "createdAt": "2025-12-22T09:50:00.000Z"
        }
      ]
    }

- Method: GET
  - URL: /api/support/:id
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "_id": "tick_01",
        "ticketNo": "SUP-20251222-0007",
        "createdBy": { "_id": "u1", "firstName": "Hotel", "lastName": "Owner", "phone": "9999" },
        "assignee": { "_id": "agent1", "firstName": "Support", "lastName": "Agent" },
        "category": "Payout",
        "priority": "High",
        "status": "InProgress",
        "subject": "Payout not received for BK-123456",
        "description": "Haven't received payout for booking BK-123456",
        "attachments": ["uploads/docs/receipt.pdf"],
        "bookingId": "6720b1",
        "timeline": [
          { "at": "2025-12-22T09:50:00.000Z", "action": "Created", "by": "u1" },
          { "at": "2025-12-22T10:05:00.000Z", "action": "Assigned", "by": "agent1" }
        ],
        "createdAt": "2025-12-22T09:50:00.000Z",
        "updatedAt": "2025-12-22T10:05:00.000Z"
      }
    }

- Method: PATCH
  - URL: /api/support/:id
  - Payload: {"status":"InProgress","assignee":"..."}
  - Response: {"success":true,"message":"Ticket updated","data":{...}}

- Method: POST
  - URL: /api/support/:id/messages
  - Payload: {"userId":"...","message":"..."}
  - Response:
    {
      "success": true,
      "message": "Message added",
      "data": {
        "_id": "msg1",
        "ticketId": "tick_01",
        "sender": "u1",
        "message": "Sharing payout reference: TXN-778899",
        "attachments": ["uploads/screenshots/proof.png"],
        "createdAt": "2025-12-22T10:10:00.000Z"
      }
    }

- Method: GET
  - URL: /api/support/:id/messages
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 2,
      "total": 2,
      "data": [
        {
          "_id": "msg1",
          "ticketId": "tick_01",
          "sender": { "_id": "u1", "firstName": "Hotel", "lastName": "Owner" },
          "message": "Sharing payout reference: TXN-778899",
          "attachments": ["uploads/screenshots/proof.png"],
          "createdAt": "2025-12-22T10:10:00.000Z"
        },
        {
          "_id": "msg2",
          "ticketId": "tick_01",
          "sender": { "_id": "agent1", "firstName": "Support", "lastName": "Agent" },
          "message": "We have initiated payout review.",
          "attachments": [],
          "createdAt": "2025-12-22T10:12:00.000Z"
        }
      ]
    }

- Method: POST
  - URL: /api/support/:id/close
  - Payload: {}
  - Response:
    {
      "success": true,
      "message": "Ticket closed",
      "data": {
        "_id": "tick_01",
        "status": "Closed",
        "timeline": [
          { "at": "2025-12-22T09:50:00.000Z", "action": "Created" },
          { "at": "2025-12-22T11:00:00.000Z", "action": "Closed" }
        ]
      }
    }

## Support: Live Chat
- Method: POST
  - URL: /api/support/sessions
  - Payload: {"userId":"...","topic":"...","relatedTicketId":"..."}
  - Response:
    {
      "success": true,
      "message": "Session created",
      "data": {
        "_id": "sess1",
        "createdBy": "u1",
        "participants": ["u1"],
        "topic": "Payout issue for BK-123456",
        "relatedTicketId": "tick_01",
        "status": "Open",
        "createdAt": "2025-12-22T10:09:00.000Z"
      }
    }

- Method: GET
  - URL: /api/support/sessions?userId=<USER_ID>&status=Open
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 1,
      "total": 1,
      "data": [
        {
          "_id": "sess1",
          "createdBy": { "_id": "u1", "firstName": "Hotel" },
          "participants": [{ "_id": "u1" }, { "_id": "agent1" }],
          "topic": "Payout issue for BK-123456",
          "status": "Open",
          "updatedAt": "2025-12-22T10:12:00.000Z"
        }
      ]
    }

- Method: POST
  - URL: /api/support/sessions/:id/messages
  - Payload: {"userId":"...","message":"..."}
  - Response: {"success":true,"message":"Message sent","data":{...}}

- Method: GET
  - URL: /api/support/sessions/:id/messages
  - Payload: {}
  - Response: {"success":true,"count":0,"total":0,"data":[]}

- Method: POST
  - URL: /api/support/sessions/:id/close
  - Payload: {}
  - Response: {"success":true,"message":"Session closed","data":{...}}

## Support: Knowledge Base
- Method: POST
  - URL: /api/support/kb/categories
  - Payload: {"name":"Payments & Payouts","slug":"payments-and-payouts","order":1}
  - Response: {"success":true,"message":"Category created","data":{...}}

- Method: GET
  - URL: /api/support/kb/categories
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": [
        { "_id": "cat1", "name": "Getting Started", "slug": "getting-started", "order": 0 },
        { "_id": "cat2", "name": "Payments & Payouts", "slug": "payments-and-payouts", "order": 1 }
      ]
    }

- Method: POST
  - URL: /api/support/kb/articles
  - Payload: {"title":"How to update payout?","slug":"update-payout","content":"<p>...","category":"<CAT_ID>"}
  - Response: {"success":true,"message":"Article created","data":{...}}

- Method: PATCH
  - URL: /api/support/kb/articles/:id
  - Payload: {"published":true}
  - Response: {"success":true,"message":"Article updated","data":{...}}

- Method: GET
  - URL: /api/support/kb/categories/:id/articles?page=1&limit=20
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 1,
      "total": 1,
      "data": [
        { "_id": "art1", "title": "How to update payout details?", "summary": "Update your bank details for payouts", "slug": "update-payout-details", "createdAt": "2025-11-01T09:00:00.000Z" }
      ]
    }

- Method: GET
  - URL: /api/support/kb/articles/:id
  - Payload: {}
  - Response: {"success":true,"data":{...}}

- Method: GET
  - URL: /api/support/kb/articles/slug/:slug
  - Payload: {}
  - Response: {"success":true,"data":{...}}

- Method: GET
  - URL: /api/support/kb/search?q=...
  - Payload: {}
  - Response: {"success":true,"count":0,"total":0,"data":[]}

## Marketing: Promotions & Seasonal
- Method: POST
  - URL: /api/marketing/promotions
  - Payload: {"title":"Early Bird","discountPercent":25,"startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD"}
  - Response: {"success":true,"message":"Promotion created","data":{...}}

- Method: GET
  - URL: /api/marketing/promotions?status=Active
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 2,
      "total": 2,
      "data": [
        { "_id": "pr_1", "title": "Early Bird Special", "discountPercent": 25, "status": "Active", "metrics": { "bookings": 45, "revenue": 212100 } },
        { "_id": "pr_2", "title": "Weekend Getaway", "discountPercent": 15, "status": "Active", "metrics": { "bookings": 78, "revenue": 281100 } }
      ]
    }

- Method: PATCH
  - URL: /api/marketing/promotions/:id
  - Payload: {"status":"Paused"}
  - Response: {"success":true,"message":"Promotion updated","data":{...}}

- Method: DELETE
  - URL: /api/marketing/promotions/:id
  - Payload: {}
  - Response: {"success":true,"message":"Promotion deleted"}

- Method: GET
  - URL: /api/marketing/dashboard?propertyId=<PROPERTY_ID>
  - Payload: {}
  - Response:
    {
      "success": true,
      "data": {
        "active": [
          {
            "_id": "pr_1",
            "title": "Early Bird Special",
            "description": "Book 30 days in advance",
            "kind": "percent",
            "discountPercent": 25,
            "appliesTo": { "plans": ["RO","CP"], "minNights": 2 },
            "startDate": "2025-10-01T00:00:00.000Z",
            "endDate": "2025-12-31T00:00:00.000Z",
            "status": "Active",
            "metrics": { "bookings": 45, "revenue": 212100 }
          },
          {
            "_id": "pr_2",
            "title": "Weekend Getaway",
            "kind": "percent",
            "discountPercent": 15,
            "status": "Active",
            "metrics": { "bookings": 78, "revenue": 281100 }
          }
        ],
        "scheduled": [
          {
            "_id": "pr_5",
            "title": "Flash Sale",
            "kind": "percent",
            "discountPercent": 40,
            "status": "Scheduled",
            "startDate": "2025-10-25T00:00:00.000Z",
            "endDate": "2025-10-27T00:00:00.000Z"
          }
        ],
        "expired": [
          {
            "_id": "pr_old",
            "title": "Monsoon Offer",
            "status": "Expired",
            "metrics": { "bookings": 120, "revenue": 450000 }
          }
        ],
        "seasonal": [
          {
            "_id": "se_1",
            "name": "Diwali Special",
            "multiplier": 2.5,
            "status": "Active",
            "startDate": "2025-10-12T00:00:00.000Z",
            "endDate": "2025-10-16T00:00:00.000Z"
          },
          {
            "_id": "se_2",
            "name": "New Year",
            "multiplier": 3.0,
            "status": "Scheduled",
            "startDate": "2025-12-29T00:00:00.000Z",
            "endDate": "2026-01-02T00:00:00.000Z"
          }
        ]
      }
    }

- Method: POST
  - URL: /api/marketing/seasonal
  - Payload: {"name":"Diwali","multiplier":2.5,"startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD"}
  - Response: {"success":true,"message":"Seasonal event created","data":{...}}

- Method: GET
  - URL: /api/marketing/seasonal
  - Payload: {}
  - Response:
    {
      "success": true,
      "count": 2,
      "total": 2,
      "data": [
        {
          "_id": "se_1",
          "name": "Diwali Special",
          "multiplier": 2.5,
          "status": "Active",
          "startDate": "2025-10-12T00:00:00.000Z",
          "endDate": "2025-10-16T00:00:00.000Z"
        },
        {
          "_id": "se_2",
          "name": "New Year",
          "multiplier": 3.0,
          "status": "Scheduled",
          "startDate": "2025-12-29T00:00:00.000Z",
          "endDate": "2026-01-02T00:00:00.000Z"
        }
      ]
    }

