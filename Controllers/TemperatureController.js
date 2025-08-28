const tempToCelsius = {
    C: (value) => value,
    F: (value) => (value - 32) * 5 / 9,
    K: (value) => value - 273.15,
    R: (value) => (value - 491.67) * 5 / 9
};

const tempUnits = [
    { value: 'C', label: 'Celsius (°C)' },
    { value: 'F', label: 'Fahrenheit (°F)' },
    { value: 'K', label: 'Kelvin (K)' },
    { value: 'R', label: 'Rankine (°R)' }
];

const convertTheTemperature = (value, fromUnit) => {
    if (!value || !fromUnit || !tempToCelsius[fromUnit]) {
        return {
            C: 0,
            F: 0,
            K: 0,
            R: 0
        };
    }
    
    const celsius = tempToCelsius[fromUnit](value);
    return {
        C: Number(celsius.toFixed(2)),
        F: Number((celsius * 9 / 5 + 32).toFixed(2)),
        K: Number((celsius + 273.15).toFixed(2)),
        R: Number(((celsius + 273.15) * 9 / 5).toFixed(2))
    };
};

const convertTemperature = (req, res) => {
    const { value, fromUnit } = req.body;
    console.log(value);
    try {
        if (!value || isNaN(value)) {
            return res.status(400).json({ error: 'Invalid or missing value' });
        }
        if (!fromUnit || !tempToCelsius[fromUnit]) {
            return res.status(400).json({ error: 'Invalid or missing unit. Valid units are: C, F, K, R' });
        }
        const result = convertTheTemperature(Number(value), fromUnit);
        res.json({
            input: { value: Number(value), unit: fromUnit },
            conversions: result,
            availableUnits: tempUnits.map(u => u.value)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { tempUnits, convertTemperature };