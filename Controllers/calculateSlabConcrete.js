const calculateSlabConcrete = (req, res) => {
  try {
    const { slabs, mixRatio } = req.body;

    // Validate inputs
    if (!Array.isArray(slabs) || slabs.length === 0) {
      return res.status(400).json({ error: 'At least one slab is required' });
    }
    const requiredFields = ['length', 'width', 'thickness'];
    for (const [index, slab] of slabs.entries()) {
      if (requiredFields.some(field => !slab[field])) {
        return res.status(400).json({ error: `Missing ${requiredFields.find(field => !slab[field])} in slab ${index + 1}` });
      }
    }
    const dimensionRegex = /^\d+'(\d+)?"/; // Matches 4'6" or 8'0"
    for (const [index, slab] of slabs.entries()) {
      for (const field of requiredFields) {
        if (!dimensionRegex.test(slab[field])) {
          return res.status(400).json({ error: `Invalid ${field} format in slab ${index + 1}. Use format like 4'6" or 8'0"` });
        }
      }
    }
    if (!mixRatio || !mixRatio.cement || !mixRatio.sand || !mixRatio.crush) {
      return res.status(400).json({ error: 'Mix ratio is required' });
    }
    const numberRegex = /^\d+$/;
    if (!numberRegex.test(mixRatio.cement) || !numberRegex.test(mixRatio.sand) || !numberRegex.test(mixRatio.crush)) {
      return res.status(400).json({ error: 'Mix ratios must be positive integers' });
    }
    const cementPart = parseInt(mixRatio.cement);
    const sandPart = parseInt(mixRatio.sand);
    const crushPart = parseInt(mixRatio.crush);
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

    // Calculate slab volumes
    const slabVolumes = slabs.map(slab => {
      const length = parseFeetInches(slab.length);
      const width = parseFeetInches(slab.width);
      const thickness = parseFeetInches(slab.thickness);
      const volume = length * width * thickness;
      return { grid: slab.grid || 'N/A', tag: slab.tag || 'N/A', volume };
    });

    const totalFt3 = slabVolumes.reduce((sum, slab) => sum + slab.volume, 0);
    const totalM3 = totalFt3 * 0.0283168; // Convert ft³ to m³

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
        slabVolumes,
        totalFt3,
        totalM3,
        cementBags,
        sandVolume,
        crushVolume,
        waterLiters,
      },
    });
  } catch (error) {
    console.error('Error calculating slab concrete:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

 export  { calculateSlabConcrete };