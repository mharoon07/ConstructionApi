// controllers/plinthBeamController.js
const calculatePlinthLeanBeam = async (req, res) => {
    try {
        const { beams, mixRatio } = req.body;

        // Validate inputs
        if (!beams || !Array.isArray(beams) || beams.length === 0) {
            return res.status(400).json({ error: 'At least one plinth beam is required.' });
        }
        if (!mixRatio || !mixRatio.cement || !mixRatio.sand || !mixRatio.crush) {
            return res.status(400).json({ error: 'Valid mix ratio (cement, sand, crush) is required.' });
        }

        // Validate dimension format (e.g., 1'6", 0'9", 9in)
        const validateDimension = (input) => {
            if (!input) return false;
            const regex = /^(?:(\d+)'(\d+)?("|'')?|(\d+)(?:in|"|'')?)$/i;
            return regex.test(input.trim());
        };

        // Parse feet'inches" or inches to decimal feet
        const parseFeetInches = (value) => {
            if (!value || !validateDimension(value)) return 0;
            value = value.replace(/\s/g, '').toLowerCase();
            const match = value.match(/(?:(\d+)(?:'|ft))?(?:(\d+)(?:'|in|"|'')?)?/);
            if (!match) return parseFloat(value) || 0;
            const feet = parseFloat(match[1]) || 0;
            const inches = parseFloat(match[2]) || parseFloat(match[0]) || 0;
            return feet + inches / 12;
        };

        // Validate beams
        for (const beam of beams) {
            if (!beam.length || !beam.width || !beam.height) {
                return res.status(400).json({ error: 'All beams must have length, width, and height.' });
            }
            if (
                !validateDimension(beam.length) ||
                !validateDimension(beam.width) ||
                !validateDimension(beam.height)
            ) {
                return res.status(400).json({ error: 'Beam dimensions must be in the format 1\'6", 0\'9", or 9in.' });
            }
        }

        // Calculate volumes
        let totalVolume = 0;
        beams.forEach(beam => {
            const length = parseFeetInches(beam.length);
            const width = parseFeetInches(beam.width);
            const height = parseFeetInches(beam.height);
            beam.volFt3 = length * width * height;
            beam.volM3 = beam.volFt3 * 0.0283168;
            totalVolume += beam.volFt3;
        });

        // Calculate materials
        const { cement, sand, crush } = mixRatio;
        const totalRatio = cement + sand + crush;
        if (totalRatio === 0) {
            return res.status(400).json({ error: 'Mix ratio parts cannot sum to zero.' });
        }

        const dryVolume = totalVolume * 1.54; // Dry volume factor
        const cementVolume = (cement / totalRatio) * dryVolume;
        const sandVolume = (sand / totalRatio) * dryVolume;
        const crushVolume = (crush / totalRatio) * dryVolume;
        const cementBags = cementVolume / 1.25; // 1 bag = 1.25 ft³
        const waterLiter = cementBags * 25; // 25 liters per bag (per HTML logic)

        res.json({
            results: {
                totalVolume,
                cementVolume,
                cementBags,
                sandVolume,
                crushVolume,
                waterLiter,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { calculatePlinthLeanBeam };