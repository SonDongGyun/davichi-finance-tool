export const STEP_LANDING = 'landing';
export const STEP_UPLOAD = 'upload';
export const STEP_MAPPING = 'mapping';
export const STEP_SELECT = 'select';
export const STEP_RESULT = 'result';

export const MODE_MONTHLY = 'monthly';
export const MODE_SHEET = 'sheet';

export type Step =
  | typeof STEP_LANDING
  | typeof STEP_UPLOAD
  | typeof STEP_MAPPING
  | typeof STEP_SELECT
  | typeof STEP_RESULT;

export type AppMode = typeof MODE_MONTHLY | typeof MODE_SHEET;
