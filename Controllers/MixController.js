const calculateTheMix = (mixRatio, volume) => {
    if (!mixRatio || !volume || isNaN(volume) || volume <= 0) {
        return { error: 'Invalid mix ratio or volume' };
    }
    const ratioParts = mixRatio.split(":").map(Number);
    if (ratioParts.length !== 3 || ratioParts.some(isNaN)) {
        return { error: 'Invalid mix ratio format. Use e.g., "1:2:4"' };
    }
    const totalParts = ratioParts.reduce((a, b) => a + b, 0);
    const dryVolume = volume * 1.54;
    const cementPart = dryVolume * (ratioParts[0] / totalParts);
    const cementKg = cementPart * 1440;
    const cementBags = cementKg / 50;
    const sandLiters = dryVolume * (ratioParts[1] / totalParts) * 1000;
    const aggregateLiters = dryVolume * (ratioParts[2] / totalParts) * 1000;
    return {
        dryVolume: Number(dryVolume.toFixed(2)),
        cementKg: Number(cementKg.toFixed(2)),
        cementBags: Number(cementBags.toFixed(1)),
        sandLiters: Number(sandLiters.toFixed(2)),
        aggregateLiters: Number(aggregateLiters.toFixed(2))
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
        res.status(500).json({ error: 'Server error' });
    }
};

export { calculateConcreteMix };