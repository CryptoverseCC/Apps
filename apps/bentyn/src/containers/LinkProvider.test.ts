import { calculateTimeSlots } from './LinkProvider';

describe('basic', () => {

  it('should sum to max', () => {
    const max = 60;
    const min = 5;

    const result = calculateTimeSlots([5, 5, 5, 5], max, min);

    expect(result[0] + result[1] + result[2] + result[3]).toBe(max);
  });

  it('should give equal slots', () => {
    const max = 4;
    const min = 1;

    const result = calculateTimeSlots([5, 5, 5, 5], max, min);

    expect(result[0]).toBe(1);
    expect(result[1]).toBe(1);
    expect(result[2]).toBe(1);
    expect(result[3]).toBe(1);
  });

  it('should distribute min to each item and rest proportionally', () => {
    const max = 15;
    const min = 3;

    const result = calculateTimeSlots([5, 5, 5, 1], max, min);

    expect(result[0]).toBe(3 + 5 / 16 * (15 - 12));
    expect(result[1]).toBe(3 + 5 / 16 * (15 - 12));
    expect(result[2]).toBe(3 + 5 / 16 * (15 - 12));
    expect(result[3]).toBe(3 + 1 / 16 * (15 - 12));
  });

  it('should throw exception when max is smaller that items*min', () => {
    const max = 15;
    const min = 5;

    expect(() => calculateTimeSlots([5, 5, 5, 5], max, min)).toThrowError();
  });
});
