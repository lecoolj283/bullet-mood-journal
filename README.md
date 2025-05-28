# Bullet Mood Journal - Drawing Version

A web-based, iPad-friendly mood journal that allows users to track their emotions daily by **drawing and coloring within illustrative SVG templates**. This project uses Paper.js to provide a stroke-based, artistic way to engage in emotional reflection.

## Features

*   **Daily SVG Templates:** Displays a different SVG drawing each day, cycling through a set of predefined templates. These SVGs serve as visual guides and define the boundaries for drawing.
*   **Stroke-Based Drawing:** Users can draw freehand strokes within specific regions of the SVG template.
    *   Powered by **Paper.js** for robust path creation and manipulation.
    *   Drawing is masked, meaning strokes are confined to the boundaries of the selected SVG region.
*   **Color Picker:** Integrates the 'Pickr' library for selecting stroke colors, with opacity control and swatches.
*   **Visual Feedback:** The outline of the SVG region currently being drawn in is highlighted.
*   **Local Storage Persistence:** Saves the drawn strokes (as Paper.js path data) to the browser's `localStorage`. Progress for each day, including all strokes in their respective regions, is stored and reloaded.
*   **iPad Optimized:** Designed with iPads in mind, featuring a responsive canvas, touch-friendly drawing, and an app-like feel.
*   **Basic Test Suite:** Includes a testing utility within `script.js` that runs checks for core drawing, masking, and persistence functionalities. Test results are logged to the browser's developer console.

## How to Run

1.  Clone this repository or download the files.
2.  Open the `index.html` file in a modern web browser that supports ES6 JavaScript, HTML Canvas, and SVG (e.g., Chrome, Safari, Firefox, Edge).
3.  The application will load the SVG template for the current day.
4.  Click/tap within an SVG region to select it (its outline will highlight).
5.  Use the color picker (button at the bottom center) to select a color.
6.  Draw with your mouse or finger within the highlighted region. Your strokes will be confined to that region.
7.  Progress is saved automatically after each stroke. View test results in the developer console.

## Technical Overview

*   **Paper.js:** Used for all drawing operations, SVG import, path manipulation, and clipping/masking.
    *   SVGs are imported, and their paths are used to create:
        *   Visible "guide paths" on a dedicated layer.
        *   Invisible "mask paths" within clipping groups on a separate drawing layer.
    *   User strokes are added to the appropriate clipping group, making them appear only within the intended SVG region.
*   **HTML Canvas:** Paper.js renders all content onto an HTML `<canvas>` element that overlays the original SVG area.
*   **`localStorage`:** Stores arrays of serialized Paper.js path data (JSON format) for each drawn region, keyed by day.

## File Structure

*   `index.html`: The main HTML file, includes the canvas for Paper.js.
*   `style.css`: Contains all the styles for the application, including canvas positioning.
*   `script.js`: Handles all application logic: Paper.js setup, SVG processing, drawing tool implementation, masking, `localStorage` for strokes, Pickr integration, daily template management, and tests.
*   `template0.svg` to `template3.svg`: Sample SVG template files used as guides.
*   `README.md`: This file.
