const conversionRates = {
    mm: {
        mm: 1,
        cm: 0.1,
        m: 0.001,
        km: 0.000001,
        in: 0.0393701,
        ft: 0.00328084,
        yd: 0.00109361,
        mi: 0.000000621371,
    },
    cm: {
        mm: 10,
        cm: 1,
        m: 0.01,
        km: 0.00001,
        in: 0.393701,
        ft: 0.0328084,
        yd: 0.0109361,
        mi: 0.00000621371,
    },
    m: {
        mm: 1000,
        cm: 100,
        m: 1,
        km: 0.001,
        in: 39.3701,
        ft: 3.28084,
        yd: 1.09361,
        mi: 0.000621371,
    },
    km: {
        mm: 1000000,
        cm: 100000,
        m: 1000,
        km: 1,
        in: 39370.1,
        ft: 3280.84,
        yd: 1093.61,
        mi: 0.621371,
    },
    in: {
        mm: 25.4,
        cm: 2.54,
        m: 0.0254,
        km: 0.0000254,
        in: 1,
        ft: 0.0833333,
        yd: 0.0277778,
        mi: 0.0000157828,
    },
    ft: {
        mm: 304.8,
        cm: 30.48,
        m: 0.3048,
        km: 0.0003048,
        in: 12,
        ft: 1,
        yd: 0.333333,
        mi: 0.000189394,
    },
    yd: {
        mm: 914.4,
        cm: 91.44,
        m: 0.9144,
        km: 0.0009144,
        in: 36,
        ft: 3,
        yd: 1,
        mi: 0.000568182,
    },
    mi: {
        mm: 1609344,
        cm: 160934.4,
        m: 1609.344,
        km: 1.609344,
        in: 63360,
        ft: 5280,
        yd: 1760,
        mi: 1,
    },
};

const units = [
    { value: 'mm', label: 'Millimeter (mm)' },
    { value: 'cm', label: 'Centimeter (cm)' },
    { value: 'm', label: 'Meter (m)' },
    { value: 'km', label: 'Kilometer (km)' },
    { value: 'in', label: 'Inch (in)' },
    { value: 'ft', label: 'Foot (ft)' },
    { value: 'yd', label: 'Yard (yd)' },
    { value: 'mi', label: 'Mile (mi)' },
];

const convert = (value, fromUnit) => {
    if (!value || !fromUnit || !conversionRates[fromUnit]) {
        return {
            mm: 0,
            cm: 0,
            m: 0,
            km: 0,
            in: 0,
            ft: 0,
            yd: 0,
            mi: 0,
        };
    }

    const conversions = conversionRates[fromUnit];
    return {
        mm: Number((value * conversions.mm).toFixed(0)),
        cm: Number((value * conversions.cm).toFixed(0)),
        m: Number((value * conversions.m).toFixed(0)),
        km: Number((value * conversions.km).toFixed(0)),
        in: Number((value * conversions.in).toFixed(0)),
        ft: Number((value * conversions.ft).toFixed(0)),
        yd: Number((value * conversions.yd).toFixed(0)),
        mi: Number((value * conversions.mi).toFixed(0)),
    };
};

export const convertLength = (req, res) => {
    const { value, fromUnit } = req.body;

    try {
        if (!value || isNaN(value) || value <= 0) {
            return res.status(400).json({ error: 'Invalid or missing value' });
        }
        if (!fromUnit || !conversionRates[fromUnit]) {
            return res.status(400).json({ error: 'Invalid or missing unit. Valid units are: mm, cm, m, km, in, ft, yd, mi' });
        }

        const result = convert(Number(value), fromUnit);

        res.json({
            input: { value: Number(value), unit: fromUnit },
            conversions: result,
            availableUnits: units.map(u => u.value),
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { units, convert };