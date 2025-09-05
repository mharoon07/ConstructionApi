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

        // Validate mix ratios are positive integers
        const validateRatio = (input) => {
            const regex = /^\d+$/;
            return regex.test(input) && parseInt(input) > 0;
        };
        if (
            !validateRatio(mixRatio.cement) ||
            !validateRatio(mixRatio.sand) ||
            !validateRatio(mixRatio.crush)
        ) {
            return res.status(400).json({ error: 'Mix ratios must be positive integers.' });
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
        for (const [index, beam] of beams.entries()) {
            if (!beam.length || !beam.width || !beam.height) {
                return res.status(400).json({ error: `All beams must have length, width, and height for beam ${index + 1}.` });
            }
            if (
                !validateDimension(beam.length) ||
                !validateDimension(beam.width) ||
                !validateDimension(beam.height)
            ) {
                return res.status(400).json({ error: `Beam ${index + 1} dimensions must be in the format 1'6", 0'9", or 9in.` });
            }
        }

        // Calculate volumes
        let totalVolume = 0;
        const processedBeams = beams.map(beam => {
            const length = parseFeetInches(beam.length);
            const width = parseFeetInches(beam.width);
            const height = parseFeetInches(beam.height);
            const volFt3 = length * width * height;
            const volM3 = volFt3 * 0.0283168;
            totalVolume += volFt3;
            return {
                ...beam,
                volFt3: volFt3.toFixed(2),
                volM3: volM3.toFixed(2),
            };
        });

        // Calculate materials
        const { cement, sand, crush } = mixRatio;
        const totalRatio = parseFloat(cement) + parseFloat(sand) + parseFloat(crush);
        if (totalRatio === 0) {
            return res.status(400).json({ error: 'Mix ratio parts cannot sum to zero.' });
        }

        const dryVolume = totalVolume * 1.54; // Dry volume factor
        const cementVolume = ((cement / totalRatio) * dryVolume);
        const cementBags =  (cementVolume / 1.25); // 1 bag = 1.25 ft³
        const sandVolume = ((sand / totalRatio) * dryVolume) ;
        const crushVolume = ((crush / totalRatio) * dryVolume) ;
        const waterLiter = (cementBags * 25) ; // 25 liters per bag

        res.json({
            results: {
                beams: processedBeams,
                totalVolume: totalVolume.toFixed(2),
                totalM3: (totalVolume * 0.0283168).toFixed(2),
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