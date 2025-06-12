import { BillRegistry } from '../../../app/Models/BillRegistryCollection';
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            // Auto-generate the next BillNo based on count
            const count = await BillRegistry.countDocuments();
            console.log('Bill count:', count);
            return res.status(200).json({ BillNo: count + 1 });
        } else if (req.method === 'POST') {
            const data = req.body;
            console.log('Received data:', data);
            const { type, fromDate, toDate, DateType } = data;
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
                                        TotalAmount: "$TotalAmount"
                                    }
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
                            $lte: new Date(toDate)
                        }
                    }).sort({ Date: -1 }).limit(5);
                    return res.status(200).json(last5transactions);
                default:
                    return res.status(200).json([]);
            }
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/BillRegistry/select:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
