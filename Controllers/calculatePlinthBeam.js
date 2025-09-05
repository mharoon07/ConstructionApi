const calculatePlinthBeam = async (req, res) => {
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

        // Validate dimension format (e.g., 5'6", 6", 5')
        const validateDimension = (input) => {
            if (!input) return false;
            const regex = /^(\d+)'(?:\s*(\d+)\")?$/i;
            return regex.test(input.trim()) || /^\d+"$/i.test(input.trim()) || /^\d+'$/i.test(input.trim());
        };

        // Parse feet'inches" or inches to decimal feet
        const parseFeetInches = (value) => {
            if (!value || !validateDimension(value)) return 0;
            value = value.trim().toLowerCase();
            const regex = /^(\d+)'(?:\s*(\d+)\")?$/;
            const match = value.match(regex);
            if (match) {
                const feet = parseInt(match[1]) || 0;
                const inches = match[2] ? parseInt(match[2]) : 0;
                return feet + inches / 12;
            } else if (/^\d+"$/.test(value)) {
                return parseInt(value.replace('"', '')) / 12;
            } else if (/^\d+'$/.test(value)) {
                return parseInt(value.replace("'", ''));
            }
            return 0;
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
                return res.status(400).json({ error: `Beam ${index + 1} dimensions must be in the format 5'6", 6", or 5'.` });
            }
        }

        // Calculate volumes and formwork
        let totalVolume = 0;
        let totalFormwork = 0;
        const processedBeams = beams.map(beam => {
            const length = parseFeetInches(beam.length);
            const width = parseFeetInches(beam.width);
            const height = parseFeetInches(beam.height);
            const volFt3 = length * width * height;
            const volM3 = volFt3 * 0.0283168;
            const formworkFt2 = 2 * length * height;
            totalVolume += volFt3;
            totalFormwork += formworkFt2;
            return {
                ...beam,
                volFt3: volFt3.toFixed(2),
                volM3: volM3.toFixed(2),
                formworkFt2: formworkFt2.toFixed(2),
            };
        });

        // Calculate materials
        const { cement, sand, crush } = mixRatio;
        const totalRatio = parseFloat(cement) + parseFloat(sand) + parseFloat(crush);
        if (totalRatio === 0) {
            return res.status(400).json({ error: 'Mix ratio parts cannot sum to zero.' });
        }

        const dryVolume = totalVolume * 1.54; // Dry volume factor
        const cementBags = ((cement / totalRatio) * dryVolume / 1.25).toFixed(2); // 1 bag = 1.25 ft³
        const sandVolume = ((sand / totalRatio) * dryVolume).toFixed(2);
        const crushVolume = ((crush / totalRatio) * dryVolume).toFixed(2);
        const waterLiter = (cementBags * 25).toFixed(2); // 25 liters per bag

        res.json({
            results: {
                beams: processedBeams,
                totalVolume: totalVolume.toFixed(2),
                totalM3: (totalVolume * 0.0283168).toFixed(2),
                totalFormwork: totalFormwork.toFixed(2),
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

export { calculatePlinthBeam };