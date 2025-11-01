import PropertyRoom from "../models/propertyRoom.model.js";

// ✅ Create a new room
export const createRoom = async (req, res) => {
  try {
    
    const data = req.body;
    
    if (!data.userId) {
      return res.status(400).json({ status: "error", message: "userId is required" });
    }   

    if (!data.propertyId) {
      return res.status(400).json({ status: "error", message: "propertyId is required" });
    }

    const room = await PropertyRoom.create(data);

    res.status(201).json({
      status: "success",
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({  status: "error", message: "Server error", error: error.message });
  }
};

//Update a room by ID
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedRoom = await PropertyRoom.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedRoom) {
      return res.status(404).json({ status: "error", message: "Room not found" });
    }

    res.status(200).json({
        status: "success",
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all rooms (optionally by propertyId)
export const getAllRooms = async (req, res) => {
  try {
    const { propertyId } = req.query;
    const query = propertyId ? { propertyId } : {};
    const rooms = await PropertyRoom.find(query);
    res.status(200).json({
      success: true,
      count: rooms.length,
      message: rooms.length
        ? "Rooms fetched successfully"
        : "No rooms found",
      data: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Get Room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await PropertyRoom.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room details fetched successfully",
      data: room,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching room details",
      error: error.message,
    });
  }
};

// ✅ Delete Room by ID
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await PropertyRoom.findByIdAndDelete(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting room",
      error: error.message,
    });
  }
};
