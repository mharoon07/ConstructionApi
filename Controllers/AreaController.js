const areaToM2 = {
    mm2: 1e-6,
    cm2: 1e-4,
    m2: 1,
    ha: 10000,
    km2: 1e6,
    in2: 0.00064516,
    ft2: 0.092903,
    yd2: 0.836127,
    acre: 4046.86,
    mi2: 2.59e6
};

const areaUnits = [
    { value: 'mm2', label: 'Square Millimeter (mm²)' },
    { value: 'cm2', label: 'Square Centimeter (cm²)' },
    { value: 'm2', label: 'Square Meter (m²)' },
    { value: 'ha', label: 'Hectare (ha)' },
    { value: 'km2', label: 'Square Kilometer (km²)' },
    { value: 'in2', label: 'Square Inch (in²)' },
    { value: 'ft2', label: 'Square Foot (ft²)' },
    { value: 'yd2', label: 'Square Yard (yd²)' },
    { value: 'acre', label: 'Acre' },
    { value: 'mi2', label: 'Square Mile (mi²)' }
];

const convertTheArea = (value, fromUnit) => {
    if (!value || !fromUnit || !areaToM2[fromUnit]) {
        return {
            mm2: 0,
            cm2: 0,
            m2: 0,
            ha: 0,
            km2: 0,
            in2: 0,
            ft2: 0,
            yd2: 0,
            acre: 0,
            mi2: 0
        };
    }

    const valueInM2 = value * areaToM2[fromUnit];
    return {
        mm2: Number((valueInM2 / areaToM2.mm2).toFixed(6)),
        cm2: Number((valueInM2 / areaToM2.cm2).toFixed(6)),
        m2: Number((valueInM2 / areaToM2.m2).toFixed(6)),
        ha: Number((valueInM2 / areaToM2.ha).toFixed(6)),
        km2: Number((valueInM2 / areaToM2.km2).toFixed(6)),
        in2: Number((valueInM2 / areaToM2.in2).toFixed(6)),
        ft2: Number((valueInM2 / areaToM2.ft2).toFixed(6)),
        yd2: Number((valueInM2 / areaToM2.yd2).toFixed(6)),
        acre: Number((valueInM2 / areaToM2.acre).toFixed(6)),
        mi2: Number((valueInM2 / areaToM2.mi2).toFixed(6))
    };
};

 const convertArea = (req, res) => {
    const { value, fromUnit } = req.body;
    console.log(value)

    try {
        if (!value || isNaN(value) || value <= 0) {
            return res.status(400).json({ error: 'Invalid or missing value' });
        }
        if (!fromUnit || !areaToM2[fromUnit]) {
            return res.status(400).json({ error: 'Invalid or missing unit. Valid units are: mm2, cm2, m2, ha, km2, in2, ft2, yd2, acre, mi2' });
        }

        const result = convertTheArea(Number(value), fromUnit);

        res.json({
            input: { value: Number(value), unit: fromUnit },
            conversions: result,
            availableUnits: areaUnits.map(u => u.value)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { areaUnits, convertArea };