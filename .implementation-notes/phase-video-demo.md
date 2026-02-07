# Phase Video Demo Implementation

## Overview
Implemented a PhaseVideoDemo component that displays contextual demo videos beside the Expert Box when explaining each phase. Videos automatically play for 10 seconds each and hide when complete.

## Features

### 📹 **Video Display**
- **Position:** Fixed on the left side of the screen, beside the Expert Box
- **Styling:** Glassmorphic design with rounded corners (20px), matching the Expert Box aesthetic
- **Auto-play:** Videos start automatically when a phase begins
- **Auto-hide:** Videos disappear after their duration (10 seconds per video)
- **Close button:** Users can manually close the video at any time

### 🎬 **Phase-Specific Videos**

#### Define Phase
- Single video: "Work with the Expert Box to define your current revenue systems.mov"
- Duration: 10 seconds

#### Assign Phase
- Single video: "Assign the defined to department head and knowledgeable worker.mov"
- Duration: 10 seconds

#### Extract Phase (Multiple Videos)
The Extract phase shows **4 sequential videos**, one after another:
1. "Brainstorm as much sub-activities or tasks as possible.mov" (10s)
2. "Define Capture method for each sub-activity.mov" (10s)
3. "Set a standard for each sub-activity.mov" (10s)
4. "Execute the checklist.mov" (10s)

**Total Extract demo time:** 40 seconds

#### Organize Phase
- Single video: "Organize your the systems you extracted.mov"
- Duration: 10 seconds

#### Integrate Phase
- Single video: "Integrate the extracted systems using checklist.mov"
- Duration: 10 seconds

### 🎯 **User Experience**

```
Phase Starts
    ↓
Expert Box appears with phase introduction
    ↓
Video Demo appears on the left (simultaneously)
    ↓
Video plays for 10 seconds
    ↓
Video auto-hides (or user closes it)
    ↓
For Extract: Next video appears → Repeats 4 times
    ↓
User continues with phase work
```

### 🎨 **Visual Features**

- **Progress Indicators:** For multi-video phases (Extract), dots show current video position
- **Phase Label:** Displays which phase demo is showing
- **Glassmorphic Background:** Matches the overall design aesthetic
- **Smooth Animations:** Fade in/out transitions using Framer Motion
- **Responsive:** Adapts to screen size with max-width constraints

## Technical Implementation

### Files Created
- `/src/components/sop/PhaseVideoDemo.jsx` - Main video demo component

### Files Modified
- `/src/pages/SOPBuilder.jsx`
  - Added `PhaseVideoDemo` import
  - Added `showPhaseVideo` and `currentPhaseForVideo` state
  - Updated phase start functions to trigger video demos:
    - `startDefinePhase()`
    - `startAssignPhase()`
    - `startBrainstorm()` (Extract phase)
    - `handleStartOrganize()`
    - `handleStartIntegrate()`
  - Added `<PhaseVideoDemo />` component to render

### State Management
```javascript
const [showPhaseVideo, setShowPhaseVideo] = useState(false);
const [currentPhaseForVideo, setCurrentPhaseForVideo] = useState(null);
```

### Video Trigger Pattern
```javascript
// Trigger phase video demo
setCurrentPhaseForVideo('define'); // or 'assign', 'brainstorm', 'organize', 'integrate'
setShowPhaseVideo(true);
```

## Video File Locations
All videos are located in:
```
/public/videos/Videos for Web/
```

## Component Props

### PhaseVideoDemo
- `phase` (string): Which phase to show videos for ('define', 'assign', 'brainstorm', 'organize', 'integrate')
- `isShowing` (boolean): Controls visibility
- `onComplete` (function): Callback when all videos finish or user closes

## Z-Index Layering
- Expert Box: `z-index: 9999`
- Phase Video Demo: `z-index: 9998` (just below Expert Box)

## Browser Compatibility
- Supports `.mov` (QuickTime) and `.mp4` formats
- Falls back to MP4 if MOV not supported
- Uses `playsInline` for mobile compatibility
- Videos are muted for auto-play compliance

## Future Enhancements
- Add Optimize phase video when available
- Configurable video duration per video
- Pause/resume controls
- Volume controls (currently muted)
- Full-screen option
