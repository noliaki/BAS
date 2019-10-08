float tProgress = clamp(uProgress - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;
tProgress = easeCircInOut(tProgress);
vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, radians(aAxisAngle.w) + (uTime / 10.0));
vec3 color = hsv(cos(uTime / 80.0) + aColor.x, aColor.y, aColor.z);
float lat = (uTime / aStagger.z) + aStagger.x;
float lng = (uTime / aStagger.z) + aStagger.y;
float phi = lat * (PI / 180.0);
float theta = (lng - 180.0) * (PI / 180.0);
float xDist = -aStagger.w * cos(theta) * cos(phi);
float yDist = aStagger.w * sin(phi);
float zDist = aStagger.w * cos(phi) * sin(theta);
