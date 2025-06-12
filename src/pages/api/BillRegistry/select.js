import { BillRegistry } from '../../../app/Models/BillRegistryCollection';
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    // Handle CORS preflight (important when using fetch from frontend)
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    await connectDB();

    if (req.method === 'GET') {
      // Auto-generate next BillNo based on count
      const count = await BillRegistry.countDocuments();
      return res.status(200).json({ BillNo: count + 1 });

    } else if (req.method === 'POST') {
      const { type, fromDate, toDate } = req.body;

      switch (type) {
        case 'carddetails':
          const cardDetails = await BillRegistry.aggregate([
            {
              $match: {
                BillDate: {
                  $gte: new Date(fromDate),
                  $lte: new Date(toDate),
                },
              },
            },
            {
              $group: {
                _id: "$PaymentStatus",
                total: { $sum: "$BillAmount" },
              },
            },
            {
              $group: {
                _id: null,
                AmountReceived: {
                  $sum: {
                    $cond: [{ $eq: ["$_id", "paid"] }, "$total", 0],
                  },
                },
                AmountPending: {
                  $sum: {
                    $cond: [{ $eq: ["$_id", "unpaid"] }, "$total", 0],
                  },
                },
                TotalAmount: { $sum: "$total" },
              },
            },
            {
              $project: {
                _id: 0,
                results: [
                  {
                    AmountReceived: "$AmountReceived",
                    AmountPending: "$AmountPending",
                    TotalAmount: "$TotalAmount",
                  },
                ],
              },
            },
            { $unwind: "$results" },
            { $replaceRoot: { newRoot: "$results" } },
          ]);
          return res.status(200).json(cardDetails);

        case 'last5transactions':
          const last5transactions = await BillRegistry.find({
            BillDate: {
              $gte: new Date(fromDate),
              $lte: new Date(toDate),
            },
          })
            .sort({ Date: -1 })
            .limit(5);
          return res.status(200).json(last5transactions);

        default:
          return res.status(200).json([]);
      }
    } else {
      // Unsupported method
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/BillRegistry/select:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
