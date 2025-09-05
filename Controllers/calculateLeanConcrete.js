const calculateLeanConcrete = (req, res) => {
  try {
    const { length, width, thickness, mixRatio } = req.body;

    // Validate input fields
    if (!length || !width || !thickness || !mixRatio || !mixRatio.cement || !mixRatio.sand || !mixRatio.crush) {
      return res.status(400).json({ error: 'Invalid input: all fields (length, width, thickness, cement, sand, crush) are required' });
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

    const lengthFt = parseFeetInches(length);
    const widthFt = parseFeetInches(width);
    const thicknessFt = parseFeetInches(thickness);

    if (!lengthFt || !widthFt || !thicknessFt) {
      return res.status(400).json({ error: 'Invalid dimension format. Use format like 10\'6"' });
    }

    // Parse concrete ratio
    const cementPart = parseInt(mixRatio.cement);
    const sandPart = parseInt(mixRatio.sand);
    const crushPart = parseInt(mixRatio.crush);

    if (isNaN(cementPart) || isNaN(sandPart) || isNaN(crushPart) || cementPart <= 0 || sandPart <= 0 || crushPart <= 0) {
      return res.status(400).json({ error: 'Mix ratio values must be positive integers' });
    }

    const totalParts = cementPart + sandPart + crushPart;

    // Calculate volumes
    const wetVolume = lengthFt * widthFt * thicknessFt;
    const dryVolume = wetVolume * 1.33;

    const cementVol = (dryVolume * cementPart) / totalParts;
    const sandVol = (dryVolume * sandPart) / totalParts;
    const crushVol = (dryVolume * crushPart) / totalParts;

    const cementBagVol = 1.25;
    const cementBags = cementVol / cementBagVol;
    const waterLiters = cementBags * 28;

    // Return results
    res.json({
      results: {
        wetVolume,
        dryVolume,
        cementBags,
        sandVol,
        crushVol,
        waterLiters,
      },
    });
  } catch (error) {
    console.error('Error calculating lean concrete:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { calculateLeanConcrete };