const calculateTheMix = (mixRatio, volume) => {
    if (!mixRatio || !volume || isNaN(volume) || volume <= 0) {
        return { error: 'Invalid mix ratio or volume' };
    }

    const ratioParts = mixRatio.split(":").map(Number);
    if (ratioParts.length !== 3 || ratioParts.some(isNaN)) {
        return { error: 'Invalid mix ratio format. Use e.g., "1:2:4"' };
    }

    const totalParts = ratioParts.reduce((a, b) => a + b, 0);
    const dryVolume = volume * 1.54; // 54% extra for dry mix

    // Constants (same as in page)
    const cementDensity = 1440; // kg/m³
    const bagWeight = 50; // kg/bag
    const waterCementRatio = 0.5; // W/C ratio

    // Volume distribution
    const cementPart = dryVolume * (ratioParts[0] / totalParts);
    const sandPart = dryVolume * (ratioParts[1] / totalParts);
    const aggPart = dryVolume * (ratioParts[2] / totalParts);

    // Cement
    const cementKg = cementPart * cementDensity;
    const cementBags = cementKg / bagWeight;

    // Sand & Aggregate
    const sandM3 = sandPart;
    const aggregateM3 = aggPart;

    // Water
    const waterKg = cementKg * waterCementRatio;

    return {
        dryVolume: Number(dryVolume.toFixed(0)),
        cementKg: Number(cementKg.toFixed(0)),
        cementBags: Number(cementBags.toFixed(0)),
        sandM3: Number(sandM3.toFixed(0)),
        aggregateM3: Number(aggregateM3.toFixed(0)),
        waterLiters: Number(waterKg.toFixed(0))
    };
};

const calculateConcreteMix = (req, res) => {
    const { mixRatio, volume } = req.body;
    console.log({ mixRatio, volume });

    try {
        const result = calculateTheMix(mixRatio, Number(volume));
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json({
            input: { mixRatio, volume: Number(volume) },
            results: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export { calculateConcreteMix };
