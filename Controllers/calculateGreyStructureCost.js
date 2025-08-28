const PR_FT_SQR = {
    excavation: 4,
    cement: 0.45,
    sand: 1.8054,
    aggregate: 1.3452,
    water: 35.75,
    steel: 4.25,
    backFillMaterial: 4,
    block: 1.25,
    doorFrame: 0.016,
    electricalConduiting: 1.2,
    sewage: 0.1,
    miscellaneous: 0.5,
    labor: 1,
    projectManagement: 1,
};

const FIXED_RATES = {
    excavation: 20,
    backFillMaterial: 10,
    doorFrame: 7800,
    electricalConduiting: 70,
    sewage: 500,
    miscellaneous: 100,
    labor: 850,
    projectManagement: 850,
};

const calculateGreyStructureCost = (req, res) => {
    const {
        area,
        cement,
        sand,
        aggregate,
        water,
        steel,
        block
    } = req.body;

    if (!area || isNaN(area) || Number(area) <= 0) {
        return res.status(400).json({ error: 'Invalid or missing built-up area' });
    }

    const builtup_area = Number(area);
    const rates = {
        cement: Number(cement),
        sand: Number(sand),
        aggregate: Number(aggregate),
        water: Number(water),
        steel: Number(steel),
        block: Number(block),
        ...FIXED_RATES,
    };

    // Check for invalid rates
    for (const [key, value] of Object.entries(rates)) {
        if (isNaN(value) || value < 0) {
            return res.status(400).json({ error: `Invalid rate for ${key}` });
        }
    }

    try {
        // Calculate costs
        const excavationCost = rates.excavation * PR_FT_SQR.excavation * builtup_area;
        const cementCost = rates.cement * PR_FT_SQR.cement * builtup_area;
        const sandCost = rates.sand * PR_FT_SQR.sand * builtup_area;
        const aggregateCost = rates.aggregate * PR_FT_SQR.aggregate * builtup_area;
        const waterCost = rates.water * PR_FT_SQR.water * builtup_area;
        const steelCost = rates.steel * PR_FT_SQR.steel * builtup_area;
        const blockCost = rates.block * PR_FT_SQR.block * builtup_area;
        const backFillMaterialCost = rates.backFillMaterial * PR_FT_SQR.backFillMaterial * builtup_area;
        const doorFrameCost = rates.doorFrame * PR_FT_SQR.doorFrame * builtup_area;
        const electricalConduitingCost = rates.electricalConduiting * PR_FT_SQR.electricalConduiting * builtup_area;
        const sewageCost = rates.sewage * PR_FT_SQR.sewage * builtup_area;
        const miscellaneousCost = rates.miscellaneous * PR_FT_SQR.miscellaneous * builtup_area;
        const laborCost = rates.labor * PR_FT_SQR.labor * builtup_area;
        const projectManagementCost = rates.projectManagement * PR_FT_SQR.projectManagement * builtup_area;

        const total_cost =
            excavationCost +
            cementCost +
            sandCost +
            aggregateCost +
            waterCost +
            steelCost +
            blockCost +
            backFillMaterialCost +
            doorFrameCost +
            electricalConduitingCost +
            sewageCost +
            miscellaneousCost +
            laborCost +
            projectManagementCost;

        // Monthly expense distribution
        const monthlyDistribution = [
            { period: 'Project Start', percentage: 6.5, amount: (6.5 / 100) * total_cost },
            { period: '1st Month', percentage: 16, amount: (16 / 100) * total_cost },
            { period: '2nd Month', percentage: 15, amount: (15 / 100) * total_cost },
            { period: '3rd Month', percentage: 13, amount: (13 / 100) * total_cost },
            { period: '4th Month', percentage: 16, amount: (16 / 100) * total_cost },
            { period: '5th Month', percentage: 10, amount: (10 / 100) * total_cost },
            { period: '6th Month', percentage: 9, amount: (9 / 100) * total_cost },
            { period: '7th Month', percentage: 8, amount: (8 / 100) * total_cost },
            { period: '8th Month', percentage: 6, amount: (6 / 100) * total_cost },
        ];

        console.log(cementCost)


        const response = {
            input: {
                builtup_area,
                rates: {
                    cement: rates.cement,
                    sand: rates.sand,
                    aggregate: rates.aggregate,
                    water: rates.water,
                    steel: rates.steel,
                    block: rates.block,
                },
            },
            results: {
                builtup_area,
                excavationCost: Number(excavationCost.toFixed(2)),
                cementCost: Number(cementCost.toFixed(2)),
                sandCost: Number(sandCost.toFixed(2)),
                aggregateCost: Number(aggregateCost.toFixed(2)),
                waterCost: Number(waterCost.toFixed(2)),
                steelCost: Number(steelCost.toFixed(2)),
                blockCost: Number(blockCost.toFixed(2)),
                backFillMaterialCost: Number(backFillMaterialCost.toFixed(2)),
                doorFrameCost: Number(doorFrameCost.toFixed(2)),
                electricalConduitingCost: Number(electricalConduitingCost.toFixed(2)),
                sewageCost: Number(sewageCost.toFixed(2)),
                miscellaneousCost: Number(miscellaneousCost.toFixed(2)),
                laborCost: Number(laborCost.toFixed(2)),
                projectManagementCost: Number(projectManagementCost.toFixed(2)),
                total_cost: Number(total_cost.toFixed(2)),
                cementPrFtSqr: PR_FT_SQR.cement,
                sandPrFtSqr: PR_FT_SQR.sand,
                aggregatePrFtSqr: PR_FT_SQR.aggregate,
                waterPrFtSqr: PR_FT_SQR.water,
                steelPrFtSqr: PR_FT_SQR.steel,
                blockPrFtSqr: PR_FT_SQR.block,
                backFillMaterialPrFtSqr: PR_FT_SQR.backFillMaterial,
                doorFramePrFtSqr: PR_FT_SQR.doorFrame,
                electricalConduitingPrFtSqr: PR_FT_SQR.electricalConduiting,
                sewagePrFtSqr: PR_FT_SQR.sewage,
                miscellaneousPrFtSqr: PR_FT_SQR.miscellaneous,
                laborPrFtSqr: PR_FT_SQR.labor,
                projectManagementPrFtSqr: PR_FT_SQR.projectManagement,
                monthlyDistribution,
            },
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { calculateGreyStructureCost };