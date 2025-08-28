const volumeToM3 = {
    mm3: 1e-9,
    cm3: 1e-6,
    ml: 1e-6,
    l: 0.001,
    m3: 1,
    in3: 0.0000163871,
    ft3: 0.0283168,
    yd3: 0.764555,
    gal: 0.00378541,
    qt: 0.000946353,
};

const volumeUnits = [
    { value: 'mm3', label: 'Cubic Millimeter (mm³)' },
    { value: 'cm3', label: 'Cubic Centimeter (cm³)' },
    { value: 'm3', label: 'Cubic Meter (m³)' },
    { value: 'l', label: 'Liter (L)' },
    { value: 'ml', label: 'Milliliter (mL)' },
    { value: 'in3', label: 'Cubic Inch (in³)' },
    { value: 'ft3', label: 'Cubic Foot (ft³)' },
    { value: 'yd3', label: 'Cubic Yard (yd³)' },
    { value: 'gal', label: 'US Gallon (gal)' },
    { value: 'qt', label: 'US Quart (qt)' },
];

const convertTheVolume = (value, fromUnit) => {
    if (!value || !fromUnit || !volumeToM3[fromUnit]) {
        return {
            mm3: 0,
            cm3: 0,
            ml: 0,
            l: 0,
            m3: 0,
            in3: 0,
            ft3: 0,
            yd3: 0,
            gal: 0,
            qt: 0,
        };
    }

    const valueInM3 = value * volumeToM3[fromUnit];
    return {
        mm3: Number((valueInM3 / volumeToM3.mm3).toFixed(6)),
        cm3: Number((valueInM3 / volumeToM3.cm3).toFixed(6)),
        ml: Number((valueInM3 / volumeToM3.ml).toFixed(6)),
        l: Number((valueInM3 / volumeToM3.l).toFixed(6)),
        m3: Number((valueInM3 / volumeToM3.m3).toFixed(6)),
        in3: Number((valueInM3 / volumeToM3.in3).toFixed(6)),
        ft3: Number((valueInM3 / volumeToM3.ft3).toFixed(6)),
        yd3: Number((valueInM3 / volumeToM3.yd3).toFixed(6)),
        gal: Number((valueInM3 / volumeToM3.gal).toFixed(6)),
        qt: Number((valueInM3 / volumeToM3.qt).toFixed(6)),
    };
};

const convertVolume = (req, res) => {
    const { value, fromUnit } = req.body;

    try {
        if (!value || isNaN(value) || value <= 0) {
            return res.status(400).json({ error: 'Invalid or missing value' });
        }
        if (!fromUnit || !volumeToM3[fromUnit]) {
            return res.status(400).json({
                error: 'Invalid or missing unit. Valid units are: mm3, cm3, m3, l, ml, in3, ft3, yd3, gal, qt'
            });
        }

        const result = convertTheVolume(Number(value), fromUnit);

        res.json({
            input: { value: Number(value), unit: fromUnit },
            conversions: result,
            availableUnits: volumeUnits.map(u => u.value),
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { volumeUnits, convertVolume };
