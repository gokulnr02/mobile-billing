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

            if (!data.PaymentStatus) {
                const result = await BillRegistry.find({}).sort({ BillNo: -1 }).limit(10);
                return res.status(200).json(result);
            } else if (data.PaymentStatus) {
                console.log('PaymentStatus provided:', data.PaymentStatus);
                const result = await BillRegistry.find({ PaymentStatus: data.PaymentStatus }).sort({ BillNo: -1 }).limit(10);
                return res.status(200).json(result);
            }
            return res.status(400).json({ error: 'PaymentStatus provided, no action defined' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/BillRegistry/select:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
