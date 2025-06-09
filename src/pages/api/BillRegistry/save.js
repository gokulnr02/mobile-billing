import { BillRegistry } from '../../../app/Models/BillRegistryCollection';
import { connectDB } from '../../../lib/db'


export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectDB();

            const count = await BillRegistry.create(req.body);
            console.log('Received data:', req.body);
            console.log('Bill count:', count);

            return res.status(200).json({ nextBillNo: count + 1 });
        } catch (error) {
            console.error('Error in /api/BillRegistry/save:', error);
            return res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

