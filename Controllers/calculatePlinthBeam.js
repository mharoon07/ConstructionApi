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

    // Validate dimension format (e.g., 5'6", 1'0", 6")
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
    for (const beam of beams) {
      if (!beam.length || !beam.width || !beam.height) {
        return res.status(400).json({ error: 'All beams must have length, width, and height.' });
      }
      if (
        !validateDimension(beam.length) ||
        !validateDimension(beam.width) ||
        !validateDimension(beam.height)
      ) {
        return res.status(400).json({ error: 'Beam dimensions must be in the format 5\'6", 1\'0", or 6".' });
      }
    }

    // Calculate volumes and formwork
    let totalVolume = 0;
    let totalFormwork = 0;
    beams.forEach(beam => {
      const length = parseFeetInches(beam.length);
      const width = parseFeetInches(beam.width);
      const height = parseFeetInches(beam.height);
      beam.volFt3 = length * width * height;
      beam.volM3 = beam.volFt3 * 0.0283168;
      beam.formworkFt2 = 2 * length * height;
      totalVolume += beam.volFt3;
      totalFormwork += beam.formworkFt2;
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
    const waterLiter = cementBags * 25; // 25 liters per bag

    res.json({
      results: {
        totalVolume,
        totalFormwork,
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

export { calculatePlinthBeam };