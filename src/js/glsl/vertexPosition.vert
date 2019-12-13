float scl = ((aScale.y - mod(uTime, aScale.y)) / aScale.y) * aScale.x * step(0.99, aScale.z) * min(min(uLoudness, 10.0), aScale.w) + aScale.w;
transformed *= scl;
transformed = rotateVector(tQuat, transformed);
transformed += cubicBezier(aStartPosition, aControl0, aControl0, aEndPosition, tProgress);
transformed.x += noiseX * (width * (1.0 - tProgress) + width * 0.05);
transformed.y += noiseY * (width * (1.0 - tProgress) + width * 0.05);
transformed.z += noiseZ * (width * (1.0 - tProgress) + width * 0.05);
