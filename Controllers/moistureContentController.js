const calculateMoistureContent = (req, res) => {
    try {
        const { samples } = req.body;

        if (!Array.isArray(samples)) {
            return res.status(400).json({ error: 'Invalid input: samples must be an array' });
        }

        const results = samples.map(sample => {
            const wetWeight = Number(sample.wetWeight);
            const dryWeight = Number(sample.dryWeight);

            if (isNaN(wetWeight) || isNaN(dryWeight) || wetWeight <= 0 || dryWeight <= 0) {
                return null;
            }

            const moistureContent = ((wetWeight - dryWeight) / dryWeight) * 100;
            return moistureContent;
        });

        res.json({ results });
    } catch (error) {
        console.error('Error calculating moisture content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { calculateMoistureContent };