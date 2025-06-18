import { BillRegistry } from '../../../app/Models/BillRegistryCollection';
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  const method = req.method.toUpperCase();

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
      const { type, fromDate, toDate, DateType } = req.body;

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
        const start = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(toDate).setHours(23, 59, 59, 999));

        console.log("last5transactions range:", start, "to", end);

        const last5transactions = await BillRegistry.find({
          BillDate: { $gte: start, $lte: end },
        })
          .sort({ BillDate: -1 })
          .limit(5);

        return res.status(200).json(last5transactions);
      }

      if (type === 'chartData') {
        const results = await getChartData(DateType, fromDate, toDate);
        return res.status(200).json(results);
      }

      return res.status(400).json({ error: 'Invalid type' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

// Chart Data Helper
async function getChartData(DateType = 'Today', fromDate, toDate) {
  const baseMatch = {
    BillDate: {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    },
  };

  if (DateType === 'Today') {
    return await BillRegistry.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: "$BillDate",
          AmountReceived: {
            $sum: {
              $cond: [{ $eq: ["$PaymentStatus", "paid"] }, "$BillAmount", 0],
            },
          },
          AmountPending: {
            $sum: {
              $cond: [{ $eq: ["$PaymentStatus", "unpaid"] }, "$BillAmount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 'Today',
          AmountReceived: 1,
          AmountPending: 1,
        },
      },
      { $sort: { name: 1 } },
    ]);
  }

  if (DateType === 'Last 7 Days') {
    return await BillRegistry.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: { $dayOfWeek: "$BillDate" },
          AmountReceived: {
            $sum: {
              $cond: [{ $eq: ["$PaymentStatus", "paid"] }, "$BillAmount", 0],
            },
          },
          AmountPending: {
            $sum: {
              $cond: [{ $eq: ["$PaymentStatus", "unpaid"] }, "$BillAmount", 0],
            },
          },
        },
      },
      {
        $addFields: {
          name: {
            $arrayElemAt: [
              ["", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
              "$_id",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          AmountReceived: 1,
          AmountPending: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  if (DateType === 'Last 30 Days') {
    return await BillRegistry.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$BillDate" },
            month: { $month: "$BillDate" },
            year: { $year: "$BillDate" },
          },
          AmountReceived: {
            $sum: {
              $cond: [{ $eq: ["$PaymentStatus", "paid"] }, "$BillAmount", 0],
            },
          },
          AmountPending: {
            $sum: {
              $cond: [{ $eq: ["$PaymentStatus", "unpaid"] }, "$BillAmount", 0],
            },
          },
        },
      },
      {
        $addFields: {
          name: {
            $dateToString: {
              format: "%d-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          AmountReceived: 1,
          AmountPending: 1,
        },
      },
      { $sort: { name: 1 } },
    ]);
  }

  return [];
}
