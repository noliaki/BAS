float scl = easeQuadOut(tProgress, 0.5, 1.5, 1.0);
transformed *= scl;
transformed = rotateVector(tQuat, transformed);
transformed += mix(aStartPosition, aEndPosition, tProgress);
