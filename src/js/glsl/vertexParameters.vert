uniform float uTime;
uniform float uProgress;
uniform float uLoudness;
uniform float uStrLen;
attribute vec2 aDelayDuration;
attribute vec3 aStartPosition;
attribute vec3 aControl0;
attribute vec3 aEndPosition;
attribute vec4 aAxisAngle;
attribute vec4 aStagger;
attribute vec4 aScale;
attribute vec4 aColor;
attribute vec4 aStaggerTime;

vec3 hsv(float h, float s, float v){
  vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
  return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}
