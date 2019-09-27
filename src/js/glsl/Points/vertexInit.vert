float tProgress = clamp(uTime - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;
tProgress = easeExpoInOut(tProgress);
