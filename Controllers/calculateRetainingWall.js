// controllers/retainingWallController.js
const calculateRetainingWall = async (req, res) => {
    try {
        const {
            lengthPlot,
            widthPlot,
            widthFoundation,
            thicknessFoundation,
            thicknessRingWall,
            heightRingWall,
            mixRatio,
        } = req.body;

        // Validate inputs
        const requiredFields = [
            'lengthPlot',
            'widthPlot',
            'widthFoundation',
            'thicknessFoundation',
            'thicknessRingWall',
            'heightRingWall',
            'mixRatio',
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Validate dimension format (e.g., 30'6" or 20'0")
        const validateDimension = (input) => {
            if (!input) return false;
            const regex = /^\d+'(\d*("|''))?$/; // Matches 30'6", 20'0", or 20'
            return regex.test(input);
        };

        // Validate mix ratio format (e.g., 1:2:4)
        const validateMixRatio = (input) => {
            const regex = /^\d+:\d+:\d+$/;
            return regex.test(input);
        };

        const dimensions = { lengthPlot, widthPlot, widthFoundation, thicknessFoundation, thicknessRingWall, heightRingWall };
        for (const [key, value] of Object.entries(dimensions)) {
            if (!validateDimension(value)) {
                return res.status(400).json({ error: `Invalid dimension format for ${key}. Use format like 30'6" or 20'0".` });
            }
        }
        if (!validateMixRatio(mixRatio)) {
            return res.status(400).json({ error: 'Mix ratio must be in the format 1:2:4.' });
        }

        // Parse feet'inches" to decimal feet
        const parseFeetInch = (input) => {
            if (!input || !validateDimension(input)) return 0;
            const match = input.match(/(\d+)'(\d+)?("|'')?/);
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
        if ([L, W, WF, TF, TR, HR].some(val => val === 0)) {
            return res.status(400).json({ error: 'All dimensions must be valid non-zero values.' });
        }

        // Parse mix ratio
        const [cementRatio, sandRatio, crushRatio] = mixRatio.split(':').map(Number);
        const totalParts = cementRatio + sandRatio + crushRatio;
        if (totalParts === 0) {
            return res.status(400).json({ error: 'Mix ratio parts cannot sum to zero.' });
        }

        // Volume Calculations
        const volumeFoundation = 2 * (L * WF * TF) + 2 * ((W - 2 * WF) * WF * TF);
        const formworkFoundation = 2 * (L + W) * TF + 2 * ((L - 2 * WF) + (W - 2 * WF)) * TF;
        const volumeRingWall = 2 * (L * TR * HR) + 2 * ((W - 2 * TR) * TR * HR);
        const formworkRingWall = 2 * (L + W) + 2 * (L - 2 * TR + W - 2 * TR);
        const totalVolume = volumeFoundation + volumeRingWall;
        const totalFormwork = formworkFoundation + formworkRingWall;

        // Material Calculations
        const cementVolume = (totalVolume * cementRatio) / totalParts;
        const sandVolume = (totalVolume * sandRatio) / totalParts;
        const crushVolume = (totalVolume * crushRatio) / totalParts;
        const cementBags = cementVolume / 1.25; // 1 bag = 1.25 ft³
        const waterRequired = cementBags * 20; // 20 liters per bag (from HTML logic)

        res.json({
            results: {
                volumeFoundation,
                volumeRingWall,
                totalVolume,
                formworkFoundation,
                formworkRingWall,
                totalFormwork,
                cementVolume,
                cementBags,
                sandVolume,
                crushVolume,
                waterRequired,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { calculateRetainingWall };