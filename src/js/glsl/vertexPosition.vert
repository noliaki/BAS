float scl = ((aScale.y - mod(uTime, aScale.y)) / aScale.y) * aScale.x * step(0.99, aScale.z) * min(min(uLoudness, 10.0), aScale.w) + aScale.w;
transformed *= scl;
transformed = rotateVector(tQuat, transformed);
transformed += mix(aStartPosition, aEndPosition, tProgress);
transformed.x += xDist * (1.1 - tProgress);
transformed.y += yDist * (1.1 - tProgress);
transformed.z += zDist * (1.1 - tProgress);
