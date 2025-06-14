import { BillRegistry } from '../../../app/Models/BillRegistryCollection';
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  // Normalize method
  const method = req.method.toUpperCase();
console.log('Request Method:', method);
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS method (CORS preflight)
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    if (method === 'GET') {
      const count = await BillRegistry.countDocuments();
      return res.status(200).json({ BillNo: count + 1 });
    }

    if (method === 'POST') {
      const { type, fromDate, toDate } = req.body;

      if (type === 'carddetails') {
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
      }

      if (type === 'last5transactions') {
        const last5transactions = await BillRegistry.find({
          BillDate: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        })
          .sort({ Date: -1 })
          .limit(5);

        return res.status(200).json(last5transactions);
      }

      return res.status(200).json([]);
    }

    // Fallback: unsupported method
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
