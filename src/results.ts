// NEC streamed-v2 package measurement, 24 October 2026.
export const NEC = {
  originalBytes: 13_479_247_511,
  packageBytes: 2_457_415_643,
  originalCoefficients: 6_738_417_664,
  coefficients: 3_323_032_892,
} as const
export const ORIGINAL_GB = NEC.originalBytes / 1e9
export const NEC_GB = NEC.packageBytes / 1e9
