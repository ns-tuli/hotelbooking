import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

// Function to generate monthly or yearly sales report
export const generateSalesReport = async (req, res, next) => {
  try {
    const { period } = req.query;  // period: 'monthly' or 'yearly' or weekly
    const dateFilter = {};

    // Set the date filter based on the period
    if (period === "monthly") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      
      dateFilter.checkInDate = { $gte: startOfMonth, $lt: endOfMonth };
    }

    if (period === "yearly") {
      const startOfYear = new Date();
      startOfYear.setMonth(0, 1);
      startOfYear.setHours(0, 0, 0, 0);

      const endOfYear = new Date(startOfYear);
      endOfYear.setFullYear(endOfYear.getFullYear() + 1);

      dateFilter.checkInDate = { $gte: startOfYear, $lt: endOfYear };
    }

    // Aggregate booking data for the selected period
    const salesData = await Booking.aggregate([
      {
        $match: dateFilter,
      },
      {
        $group: {
          _id: "$roomId",
          totalRevenue: { $sum: "$totalPrice" },
          bookingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "rooms",  // join with the Room collection
          localField: "_id",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      {
        $unwind: "$roomDetails",
      },
      {
        $project: {
          roomId: "$_id",
          roomName: "$roomDetails.title",
          totalRevenue: 1,
          bookingCount: 1,
        },
      },
    ]);

    // Find the top 3 most popular hotels by booking count
    const topHotels = await Booking.aggregate([
      {
        $match: dateFilter,
      },
      {
        $group: {
          _id: "$hotelId",
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "hotels",  // join with the Hotel collection
          localField: "_id",
          foreignField: "_id",
          as: "hotelDetails",
        },
      },
      {
        $unwind: "$hotelDetails",
      },
      {
        $project: {
          hotelName: "$hotelDetails.name",
          bookingCount: 1,
        },
      },
    ]);

    res.status(200).json({ salesData, topHotels });
  } catch (err) {
    next(err);
  }
};
