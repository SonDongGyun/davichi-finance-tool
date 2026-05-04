import {
  STEP_LANDING,
  STEP_UPLOAD,
  STEP_MAPPING,
  STEP_SELECT,
  STEP_RESULT,
  MODE_MONTHLY,
  type Step,
  type AppMode,
} from '../constants/steps';
import type {
  AnalysisResult,
  ColumnConfig,
  DateRange,
  ParsedFile,
  SheetInfo,
  SideSelection,
} from '../types';

export interface PasswordState {
  open: boolean;
  file: File | null;
  error: string;
  loading: boolean;
}

export type MonthlyMode = 'single' | 'range';

export interface AppState {
  step: Step;
  mode: AppMode;
  fileData: ParsedFile | null;
  columnConfig: ColumnConfig | null;
  months: string[];
  monthlyMode: MonthlyMode;
  range1: DateRange;
  range2: DateRange;
  sheetInfos: SheetInfo[];
  side1: SideSelection;
  side2: SideSelection;
  analysisResult: AnalysisResult | null;
  password: PasswordState;
}

export const EMPTY_RANGE: DateRange = { start: '', end: '' };
export const EMPTY_SIDE: SideSelection = { sheetName: '', checkedMonths: new Set() };
export const PASSWORD_INITIAL: PasswordState = { open: false, file: null, error: '', loading: false };

export const initialState: AppState = {
  step: STEP_LANDING,
  mode: MODE_MONTHLY,
  fileData: null,
  columnConfig: null,
  months: [],
  monthlyMode: 'single',
  range1: EMPTY_RANGE,
  range2: EMPTY_RANGE,
  sheetInfos: [],
  side1: EMPTY_SIDE,
  side2: EMPTY_SIDE,
  analysisResult: null,
  password: PASSWORD_INITIAL,
};

// Discriminated union — every dispatcher gets exhaustive type checking.
export type AppAction =
  | { type: 'SELECT_MODE'; mode: AppMode }
  | { type: 'BACK_TO_LANDING' }
  | { type: 'FILE_PARSED'; parsed: ParsedFile }
  | { type: 'PASSWORD_REQUIRED'; file: File }
  | { type: 'PASSWORD_SUBMITTING' }
  | { type: 'PASSWORD_FAILED'; error: string }
  | { type: 'PASSWORD_CLOSED' }
  | {
      type: 'COLUMN_CONFIRMED';
      config: ColumnConfig;
      months?: string[];
      sheetInfos?: SheetInfo[];
      range1?: DateRange;
      range2?: DateRange;
      side1?: SideSelection;
      side2?: SideSelection;
    }
  | { type: 'ANALYSIS_DONE'; result: AnalysisResult }
  | { type: 'BACK_TO_SELECT' }
  | { type: 'SET_MONTHLY_MODE'; value: MonthlyMode }
  | { type: 'SET_RANGE1'; value: DateRange }
  | { type: 'SET_RANGE2'; value: DateRange }
  | { type: 'SET_SIDE1'; value: SideSelection }
  | { type: 'SET_SIDE2'; value: SideSelection };

// Single source of truth for all step/mode/file/comparison transitions.
// Previously these were 13 separate useStates whose resets had to be kept in
// sync manually — easy to forget a field on a new transition.
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_MODE':
      return { ...initialState, mode: action.mode, step: STEP_UPLOAD };

    case 'BACK_TO_LANDING':
      return { ...initialState };

    case 'FILE_PARSED':
      return {
        ...state,
        fileData: action.parsed,
        step: STEP_MAPPING,
        analysisResult: null,
        password: PASSWORD_INITIAL,
      };

    case 'PASSWORD_REQUIRED':
      return {
        ...state,
        password: { open: true, file: action.file, error: '', loading: false },
      };

    case 'PASSWORD_SUBMITTING':
      return {
        ...state,
        password: { ...state.password, loading: true, error: '' },
      };

    case 'PASSWORD_FAILED':
      return {
        ...state,
        password: { ...state.password, loading: false, error: action.error },
      };

    case 'PASSWORD_CLOSED':
      return { ...state, password: PASSWORD_INITIAL };

    case 'COLUMN_CONFIRMED':
      return {
        ...state,
        columnConfig: action.config,
        months: action.months ?? state.months,
        sheetInfos: action.sheetInfos ?? state.sheetInfos,
        range1: action.range1 ?? state.range1,
        range2: action.range2 ?? state.range2,
        side1: action.side1 ?? state.side1,
        side2: action.side2 ?? state.side2,
        step: STEP_SELECT,
      };

    case 'ANALYSIS_DONE':
      return { ...state, analysisResult: action.result, step: STEP_RESULT };

    case 'BACK_TO_SELECT':
      return { ...state, step: STEP_SELECT, analysisResult: null };

    case 'SET_MONTHLY_MODE':
      return { ...state, monthlyMode: action.value };

    case 'SET_RANGE1':
      return { ...state, range1: action.value };

    case 'SET_RANGE2':
      return { ...state, range2: action.value };

    case 'SET_SIDE1':
      return { ...state, side1: action.value };

    case 'SET_SIDE2':
      return { ...state, side2: action.value };

    default:
      return state;
  }
}
