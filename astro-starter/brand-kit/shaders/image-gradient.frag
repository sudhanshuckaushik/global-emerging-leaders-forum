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

// Image layer uniforms (derived in JS, not Leva-bound except u_imageSize)
uniform sampler2D u_image;
uniform float u_hasImage;
uniform float u_imageAspect; // width / height of the dropped image
uniform float u_imageSize;   // slot side as fraction of the canvas short edge
uniform vec3 u_mapLight;     // duotone highlight stop (auto-derived)
uniform vec3 u_mapDark;      // duotone shadow stop (auto-derived)

#define PI 3.14159265359

// Pseudo-random noise generator to break up color banding
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// ---- image layer chunk (self-contained, promotable to a shared layer later) ----

// Maps the slot's local 0-1 UV to a centered cover-fit crop of the image
vec2 coverFitUV(vec2 local, float imageAspect) {
    vec2 iuv = vec2(local.x, 1.0 - local.y); // texture origin is top-left
    if (imageAspect > 1.0) {
        iuv.x = (iuv.x - 0.5) / imageAspect + 0.5;
    } else {
        iuv.y = (iuv.y - 0.5) * imageAspect + 0.5;
    }
    return clamp(iuv, 0.0, 1.0);
}

// Duotone gradient map: shadows -> mapDark, highlights -> mapLight
vec3 gradientMap(vec3 color, vec3 mapDark, vec3 mapLight) {
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    
    // Apply a very subtle S-curve to the luminance to enhance contrast
    // smoothstep(0.0, 1.0, lum) creates a standard S-curve.
    // We blend 20% of the S-curve with 80% linear to keep it very subtle.
    float sCurve = smoothstep(0.0, 1.0, lum);
    float finalLum = mix(lum, sCurve, 0.2);
    
    return mix(mapDark, mapLight, finalLum);
}

// Signed distance to a rounded rectangle centered at origin (negative inside)
float roundedRectSDF(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - (halfSize - radius);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
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

    // ---- centered/offset image slot ----
    // Slot side is a fraction of the short edge, so it scales identically in
    // the live preview and in 2K/4K exports
    float side = u_imageSize * min(u_resolution.x, u_resolution.y);

    // Automatically position the slot based on the aspect ratio:
    // For 4:5 vertical format (aspect ratio ~0.8), position it 100px from the top of a 1350px canvas.
    // For all other aspect ratios, keep it perfectly centered.
    float aspect = u_resolution.x / u_resolution.y;
    vec2 slotCenter = vec2(0.5, 0.5);
    if (abs(aspect - 0.8) < 0.01) {
        float topMarginRatio = 100.0 / 1350.0;
        float halfSideRatio = 0.5 * (side / u_resolution.y);
        slotCenter.y = 1.0 - topMarginRatio - halfSideRatio;
    }
    // ---- overlapping card box ----
    // Width = side (777px in Figma), Height = 443px.
    float cardHeight = side * (443.0 / 777.0);
    float cardCornerRadius = side * (40.0 / 777.0);
    
    // Card center Y is offset from image center Y by exactly 477px relative to 777px side
    float cardCenterY = slotCenter.y - (477.0 / 777.0) * (side / u_resolution.y);
    vec2 cardCenter = vec2(slotCenter.x, cardCenterY);
    
    // Calculate SDF for the card box relative to its center
    vec2 cardLocalCoords = gl_FragCoord.xy - cardCenter * u_resolution.xy;
    float cardDist = roundedRectSDF(cardLocalCoords, vec2(0.5 * side, 0.5 * cardHeight), cardCornerRadius);
    
    // Anti-aliased coverage mask (negative distance = inside the card)
    float inCard = 1.0 - smoothstep(-0.75, 0.75, cardDist);
    
    // Blend the solid dark duotone color behind the image slot
    finalColor = mix(finalColor, u_mapDark, inCard);

    // ---- centered/offset image slot ----
    vec2 local = (gl_FragCoord.xy - slotCenter * u_resolution.xy) / side + 0.5;

    // Rounded corners: 40px on the 777px Figma reference slot, scaling with the slot
    float cornerRadius = side * (40.0 / 777.0);
    float dist = roundedRectSDF((local - 0.5) * side, vec2(0.5 * side), cornerRadius);

    // Anti-aliased coverage mask (negative distance = inside the slot)
    float inRect = 1.0 - smoothstep(-0.75, 0.75, dist);

    // Sampled unconditionally so mipmap derivatives stay defined
    vec3 mapped = gradientMap(texture(u_image, coverFitUV(local, u_imageAspect)).rgb, u_mapDark, u_mapLight);

    // Placeholder while no image is loaded: darkened panel with a thin outline
    // hugging the rounded edge (the outside half is masked by inRect)
    float outline = step(-2.5, dist);
    vec3 placeholder = mix(finalColor, vec3(0.02), 0.35);
    placeholder = mix(placeholder, vec3(0.95), outline * 0.5);

    vec3 slotColor = mix(placeholder, mapped, u_hasImage);
    finalColor = mix(finalColor, slotColor, inRect);

    fragColor = vec4(finalColor, 1.0);
}
