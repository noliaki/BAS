float tProgress = clamp(uProgress - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;
tProgress = easeCubicInOut(tProgress);
vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, aAxisAngle.w + (uTime / 10.0));
vec3 color = hsv(cos(uTime / 500.0), 0.3, 0.7);
