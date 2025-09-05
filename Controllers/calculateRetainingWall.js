const calculateRetainingWall = async (req, res) => {
    try {
        const {
            lengthPlot,
            widthPlot,
            widthFoundation,
            thicknessFoundation,
            thicknessRingWall,
            heightRingWall,
            cementRatio,
            sandRatio,
            crushRatio,
        } = req.body;

        // Validate inputs
        const requiredFields = [
            'lengthPlot',
            'widthPlot',
            'widthFoundation',
            'thicknessFoundation',
            'thicknessRingWall',
            'heightRingWall',
            'cementRatio',
            'sandRatio',
            'crushRatio',
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Validate dimension format (e.g., 30'6", 20'0")
        const validateDimension = (input) => {
            if (!input) return false;
            const regex = /^\d+'(\d+)?"/; // Matches 30'6", 20'0"
            return regex.test(input.trim());
        };

        // Validate ratio format (positive integers)
        const validateRatio = (input) => {
            const regex = /^\d+$/;
            return regex.test(input) && parseInt(input) > 0;
        };

        const dimensions = { lengthPlot, widthPlot, widthFoundation, thicknessFoundation, thicknessRingWall, heightRingWall };
        for (const [key, value] of Object.entries(dimensions)) {
            if (!validateDimension(value)) {
                return res.status(400).json({ error: `Invalid dimension format for ${key}. Use format like 30'6" or 20'0".` });
            }
        }

        for (const ratio of [cementRatio, sandRatio, crushRatio]) {
            if (!validateRatio(ratio)) {
                return res.status(400).json({ error: `Invalid mix ratio component. Use positive integers.` });
            }
        }

        // Parse feet'inches" to decimal feet
        const parseFeetInch = (input) => {
            if (!input || !validateDimension(input)) return 0;
            const match = input.match(/(\d+)'(\d+)?"/);
            const feet = parseFloat(match[1]) || 0;
            const inches = parseFloat(match[2] || 0) || 0;
            return feet + inches / 12;
        };

        // Parse dimensions
        const L = parseFeetInch(lengthPlot);
        const W = parseFeetInch(widthPlot);
        const WF = parseFeetInch(widthFoundation);
        const TF = parseFeetInch(thicknessFoundation);
        const TR = parseFeetInch(thicknessRingWall);
        const HR = parseFeetInch(heightRingWall);

        // Validate parsed dimensions
        if ([L, W, WF, TF, TR, HR].some(val => val <= 0)) {
            return res.status(400).json({ error: 'All dimensions must be valid non-zero values.' });
        }

        // Parse mix ratios
        const cement = parseInt(cementRatio);
        const sand = parseInt(sandRatio);
        const crush = parseInt(crushRatio);
        const totalParts = cement + sand + crush;
        if (totalParts === 0) {
            return res.status(400).json({ error: 'Mix ratio parts cannot sum to zero.' });
        }

        // Volume Calculations
        const perimeter = 2 * (L + W);
        const innerPerimeter = 2 * (L - 2 * WF + W - 2 * WF);
        const volumeFoundation = perimeter * WF * TF;
        const formworkFoundation = perimeter * TF; // Sides of foundation slab
        const volumeRingWall = perimeter * TR * HR;
        const formworkRingWall = perimeter * HR * 2; // Both sides of ring wall
        const totalVolume = volumeFoundation + volumeRingWall;
        const totalFormwork = formworkFoundation + formworkRingWall;

        // Material Calculations (with 1.54 dry-to-wet ratio)
        const dryVolume = totalVolume * 1.54;
        const cementVolume = (dryVolume * cement) / totalParts;
        const sandVolume = (dryVolume * sand) / totalParts;
        const crushVolume = (dryVolume * crush) / totalParts;
        const cementBags = Math.ceil(cementVolume / 1.25); // 1 bag = 1.25 ft³
        const waterRequired = cementBags * 20; // 20 liters per bag

        res.json({
            results: {
                volumeFoundation: volumeFoundation,
                volumeRingWall: volumeRingWall,
                totalVolume: totalVolume,
                formworkFoundation: formworkFoundation,
                formworkRingWall: formworkRingWall,
                totalFormwork: totalFormwork,
                cementVolume: cementVolume,
                cementBags: cementBags,
                sandVolume: sandVolume,
                crushVolume: crushVolume,
                waterRequired: waterRequired,
            },
        });
    } catch (error) {
        res.status(500).json({ error: `Calculation failed: ${error.message}` });
    }
};

export { calculateRetainingWall };