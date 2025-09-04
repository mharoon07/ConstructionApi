const calculateWoodVolume = (req, res) => {
    const { frameWidth, frameWidthUnit, frameThickness, frameThicknessUnit, doors } = req.body;

    // Input validation
    if (!frameWidth || !frameThickness || !doors || !Array.isArray(doors) || doors.length === 0) {
        return res.status(400).json({ error: 'Missing required fields: frameWidth, frameThickness, and doors are required' });
    }

    if (!['in', 'ft'].includes(frameWidthUnit) || !['in', 'ft'].includes(frameThicknessUnit)) {
        return res.status(400).json({ error: 'Invalid unit: frameWidthUnit and frameThicknessUnit must be "in" or "ft"' });
    }

    try {
        // Convert units to feet
        const convertToFeet = (value, unit) => (unit === 'in' ? value / 12 : value);
        const fw = convertToFeet(Number(frameWidth), frameWidthUnit);
        const ft = convertToFeet(Number(frameThickness), frameThicknessUnit);

        // Validate numeric inputs
        if (isNaN(fw) || isNaN(ft)) {
            return res.status(400).json({ error: 'Frame width and thickness must be valid numbers' });
        }

        let totalVolume = 0;
        for (const door of doors) {
            const { height, width, quantity } = door;
            if (!height || !width || !quantity || isNaN(Number(height)) || isNaN(Number(width)) || isNaN(Number(quantity))) {
                return res.status(400).json({ error: 'Invalid door dimensions or quantity: height, width, and quantity must be valid numbers' });
            }
            if (quantity < 1) {
                return res.status(400).json({ error: 'Quantity must be at least 1' });
            }
            // Formula: (2 × Height + Width + 1) × Frame Width × Frame Thickness × Quantity
            totalVolume += Number(quantity) * (2 * Number(height) + Number(width) + 1) * fw * ft;
        }

        res.status(200).json({ totalVolume: Number(totalVolume.toFixed(0)) });
    } catch (error) {
        console.error('Error calculating wood volume:', error);
        res.status(500).json({ error: 'Internal server error during calculation' });
    }
};

export {
    calculateWoodVolume
};