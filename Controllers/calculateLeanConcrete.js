const calculateLeanConcrete = (req, res) => {
  try {
    const { length, width, thickness, ratio } = req.body;

    // Validate input fields
    if (!length || !width || !thickness || !ratio) {
      return res.status(400).json({ error: 'Invalid input: all fields (length, width, thickness, ratio) are required' });
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
    const parts = ratio.split(':').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return res.status(400).json({ error: 'Concrete ratio must be in the format 1:3:5' });
    }

    const [cementPart, sandPart, crushPart] = parts;
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