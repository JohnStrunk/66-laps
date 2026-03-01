# 3D Swimulation - Side-Pool Practice Overview

This document outlines the proposed design and technical architecture for a 3D
version of the existing "Swimulation" practice tool. The goal is to provide a
realistic perspective as if standing on the pool deck, enhancing the experience
for lap counters.

## 1. Vision

The current 2D simulation provides an overhead view using emojis and PixiJS. The
3D version will transition this into a perspective view using **Three.js** and
**React Three Fiber (R3F)**. This allows for depth, realistic water effects,
and a more immersive training environment that replicates real-world counting
conditions.

## 2. Shared Architecture

The 3D version will share the same core configuration as the 2D version (pool
length, lane count, difficulty, etc.) but introduces new viewpoint-specific
settings to simulate all real-world variations.

### Shared Simulation Logic

- **`SwimmerModel`**: Both 2D and 3D views will consume the same `SwimmerModel`
  instances.
- **Coordinate Mapping**:
  - The `location` (0.0 to 1.0) will map directly to the Z-axis in 3D space.
  - The `direction` will determine the orientation of the swimmer model.
- **Synchronized State**: Switching between 2D and 3D can be done mid-simulation
  by swapping the rendering component while keeping the same `swimmers` array
  in state.

### New Configuration: Viewer Orientation

To account for all real-world variations, a new setting will be added to the
`Settings` component on the settings screen:

- **Starting End**: Determines if the "Start/Finish" end of the pool is to
  the **Left** or **Right** of the observer.
- **Persistence**: The `Starting End` (and `Simulation Mode`) settings do not
  need to be persisted, as the swimulation is not part of the core PWA state.
- **Impact on 2D**: This will move the lane numbers to the other end of the pool
  and change the x-coordinate rendering so that the "Start" end matches the 3D
  perspective. Note that the existing 2D view corresponds to the "Left" starting
  end (even for single-length races, since those actually start at the turn
  end).
- **Impact on 3D**: This shifts the camera position and rotation to the
  opposite side of the pool.

## 3. The 3D Scene (React Three Fiber)

The 3D environment will be built using a `<Canvas>` component from
`@react-three/fiber`.

### Lighting & Atmosphere

- **Environment:** Default "Neutral Indoor" natatorium lighting.
- **AmbientLight:** For global visibility.
- **DirectionalLight:** Overhead light rows to create specular highlights on
  the water surface.

### Camera Perspective (The "Starter's View")

- **Position**: The observer is standing on the pool deck, exactly **3.0
  meters** from the start end wall.
- **Height**: Fixed at **1.67m (5.5 ft)** above the pool deck to simulate
  average eye level.
- **View Direction**: The observer is looking **toward the start end wall**.
- **Field of View (FOV)**: **90° Horizontal FOV**. This ensures a 10-lane pool
  width (25m) is fully visible from 3m away.
- **Realism Note**: Because the observer is looking at the start wall from only
  3m away, swimmers will naturally "swim" out of the field of view for a
  significant portion of each lap as they head toward the turn end.
- **Viewer Orientation Logic**:
  - **Left Orientation**: Camera looks toward the left (End is on the left).
  - **Right Orientation**: Camera looks toward the right (End is on the right).

## 4. Modeling & Visual Elements

### The Pool Geometry

- **Dimensions**: Standard lane width is **2.5 meters**, and pool depth is
  **3.0 meters**.
- **Pool Shell**: A hollowed-out box geometry with a "tiled" texture for the
  walls and floor.
- **Deck**: A large plane surrounding the pool using the existing
  `concrete2_seamless_diffuse_1k.png` texture.
- **Lane Identification:** Bold lane numbers rendered on the **Start End Wall**
  above the water line for clear identification.

### Water Representation

- **Mesh**: A translucent plane at `y=0`.
- **Shader**: Use a custom shader or `MeshPhysicalMaterial` with:
  - **Transmission**: To see the swimmers and floor through the water.
  - **Roughness/Normal Maps**: To simulate ripples.

### Swimmers (Low-Poly Pills)

- **Model:** A directional "ice cream cone" shape consisting of a spherical
  "head" and a conical body tapering toward the "feet."
- **Colors:** Each swimmer is assigned a solid color chosen randomly from a
  pre-defined palette (e.g., primary and secondary colors).
- **Movement**: Smoothly interpolated position updates on the Z-axis.
- **Flip Animation:** A quick 180-degree "flip" rotation (0.5s) when a swimmer
  reaches the wall and changes direction.

### Lane Ropes

- **Optimized Rendering**: Use **`InstancedMesh2`** (from `@three.ez/main`) to
  render the thousands of small floats making up the lane ropes.
- **Performance Features**:
  - **Spatial BVH:** Accelerates culling and ensures high FPS even with high
    lane counts.
  - **LOD (Level of Detail):** Automatically reduces the geometric complexity
    of distant floats.

## 5. Performance & Device Compatibility

- **Cross-Platform**: The R3F implementation will support high-refresh-rate
  desktop monitors and power-efficient mobile browsers.
- **Landscape Priority**: This 3D mode is designed exclusively for **landscape
  orientation** on mobile devices to maintain the 90° horizontal FOV.
- **Responsive Layout**: The simulation will occupy the **maximum available
  browser window space** (full-screen or full-viewport).
- **Antialiasing**: Enable MSAA in the Canvas for crisp lines on lane ropes.

## 6. Technical Unknowns & Solutions

- **Water Shaders & Mobile GPUs:** Complex refraction/reflection shaders may
  lag on older mobile devices.
  - **Solution:** For now, implement the high-quality shader. Ensure the
    architectural design leaves room to easily add a lower-quality fallback
    (e.g., simple translucent plane) in the future.
- **React 19 Compatibility:**
  - **Solution:** Must use **React Three Fiber v9** and **Drei v10** to support
    React 19's new reconciler and internal changes.

## 7. User Experience Integration

- **View Selector**: A toggle (e.g., a "2D/3D" switch) will be added to the
  simulation UI. It will float unobtrusively in the corner, treated similarly
  to the existing "Back to Settings" button.
- **Dynamic Resizing**: The R3F Canvas and Camera will listen for window resize
  events to recalculate the aspect ratio and maintain the fixed viewpoint
  perspective.

## 8. Dependencies to Add

To implement this, the following packages would be required:

- `three`: The core engine.
- `@types/three`: TypeScript definitions.
- `@react-three/fiber`: React reconciler for Three.js (Must be v9 for React 19).
- `@react-three/drei`: Essential helpers (Camera management, InstancedMesh,
  etc. - Must be v10).
- `@three.ez/main`: For `InstancedMesh2` and BVH-optimized rendering.

## 9. Development Roadmap

1. **Scaffolding**: Integrate R3F Canvas into the `Practice` page.
2. **Settings Update**: Add "Simulation Mode" (2D/3D) and "Starting End"
   (Left/Right) to the `Settings` model.
3. **Basic Pool**: Create the static 3D pool box and lane lines.
4. **Animated Swimmers**: Implement the "ice cream cone" models mapped to
   `SwimmerModel` data.
5. **Water & FX**: Implement the translucent water plane and ripples.
6. **Polishing**: Add textures, lane ropes (using `InstancedMesh2`), and the
   90° FOV "Starter's View" camera logic.
7. **Mobile Optimization**: Test performance on mobile devices in landscape
   orientation.
