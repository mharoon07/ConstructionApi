const densityToKgM3 = {
    kgm3: 1,
    gcm3: 1000,
    gm3: 0.001,
    lbft3: 16.0185,
    lbgal: 119.826,
    slugft3: 515.3788
};

const densityUnits = [
    { value: 'kgm3', label: 'Kilogram per cubic meter (kg/m³)' },
    { value: 'gcm3', label: 'Gram per cubic centimeter (g/cm³)' },
    { value: 'gm3', label: 'Gram per cubic meter (g/m³)' },
    { value: 'lbft3', label: 'Pound per cubic foot (lb/ft³)' },
    { value: 'lbgal', label: 'Pound per gallon (US) (lb/gal)' },
    { value: 'slugft3', label: 'Slug per cubic foot (slug/ft³)' }
];

const convertTheDensity = (value, fromUnit) => {
    if (!value || !fromUnit || !densityToKgM3[fromUnit]) {
        return {
            kgm3: 0,
            gcm3: 0,
            gm3: 0,
            lbft3: 0,
            lbgal: 0,
            slugft3: 0
        };
    }
    const valueInKgM3 = value * densityToKgM3[fromUnit];
    return {
        kgm3: Number((valueInKgM3 / densityToKgM3.kgm3).toFixed(6)),
        gcm3: Number((valueInKgM3 / densityToKgM3.gcm3).toFixed(6)),
        gm3: Number((valueInKgM3 / densityToKgM3.gm3).toFixed(6)),
        lbft3: Number((valueInKgM3 / densityToKgM3.lbft3).toFixed(6)),
        lbgal: Number((valueInKgM3 / densityToKgM3.lbgal).toFixed(6)),
        slugft3: Number((valueInKgM3 / densityToKgM3.slugft3).toFixed(6))
    };
};

const convertDensity = (req, res) => {
    const { value, fromUnit } = req.body;
    console.log(value);
    try {
        if (!value || isNaN(value) || value <= 0) {
            return res.status(400).json({ error: 'Invalid or missing value' });
        }
        if (!fromUnit || !densityToKgM3[fromUnit]) {
            return res.status(400).json({ error: 'Invalid or missing unit. Valid units are: kgm3, gcm3, gm3, lbft3, lbgal, slugft3' });
        }
        const result = convertTheDensity(Number(value), fromUnit);
        res.json({
            input: { value: Number(value), unit: fromUnit },
            conversions: result,
            availableUnits: densityUnits.map(u => u.value)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { densityUnits, convertDensity };