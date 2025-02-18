import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};


// this is the patch method
//The PATCH method is used to apply partial modifications to a resource.

export const updateRoomPrice = async (req, res, next) => {
  const roomId = req.params.id;
  const { price } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { price: price },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

//this is head method 
// HEAD request to check if a room is available for specific dates

export const checkRoomAvailability = async (req, res, next) => {
  const roomId = req.params.id;
  const { checkInDate, checkOutDate } = req.query;

  try {
    // Find the room by its ID
    const room = await Room.findById(roomId);
    if (!room) {
      return next(createError(404, "Room not found"));
    }

    // Check if the room is available during the requested date range
    const isAvailable = room.roomNumbers.every((roomNumber) => {
      return !roomNumber.unavailableDates.some((date) => {
        return (
          new Date(date).getTime() >= new Date(checkInDate).getTime() &&
          new Date(date).getTime() <= new Date(checkOutDate).getTime()
        );
      });
    });

    // If the room is available, return status 200
    if (isAvailable) {
      res.status(200).send(); // No body, only status
    } else {
      res.status(404).send("Room is not available for the requested dates.");
    }
  } catch (err) {
    next(err);
  }
};
