# Shader Uniform Wiring & Renderer Notes

This folder houses the fragment shaders and utility modules required to render the Global Emerging Leaders Forum 2026 visual assets.

## Fragment Shaders

1. **`image-gradient.frag`**: Renders the background gradient, centered image slot with rounded corners, and a dark card overlap region.
2. **`linear-gradient.frag`**: Renders a simple, clean, animated gradient background.

### Uniform Layout and Meanings

Both shaders expect the following WebGL2 uniforms:

| Uniform | Type | Description |
|---|---|---|
| `u_resolution` | `vec2` | Canvas width and height (e.g. `[1080, 1350]` or `[1920, 1080]`) |
| `u_time` | `float` | Elapsed time in seconds for animation loops |
| `u_speed` | `float` | Multiplier for speed of wave traversal (usually `1.0` to `5.0`) |
| `u_scale` | `float` | Spatial frequency scale factor (usually `0.5` to `3.5`) |
| `u_angle` | `float` | Wave angle in degrees (`0.0` or `90.0`) |
| `u_color1` | `vec3` | RGB float vector for color 1 (e.g. `#B9C3FE` -> `[0.725, 0.765, 0.996]`) |
| `u_color2` | `vec3` | RGB float vector for color 2 (e.g. `#0137FF` -> `[0.004, 0.216, 1.000]`) |
| `u_stop1` | `float` | Position of gradient stop 1 (`0.0` to `1.0`) |
| `u_stop2` | `float` | Position of gradient stop 2 (`0.0` to `1.0`) |
| `u_type` | `float` | `0.0` for Linear, `1.0` for Radial |
| `u_centerX` | `float` | X center coordinate for radial gradients (`0.0` to `1.0`) |
| `u_centerY` | `float` | Y center coordinate for radial gradients (`0.0` to `1.0`) |

#### Extra Uniforms for `image-gradient.frag`

These control the image slot overlay and duotone map:

| Uniform | Type | Description |
|---|---|---|
| `u_image` | `sampler2D` | The texture of the user-dropped image |
| `u_hasImage` | `float` | `1.0` if an image texture is active, `0.0` if using the placeholder |
| `u_imageAspect` | `float` | Aspect ratio of the original image (`width / height`) to compute cover crop |
| `u_imageSize` | `float` | Slot side length as a fraction of the canvas short edge (default: `0.72`) |
| `u_mapLight` | `vec3` | Derived duotone highlight stop (from `deriveDuotone()` in `color.ts`) |
| `u_mapDark` | `vec3` | Derived duotone shadow stop (from `deriveDuotone()` in `color.ts`) |

## Code Helper Modules

- **`color.ts`**: Pure function `deriveDuotone(color1, color2, avgLuminance)`. Call this on the CPU using the background gradient colors and the average luminance of your image, and pass the resulting `light` and `dark` HEX colors (converted to RGB floats) as `u_mapLight` and `u_mapDark`.
- **`bezier.ts`**: Pure function solver `cubicBezier(x1, y1, x2, y2)` which resolves the parametric Bezier curve for custom timing eases.
