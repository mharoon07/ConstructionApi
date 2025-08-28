
const angleToDeg = {
    deg: 1,
    rad: 180 / Math.PI,
    grad: 0.9,
    arcmin: 1 / 60,
    arcsec: 1 / 3600
};

const angleUnits = [
    { value: 'deg', label: 'Degrees (°)' },
    { value: 'rad', label: 'Radians (rad)' },
    { value: 'grad', label: 'Gradians (gon)' },
    { value: 'arcmin', label: 'Arcminutes (′)' },
    { value: 'arcsec', label: 'Arcseconds (″)' }
];

const convertTheAngle = (value, fromUnit) => {
    if (!value || !fromUnit || !angleToDeg[fromUnit]) {
        return {
            deg: 0,
            rad: 0,
            grad: 0,
            arcmin: 0,
            arcsec: 0
        };
    }

    const valueInDegrees = value * angleToDeg[fromUnit];
    return {
        deg: Number(valueInDegrees.toFixed(6)),
        rad: Number((valueInDegrees / angleToDeg.rad).toFixed(6)),
        grad: Number((valueInDegrees / angleToDeg.grad).toFixed(6)),
        arcmin: Number((valueInDegrees / angleToDeg.arcmin).toFixed(6)),
        arcsec: Number((valueInDegrees / angleToDeg.arcsec).toFixed(6))
    };
};

const convertAngle = (req, res) => {
    const { value, fromUnit } = req.body;

    try {
        if (!value || isNaN(value)) {
            return res.status(400).json({ error: 'Invalid or missing value' });
        }
        if (!fromUnit || !angleToDeg[fromUnit]) {
            return res.status(400).json({ error: 'Invalid or missing unit. Valid units are: deg, rad, grad, arcmin, arcsec' });
        }
        const result = convertTheAngle(Number(value), fromUnit);
        res.json({
            input: { value: Number(value), unit: fromUnit },
            conversions: result,
            availableUnits: angleUnits.map(u => u.value)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { angleUnits, convertAngle };
