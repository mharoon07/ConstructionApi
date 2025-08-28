import express from 'express';
import { calculate } from '../Controllers/FinishingCostController.js';
// import * as greyStructureController from '../Controllers/greyStructureController.js';

const router = express.Router();

router.post('/finishing-cost-predictive/calculate', calculate);
// router.post('/grey-structure-cost/calculate', greyStructureController.calculate);

// Add more routes for other calculators as needed
// router.post('/other-calculator/calculate', otherCalculatorController.calculate);

export default router;