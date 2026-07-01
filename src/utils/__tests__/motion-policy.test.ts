import { describe, expect, it } from 'vitest';
import { getAppMotionPolicy } from '../../lib/motion';

describe('getAppMotionPolicy', () => {
  it('keeps concise motion on fine pointer desktop', () => {
    const policy = getAppMotionPolicy({
      prefersReducedMotion: false,
      isCoarsePointer: false,
      isNarrowViewport: false
    });

    expect(policy.shouldReduce).toBe(false);
    expect(policy.shouldConstrain).toBe(false);
    expect(policy.allowDecorativeMotion).toBe(true);
    expect(policy.allowLayoutMotion).toBe(true);
    expect(policy.scrollBehavior).toBe('smooth');
    expect(policy.transition).toMatchObject({ duration: 0.24 });
  });

  it('uses low motion on coarse pointer devices', () => {
    const policy = getAppMotionPolicy({
      prefersReducedMotion: false,
      isCoarsePointer: true,
      isNarrowViewport: false
    });

    expect(policy.shouldReduce).toBe(true);
    expect(policy.shouldConstrain).toBe(true);
    expect(policy.allowDecorativeMotion).toBe(false);
    expect(policy.allowLayoutMotion).toBe(false);
    expect(policy.scrollBehavior).toBe('auto');
    expect(policy.transition).toMatchObject({ duration: 0 });
  });

  it('honors reduced motion even on desktop', () => {
    const policy = getAppMotionPolicy({
      prefersReducedMotion: true,
      isCoarsePointer: false,
      isNarrowViewport: false
    });

    expect(policy.shouldReduce).toBe(true);
    expect(policy.allowDecorativeMotion).toBe(false);
    expect(policy.scrollBehavior).toBe('auto');
  });
});
