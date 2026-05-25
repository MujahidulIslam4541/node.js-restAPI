
import { Router } from 'express';
import { profileController } from './profiels.controller';

const router=Router();

router.post('/',profileController.createProfile);


export const profileRouter=router