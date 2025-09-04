const rebarTable = {
    '#2': { diaIn: 0.25, kgPerFt: 0.167 },
    '#3': { diaIn: 0.375, kgPerFt: 0.376 },
    '#4': { diaIn: 0.5, kgPerFt: 0.668 },
    '#5': { diaIn: 0.625, kgPerFt: 1.043 },
    '#6': { diaIn: 0.75, kgPerFt: 1.502 },
    '#7': { diaIn: 0.875, kgPerFt: 2.044 },
    '#8': { diaIn: 1.0, kgPerFt: 2.67 },
    '#9': { diaIn: 1.128, kgPerFt: 3.4 },
    '#10': { diaIn: 1.27, kgPerFt: 4.303 }
};

const calculateRebarWeight = (mode, rebarSize, customDiameter, customUnit, lengthFt) => {
    if (!mode || !lengthFt || isNaN(lengthFt) || lengthFt <= 0) {
        return { error: 'Invalid length' };
    }
    let weightKgPerFt, diaIn, diaMm;

    if (mode === 'standard') {
        if (!rebarSize || !rebarTable[rebarSize]) {
            return { error: 'Invalid rebar size' };
        }
        const rebar = rebarTable[rebarSize];
        weightKgPerFt = rebar.kgPerFt;
        diaIn = rebar.diaIn;
        diaMm = diaIn * 25.4;
    } else if (mode === 'custom') {
        if (!customDiameter || isNaN(customDiameter) || customDiameter <= 0) {
            return { error: 'Invalid custom diameter' };
        }
        if (!customUnit || (customUnit !== 'mm' && customUnit !== 'inch')) {
            return { error: 'Invalid custom unit' };
        }
        const diaMeters = customUnit === 'inch' ? customDiameter * 0.0254 : customDiameter / 1000;
        const area = Math.PI * Math.pow(diaMeters / 2, 2);
        const density = 7850; // kg/m³ for steel
        const weightPerMeter = area * density;
        weightKgPerFt = weightPerMeter / 3.28084;
        diaMm = customUnit === 'mm' ? customDiameter : customDiameter * 25.4;
        diaIn = customUnit === 'inch' ? customDiameter : customDiameter / 25.4;
    } else {
        return { error: 'Invalid mode' };
    }

    const totalWeight = weightKgPerFt * lengthFt;

    return {
        diameterIn: Number(diaIn.toFixed(0)),
        diameterMm: Number(diaMm.toFixed(0)),
        weightPerFt: Number(weightKgPerFt.toFixed(0)),
        totalWeight: Number(totalWeight.toFixed(0))
    };
};

const calculateRebar = (req, res) => {
    const { mode, rebarSize, customDiameter, customUnit, lengthFt } = req.body;
    try {
        const result = calculateRebarWeight(mode, rebarSize, customDiameter, customUnit, Number(lengthFt));
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json({
            input: { mode, rebarSize, customDiameter, customUnit, lengthFt: Number(lengthFt) },
            results: result
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { calculateRebar };