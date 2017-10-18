import { calculateTimeSlots } from './LinkProvider';

describe('basic', () => {

  it('should sum to max', () => {
    const max = 60;
    const min = 5;

    const result = calculateTimeSlots([5, 5, 5, 5], max, min);

    expect(result.reduce((acc, r) => acc + r, 0)).toBe(max);
  });

  it('should give equal slots', () => {
    const max = 4;
    const min = 1;

    const result = calculateTimeSlots([5, 5, 5, 5], max, min);

    expect(result[0]).toBe(result[1]);
    expect(result[1]).toBe(result[2]);
    expect(result[2]).toBe(result[3]);
  });

  it('should round up first item', () => {
    const max = 100;
    const min = 1;

    const result = calculateTimeSlots([5, 5, 5], max, min);

    expect(result[0]).toBe(34);
    expect(result[1]).toBe(33);
    expect(result[2]).toBe(33);
  });

  it('should cut last item', () => {
    const max = 15;
    const min = 1;

    const result = calculateTimeSlots([5, 5, 5, 1], max, min);

    expect(result[0]).toBe(5);
    expect(result[1]).toBe(5);
    expect(result[2]).toBe(5);
    expect(result[3]).toBeUndefined();
  });
});