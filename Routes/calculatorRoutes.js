import express from 'express';
import { calculate } from '../Controllers/FinishingCostController.js';
import { convertLength } from '../Controllers/LengthnDistanceController.js';
import { convertVolume } from '../Controllers/VolumeController.js';
import { convertArea } from '../Controllers/AreaController.js';
import { convertTemperature } from "../Controllers/TemperatureController.js"
import { convertForce } from "../Controllers/ForceController.js"
import { convertAngle } from "../Controllers/angleController.js"
import { convertDensity } from "../Controllers/DensityController.js"
import { calculateRebar } from "../Controllers/RebarWeightController.js"
import { calculateConcreteMix } from "../Controllers/MixController.js"
import { convertPowerEnergy } from "../Controllers/PowernEnergyController.js"
import { calculateGreyStructureCost } from "../Controllers/calculateGreyStructureCost.js"
import { calculateWoodVolume } from "../Controllers/woodVolumeCalculator.js"
import { calculateDoorVolume } from "../Controllers/doorVolumeController.js"

const router = express.Router();

router.post('/finishing-cost-predictive/calculate', calculate);
router.post('/length-distance/convert', convertLength);
router.post('/volume/convert', convertVolume);
router.post('/area/convert', convertArea);
router.post('/temperature/convert', convertTemperature);
router.post('/force/convert', convertForce);
router.post('/angle/convert', convertAngle);
router.post('/density/convert', convertDensity);
router.post('/rebar/calculate', calculateRebar);
router.post('/concrete-mix/calculate', calculateConcreteMix);
router.post('/power-energy/convert', convertPowerEnergy);
router.post('/grey-structure/calculate', calculateGreyStructureCost);
router.post('/wood-volume/calculate', calculateWoodVolume);
router.post('/door-volume/calculate', calculateDoorVolume);

export default router;