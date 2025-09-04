const calculateRCCWaterTank = (req, res) => {
    try {
        console.log(req.body);
        const {
            pcLength, pcWidth, pcHeight,
            tankLength, tankWidth, tankHeight,
            wallThickness, bottomThickness, roofThickness,
            manholeWidth, manholeLength,
            cementRatio, sandRatio, crushRatio
        } = req.body;

        // Validate inputs
        const requiredFields = [
            'pcLength', 'pcWidth', 'pcHeight',
            'tankLength', 'tankWidth', 'tankHeight',
            'wallThickness', 'bottomThickness', 'roofThickness',
            'manholeWidth', 'manholeLength',
            'cementRatio', 'sandRatio', 'crushRatio'
        ];
        if (requiredFields.some(field => !req.body[field])) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const dimensionRegex = /^\d+'(\d+)?"/; // Matches 4'6" or 8'0"
        const numberRegex = /^\d+$/;
        const dimensions = [
            pcLength, pcWidth, pcHeight,
            tankLength, tankWidth, tankHeight,
            wallThickness, bottomThickness, roofThickness,
            manholeWidth, manholeLength
        ];
        for (const [index, dim] of dimensions.entries()) {
            if (!dimensionRegex.test(dim)) {
                const fieldName = requiredFields[index].replace(/([A-Z])/g, ' $1').toLowerCase();
                return res.status(400).json({ error: `Invalid ${fieldName} format. Use format like 4'6" or 8'0"` });
            }
        }
        if (!numberRegex.test(cementRatio) || !numberRegex.test(sandRatio) || !numberRegex.test(crushRatio)) {
            return res.status(400).json({ error: 'Mix ratios must be positive integers' });
        }
        const cementPart = parseInt(cementRatio);
        const sandPart = parseInt(sandRatio);
        const crushPart = parseInt(crushRatio);
        if (cementPart <= 0 || sandPart <= 0 || crushPart <= 0) {
            return res.status(400).json({ error: 'Mix ratio parts must be positive numbers' });
        }

        // Parse feet and inches
        const parseFeetInches = (input) => {
            const regex = /(\d+)'(\d+)?"/;
            const match = input.match(regex);
            if (!match) return 0;
            const feet = parseInt(match[1]) || 0;
            const inches = parseInt(match[2]) || 0;
            return feet + (inches / 12);
        };

        // Parse dimensions
        const pcL = parseFeetInches(pcLength);
        const pcW = parseFeetInches(pcWidth);
        const pcH = parseFeetInches(pcHeight);
        const tankL = parseFeetInches(tankLength);
        const tankW = parseFeetInches(tankWidth);
        const tankH = parseFeetInches(tankHeight);
        const wallThk = parseFeetInches(wallThickness);
        const bottomThk = parseFeetInches(bottomThickness);
        const roofThk = parseFeetInches(roofThickness);
        const manholeW = parseFeetInches(manholeWidth);
        const manholeL = parseFeetInches(manholeLength);

        // Calculate volumes
        const pickupVolume = 4 * pcL * pcW * pcH; // 4 pickup columns
        const wallVolume = 2 * (tankL + tankW) * tankH * wallThk;
        const bottomVolume = tankL * tankW * bottomThk;
        const roofArea = tankL * tankW;
        const manholeArea = manholeW * manholeL;
        const roofNetArea = Math.max(roofArea - manholeArea, 0);
        const roofVolume = roofNetArea * roofThk;

        const totalFt3 = pickupVolume + wallVolume + bottomVolume + roofVolume;
        const totalM3 = totalFt3 / 35.3147;

        // Calculate materials
        const totalParts = cementPart + sandPart + crushPart;
        const dryVolume = totalFt3 * 1.54; // 54% increase for dry volume
        const cementVolume = dryVolume * (cementPart / totalParts);
        const sandVolume = dryVolume * (sandPart / totalParts);
        const crushVolume = dryVolume * (crushPart / totalParts);
        const cementBags = cementVolume / 1.25; // 1 bag = 1.25 ft³
        const waterLiters = cementBags * 25; // 25 liters per bag

        // Return results
        res.json({
            results: {
                pickupVolume,
                wallVolume,
                bottomVolume,
                roofVolume,
                totalFt3,
                totalM3,
                cementBags,
                sandVolume,
                crushVolume,
                waterLiters,
            },
        });
    } catch (error) {
        console.error('Error calculating RCC water tank concrete:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export { calculateRCCWaterTank };