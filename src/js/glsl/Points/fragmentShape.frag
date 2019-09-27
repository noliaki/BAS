float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
float pct = 1.0 - smoothstep(0.0, 1.0, distanceToCenter);
gl_FragColor = vec4(gl_FragColor.rgb, pct * gl_FragColor.a);
