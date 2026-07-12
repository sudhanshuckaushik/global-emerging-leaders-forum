#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_scale;
uniform float u_angle;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_stop1;
uniform float u_stop2;
uniform float u_type; // 0.0 for linear, 1.0 for radial
uniform float u_centerX;
uniform float u_centerY;

#define PI 3.14159265359

// Pseudo-random noise generator to break up color banding
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    // Normalise UV coordinates to 0.0 - 1.0
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    float position = 0.0;
    float t = u_time * u_speed * 0.2;
    
    if (u_type > 0.5) {
        // Aspect ratio correction to keep circles circular
        float aspect = u_resolution.x / u_resolution.y;
        vec2 uvCentered = uv - vec2(u_centerX, u_centerY);
        if (aspect > 1.0) {
            uvCentered.x *= aspect;
        } else {
            uvCentered.y /= aspect;
        }
        
        float dist = length(uvCentered);
        
        // Subtracting time scrolls/radiates the radial rings outwards
        position = dist * u_scale - t;
    } else {
        // Convert angle to radians and create direction vector
        float rad = u_angle * PI / 180.0;
        vec2 dir = vec2(cos(rad), sin(rad));
        
        position = dot(uv, dir) * u_scale - t;
    }
    
    // Convert position to a seamless triangle wave between 0.0 and 1.0
    float progress = 1.0 - abs(fract(position) * 2.0 - 1.0);
    
    // Normalize progress based on stop1 and stop2 limits
    float normalizedFactor = 0.0;
    if (u_stop2 > u_stop1) {
        normalizedFactor = clamp((progress - u_stop1) / (u_stop2 - u_stop1), 0.0, 1.0);
    } else {
        normalizedFactor = step(u_stop1, progress);
    }
    
    // Apply sine easing (in-out) to the normalized factor
    float factor = 0.5 - 0.5 * cos(normalizedFactor * PI);
    
    // Mix the two colors
    vec3 finalColor = mix(u_color1, u_color2, factor);
    
    // Add subtle dithering noise to prevent 8-bit color banding
    float noise = (random(gl_FragCoord.xy + u_time * 0.01) - 0.5) * 0.015;
    finalColor += vec3(noise);
    
    fragColor = vec4(finalColor, 1.0);
}
