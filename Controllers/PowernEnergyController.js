const conversionsToJoules = {
    w: 1, // Watt = 1 Joule per second
    kw: 1000, // Kilowatt
    mw: 1000000, // Megawatt
    j: 1, // Joule
    kj: 1000, // Kilojoule
    mj: 1000000, // Megajoule
    cal: 4.184, // Calorie
    kcal: 4184, // Kilocalorie
    wh: 3600, // Watt-hour
    kwh: 3600000 // Kilowatt-hour
};

const unitNames = {
    w: "Watt (W)",
    kw: "Kilowatt (kW)",
    mw: "Megawatt (MW)",
    j: "Joule (J)",
    kj: "Kilojoule (kJ)",
    mj: "Megajoule (MJ)",
    cal: "Calorie (cal)",
    kcal: "Kilocalorie (kcal)",
    wh: "Watt-hour (Wh)",
    kwh: "Kilowatt-hour (kWh)"
};

const convertEnergy = (value, unit) => {
    if (isNaN(value) || value < 0 || !unit || !conversionsToJoules[unit]) {
        return { error: 'Invalid value or unit' };
    }

    const valueInJoules = value * conversionsToJoules[unit];
    const results = {};

    for (const [targetUnit, factor] of Object.entries(conversionsToJoules)) {
        results[targetUnit] = {
            name: unitNames[targetUnit],
            value: Number((valueInJoules / factor).toFixed(0))
        };
    }

    return results;
};

const convertPowerEnergy = (req, res) => {
    const { value, unit } = req.body;
    try {
        const result = convertEnergy(Number(value), unit);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json({
            input: { value: Number(value), unit },
            results: result
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { convertPowerEnergy };