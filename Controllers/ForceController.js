const forceToN = {
    N: 1,
    kN: 1000,
    dyn: 1e-5,
    gf: 0.00980665,
    kgf: 9.80665,
    lbf: 4.44822,
    kip: 4448.22
};

const forceUnits = [
    { value: 'N', label: 'Newton (N)' },
    { value: 'kN', label: 'Kilonewton (kN)' },
    { value: 'dyn', label: 'Dyne (dyn)' },
    { value: 'gf', label: 'Gram-force (gf)' },
    { value: 'kgf', label: 'Kilogram-force (kgf)' },
    { value: 'lbf', label: 'Pound-force (lbf)' },
    { value: 'kip', label: 'Kip (kip)' }
];

const convertTheForce = (value, fromUnit) => {
    if (!value || !fromUnit || !forceToN[fromUnit]) {
        return {
            N: 0,
            kN: 0,
            dyn: 0,
            gf: 0,
            kgf: 0,
            lbf: 0,
            kip: 0
        };
    }

    const valueInN = value * forceToN[fromUnit];
    return {
        N: Number(valueInN.toFixed(6)),
        kN: Number((valueInN / forceToN.kN).toFixed(6)),
        dyn: Number((valueInN / forceToN.dyn).toFixed(6)),
        gf: Number((valueInN / forceToN.gf).toFixed(6)),
        kgf: Number((valueInN / forceToN.kgf).toFixed(6)),
        lbf: Number((valueInN / forceToN.lbf).toFixed(6)),
        kip: Number((valueInN / forceToN.kip).toFixed(6))
    };
};

const convertForce = (req, res) => {
    const { value, fromUnit } = req.body;

    try {
        if (!value || isNaN(value)) {
            return res.status(400).json({ error: 'Invalid or missing value' });
        }
        if (!fromUnit || !forceToN[fromUnit]) {
            return res.status(400).json({ error: 'Invalid or missing unit. Valid units are: N, kN, dyn, gf, kgf, lbf, kip' });
        }
        const result = convertTheForce(Number(value), fromUnit);
        res.json({
            input: { value: Number(value), unit: fromUnit },
            conversions: result,
            availableUnits: forceUnits.map(u => u.value)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { forceUnits, convertForce };