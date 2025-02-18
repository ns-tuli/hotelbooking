import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

// Function to book a room
export const bookRoom = async (req, res, next) => {
  const { hotelId, roomId, checkInDate, checkOutDate } = req.body;

  try {
    // Find the room and hotel
    const room = await Room.findById(roomId);
    const hotel = await Hotel.findById(hotelId);
    
    if (!room || !hotel) {
      return next(createError(404, "Room or Hotel not found"));
    }

    // Calculate the total price
    const totalPrice = room.price * (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 3600 * 24);

    // Create a new booking
    const newBooking = new Booking({
      userId: req.body.userId, // User ID should be provided (assumed to be from the JWT)
      hotelId: hotelId,
      roomId: roomId,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      totalPrice: totalPrice,
    });

    // Save the booking to the database
    await newBooking.save();

    res.status(200).json({ message: "Room booked successfully", booking: newBooking });
  } catch (err) {
    next(err);
  }
};
