const calculateUShapedStair = (req, res) => {
    try {
        const {
            risers, riserHeight, treadLength, width,
            slabThickness, winderSteps, midSlabLength,
            midSlabThickness, cementRatio, sandRatio,
            crushRatio, includeWinders
        } = req.body;

        // Validate inputs
        const requiredFields = [
            'risers', 'riserHeight', 'treadLength', 'width',
            'slabThickness', 'midSlabLength', 'midSlabThickness',
            'cementRatio', 'sandRatio', 'crushRatio'
        ];
        if (includeWinders) requiredFields.push('winderSteps');
        if (requiredFields.some(field => !req.body[field])) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const numberRegex = /^\d+$/;
        if (!numberRegex.test(risers) || !numberRegex.test(cementRatio) ||
            !numberRegex.test(sandRatio) || !numberRegex.test(crushRatio) ||
            (includeWinders && !numberRegex.test(winderSteps))) {
            return res.status(400).json({ error: 'Number of risers, winder steps, and mix ratios must be positive integers' });
        }

        const decimalRegex = /^\d*\.?\d*$/; // Matches decimal numbers (e.g., 4, 4.5, 0.5)
        const dimensionFields = ['riserHeight', 'treadLength', 'width', 'slabThickness', 'midSlabLength', 'midSlabThickness'];
        for (const field of dimensionFields) {
            if (!decimalRegex.test(req.body[field]) || parseFloat(req.body[field]) <= 0) {
                return res.status(400).json({ error: `Invalid ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} format. Use positive decimal feet (e.g., 4.5, 0.5)` });
            }
        }

        const R = parseInt(risers);
        const h = parseFloat(riserHeight);
        const t = parseFloat(treadLength);
        const w = parseFloat(width);
        const s = parseFloat(slabThickness);
        const W_n = includeWinders ? parseInt(winderSteps) : 0;
        const M_len = parseFloat(midSlabLength);
        const M_thk = parseFloat(midSlabThickness);
        const cementPart = parseInt(cementRatio);
        const sandPart = parseInt(sandRatio);
        const crushPart = parseInt(crushRatio);

        if (R <= 0 || (includeWinders && W_n <= 0) || cementPart <= 0 || sandPart <= 0 || crushPart <= 0) {
            return res.status(400).json({ error: 'Number of risers, winder steps, and mix ratio parts must be positive' });
        }
        if (includeWinders && 2 * W_n >= R) {
            return res.status(400).json({ error: 'Total winder steps (2 × winder steps per turn) must be less than total risers' });
        }

        // Calculate volumes
        const R_flight = includeWinders ? (R - 2 * W_n) / 2 : R / 2;
        const inclinedLength = Math.sqrt(Math.pow(h * R_flight, 2) + Math.pow(t * (R_flight - 1), 2));
        const waistVolume = 2 * inclinedLength * w * s;
        const stepVolume = (R * t * w * h) / 2;
        const winderVolume = includeWinders ? w * w * h * (W_n + 1) : 0; // Doubled for two turns
        const midSlabVolume = M_len * w * M_thk;

        const totalFt3 = waistVolume + stepVolume + winderVolume + midSlabVolume;
        const totalM3 = totalFt3 * 0.0283168; 

        // Calculate materials (with 54% dry volume factor)
        const totalParts = cementPart + sandPart + crushPart;
         
        const cementVolume = totalFt3 * (cementPart / totalParts);
        const sandVolume = totalFt3 * (sandPart / totalParts);
        const crushVolume = totalFt3 * (crushPart / totalParts);
        const cementBags = cementVolume / 1.25; // 1 bag = 1.25 ft³
        const waterLiters = cementBags * 25; // 25 liters per bag

        // Return results
        res.json({
            results: {
                waistVolume,
                stepVolume,
                winderVolume,
                midSlabVolume,
                totalFt3,
                totalM3,
                cementBags,
                sandVolume,
                crushVolume,
                waterLiters,
            },
        });
    } catch (error) {
        console.error('Error calculating U-shaped stair concrete:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { calculateUShapedStair };