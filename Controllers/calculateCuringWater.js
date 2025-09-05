const calculateCuringWater = async (req, res) => {
    try {
        const { area, duration, rate, areaUnit, rateUnit } = req.body;

        // Server-side validation
        if (!area || !duration || !rate || !areaUnit || !rateUnit) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        console.log(typeof (area))
        // if (typeof area !== 'number' || area <= 0) {
        //     return res.status(400).json({ error: 'Area must be a positive number.' });
        // }
        // if (typeof duration !== 'number' || duration <= 0 || !Number.isInteger(duration)) {
        //     return res.status(400).json({ error: 'Duration must be a positive integer.' });
        // }
        // if (typeof rate !== 'number' || rate <= 0) {
        //     return res.status(400).json({ error: 'Rate must be a positive number.' });
        // }
        if (!['m2', 'ft2'].includes(areaUnit)) {
            return res.status(400).json({ error: 'Invalid area unit. Use m2 or ft2.' });
        }
        if (!['L/m2/day', 'gal/yd2/day'].includes(rateUnit)) {
            return res.status(400).json({ error: 'Invalid rate unit. Use L/m2/day or gal/yd2/day.' });
        }

        // Convert area to square meters
        let areaInM2 = area;
        if (areaUnit === 'ft2') {
            areaInM2 = area * 0.092903; // 1 ft² = 0.092903 m²
        }

        // Convert rate to liters/m²/day
        let rateInLitersPerM2 = rate;
        if (rateUnit === 'gal/yd2/day') {
            rateInLitersPerM2 = rate * 4.88; // 1 gal/yd² ≈ 4.88 liters/m²
        }

        // Calculate water requirements
        const dailyLiters = areaInM2 * rateInLitersPerM2;
        const totalLiters = dailyLiters * duration;
        const dailyGallons = dailyLiters * 0.264172; // 1 liter = 0.264172 gallons
        const totalGallons = totalLiters * 0.264172;

        // Return results
        res.status(200).json({
            dailyLiters,
            dailyGallons,
            totalLiters,
            totalGallons,
        });
    } catch (error) {
        console.error('Error in curing water calculation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { calculateCuringWater };