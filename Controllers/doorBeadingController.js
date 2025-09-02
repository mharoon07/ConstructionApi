const convertToFeet = (value, unit) => {
    if (unit === 'cm') return value / 30.48;
    if (unit === 'inch') return value / 12;
    if (unit === 'mm') return value / 304.8;
    return value;
};

const round = (val, digits = 5) => {
    return Math.round(val * Math.pow(10, digits)) / Math.pow(10, digits);
};

const calculateDoorBeading = async (req, res) => {
    try {
        const { doors } = req.body;
        if (!doors || !Array.isArray(doors)) {
            return res.status(400).json({ error: 'Invalid input: doors array is required' });
        }

        const results = doors.map(door => {
            const dl = convertToFeet(door.doorLength || 0, door.doorLengthUnit || 'feet');
            const dw = convertToFeet(door.doorWidth || 0, door.doorWidthUnit || 'feet');
            const bw = convertToFeet(door.beadingWidth || 0, door.beadingWidthUnit || 'inch');
            const bt = convertToFeet(door.beadingThickness || 0, door.beadingThicknessUnit || 'inch');
            const qty = door.quantity || 1;

            const beadingLength = 2 * dl + dw;
            const volume = 2 * beadingLength * bw * bt * qty;

            return { totalFt3: round(volume, 3) };
        });

        const totalFt3 = round(results.reduce((sum, r) => sum + r.totalFt3, 0), 3);

        res.json({ results, totals: { totalFt3 } });
    } catch (error) {
        res.status(500).json({ error: 'Server error during calculation' });
    }
};

export { calculateDoorBeading };