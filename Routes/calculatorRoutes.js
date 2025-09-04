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
import { calculateDoorBeading } from "../Controllers/doorBeadingController.js"
import { generateDoorBOQ } from "../Controllers/generateDoorBOQ.js"
import { calculateMoistureContent } from "../Controllers/moistureContentController.js"
import { calculateLeanConcrete } from "../Controllers/calculateLeanConcrete.js"
import { calculateFoundationConcrete } from "../Controllers/foundationConcreteController.js"
import { calculateRCCColumn } from "../Controllers/calculateRCCColumn.js"
import { calculateUndergroundTank } from "../Controllers/calculateUndergroundTank.js"
import { calculateRetainingWall } from "../Controllers/calculateRetainingWall.js"
import { calculatePlinthLeanBeam } from "../Controllers/calculatePlinthLeanBeam.js"
import { calculatePlinthBeam } from "../Controllers/calculatePlinthBeam.js"
import { calculateRCCWaterTank } from "../Controllers/calculateRCCWaterTank.js"
import { calculateSlabConcrete } from "../Controllers/calculateSlabConcrete.js"
import { calculateLShapedStair } from "../Controllers/calculateLShapedStair.js"
import { calculateUShapedStair } from "../Controllers/calculateUShapedStair.js"

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
router.post('/door-beading/calculate', calculateDoorBeading);
router.post('/door-boq/calculate', generateDoorBOQ);
router.post('/moisture-content/calculate', calculateMoistureContent);
router.post('/lean-concrete/calculate', calculateLeanConcrete);
router.post('/foundation-concrete/calculate', calculateFoundationConcrete);
router.post('/rcc-column/calculate', calculateRCCColumn);
router.post('/underground-tank/calculate', calculateUndergroundTank);
router.post('/retaining-wall/calculate', calculateRetainingWall);
router.post('/plinth-lean-beam/calculate', calculatePlinthLeanBeam);
router.post('/plinth-beam/calculate', calculatePlinthBeam);
router.post('/rcc-water-tank/calculate', calculateRCCWaterTank);
router.post('/slab-concrete/calculate', calculateSlabConcrete);
router.post('/l-shaped-stair/calculate', calculateLShapedStair);
router.post('/u-shaped-stair/calculate', calculateUShapedStair);

export default router;
