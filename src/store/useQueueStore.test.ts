import { describe, expect, it } from 'vitest';
import { evaluateTriageStatus } from './useQueueStore';

describe('evaluateTriageStatus', () => {
  it('marks critical cases as red', () => {
    expect(
      evaluateTriageStatus({
        chiefComplaint: 'Chest pain',
        painScore: 9,
        systolicBloodPressure: 185,
        pulse: 125,
        oxygenSaturation: 88,
      })
    ).toBe('red');
  });

  it('marks moderate cases as yellow', () => {
    expect(
      evaluateTriageStatus({
        chiefComplaint: 'Severe abdominal pain',
        painScore: 6,
        systolicBloodPressure: 150,
        pulse: 110,
        oxygenSaturation: 96,
      })
    ).toBe('yellow');
  });

  it('marks minor cases as green', () => {
    expect(
      evaluateTriageStatus({
        chiefComplaint: 'Minor skin rash',
        painScore: 2,
        systolicBloodPressure: 118,
        pulse: 74,
        oxygenSaturation: 98,
      })
    ).toBe('green');
  });
});
