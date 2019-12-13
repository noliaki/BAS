float tProgress = clamp(uProgress - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;
tProgress = easeCircInOut(tProgress);
float noiseX = snoise(vec3(aStagger.x, aStagger.y, uTime / (width * aStagger.z)));
float noiseY = snoise(vec3(aStagger.y, aStagger.z, uTime / (width * aStagger.x)));
float noiseZ = snoise(vec3(aStagger.z, aStagger.x, uTime / (width * aStagger.y)));
float noise = (noiseX + noiseY + noiseZ) / 3.0;
vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, radians(aAxisAngle.w) + (uTime / 5.0) * abs(noise));
vec3 color = hsv(cos(uTime / 80.0) + (noise * 0.5), 0.66, 0.98);
