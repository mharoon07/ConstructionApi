const calculateDoorVolume = (req, res) => {
    const { doors } = req.body;

    // Input validation
    if (!doors || !Array.isArray(doors) || doors.length === 0) {
        return res.status(400).json({ error: 'Missing required field: doors array is required' });
    }

    try {
        const results = doors.map((door) => {
            const {
                doorType,
                height,
                width,
                thickness,
                stile,
                top,
                mid,
                bottom,
                panels,
                quantity,
            } = door;

            // Validate inputs
            if (
                !['solid', 'net'].includes(doorType) ||
                !height ||
                !width ||
                !thickness ||
                !stile ||
                !top ||
                !mid ||
                !bottom ||
                !quantity ||
                (doorType === 'solid' && !panels) ||
                isNaN(Number(height)) ||
                isNaN(Number(width)) ||
                isNaN(Number(thickness)) ||
                isNaN(Number(stile)) ||
                isNaN(Number(top)) ||
                isNaN(Number(mid)) ||
                isNaN(Number(bottom)) ||
                isNaN(Number(quantity)) ||
                (doorType === 'solid' && isNaN(Number(panels)))
            ) {
                throw new Error('Invalid door parameters: all fields must be valid numbers, and panels required for solid doors');
            }
            if (Number(quantity) < 1 || (doorType === 'solid' && Number(panels) < 0)) {
                throw new Error('Quantity must be at least 1, and panels cannot be negative');
            }

            // Convert feet to inches for height and width
            const h = Number(height) * 12;
            const w = Number(width) * 12;
            const t = Number(thickness);
            const s = Number(stile);
            const tr = Number(top);
            const mr = Number(mid);
            const br = Number(bottom);
            const p = doorType === 'solid' ? Number(panels) : 0;
            const q = Number(quantity);

            // Calculate volumes
            const railLength = w - 2 * s;
            const stileVol = 2 * (h * s * t);
            const topVol = railLength * tr * t;
            const midVol = railLength * mr * t;
            const bottomVol = railLength * br * t;

            let panelVol = 0;
            if (p > 0) {
                const panelHeightArea = h - (tr + mr + br);
                const panelHeight = panelHeightArea / p + 1;
                const panelWidth = railLength + 1;
                const panelThickness = t - 0.25;
                panelVol = p * (panelHeight * panelWidth * panelThickness);
            }

            const subtotal = stileVol + topVol + midVol + bottomVol + panelVol;
            const totalPerDoor = subtotal * 1.1; // 10% extra
            const totalIn3 = totalPerDoor * q;
            const totalFt3 = totalIn3 / 1728;
            const totalBdFt = totalIn3 / 144;

            return {
                perDoorIn3: Number(totalPerDoor.toFixed(2)),
                totalIn3: Number(totalIn3.toFixed(2)),
                totalFt3: Number(totalFt3.toFixed(2)),
                totalBdFt: Number(totalBdFt.toFixed(2)),
            };
        });

        // Calculate totals
        const totals = results.reduce(
            (acc, result) => ({
                totalIn3: acc.totalIn3 + result.totalIn3,
                totalFt3: acc.totalFt3 + result.totalFt3,
                totalBdFt: acc.totalBdFt + result.totalBdFt,
            }),
            { totalIn3: 0, totalFt3: 0, totalBdFt: 0 }
        );

        res.status(200).json({ results, totals });
    } catch (error) {
        console.error('Error calculating door volume:', error.message);
        res.status(400).json({ error: error.message });
    }
};

export {
    calculateDoorVolume,
};