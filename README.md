# FocusFlow

A React-based intelligent video player with advanced features like resume playback, watched interval tracking, live user progress syncing via sockets, and visual analytics.

---

## 🚀 Features

- ⏯️ Custom Play/Pause with watched intervals tracking
- 🔁 Resume video from last watched point
- 🔄 Merges overlapping watched time intervals smartly
- 📶 Live resume-point syncing to backend using `socket.io`
- 🧠 Real-time user session management with context API
- 🧪 Skeleton screen loading experience
- 📊 Circular watched percentage indicator
- ⏩ Fast-forward with interval adjustments
- ❌ Prevents download/fullscreen/PiP abuse

---

## 🛠 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/sagardubey14/FocusFlow.git
cd FocusFlow
```

### 2. Install Dependencies for Client

```bash
cd Client
npm install
npm run dev
```

### 4. Start the Server

```bash
cd Server
npm install
npm run dev
```

---

## 📄 Design Decisions

### 👤 User Context

- The app uses a custom `UserContext` to maintain user state globally.
- This includes `videodata` with properties like `watchedIntervals`, `resumePoint`, and `videoLength`.

### 📡 Socket Integration

- Socket.io is used to **sync the resume point every 5 seconds**.
- On page unload or video end, intervals are updated and merged for accurate analytics.

---

## 🧠 Watched Intervals Merging Logic Explained

### Why?

When a user seeks or pauses multiple times, intervals might overlap. We merge them to:
- Avoid double-counting
- Get actual watched time

### Example

```js
existingIntervals = [
  { start: 10, end: 30 },
  { start: 35, end: 50 },
];

newInterval = { start: 25, end: 40 };
```

**Merged Result:**

```js
[
  { start: 10, end: 50 } // [10–30] and [25–40] merged into one; [35–50] also overlaps
]
```

### Code:

```js
const mergeIntervals = (existingIntervals, newInterval) => {
  const allIntervals = [...existingIntervals, newInterval].sort((a, b) => a.start - b.start);
  const merged = [];

  for (let interval of allIntervals) {
    if (!merged.length || merged[merged.length - 1].end < interval.start) {
      merged.push(interval);
    } else {
      merged[merged.length - 1].end = Math.max(
        merged[merged.length - 1].end,
        interval.end
      );
    }
  }
  return merged;
};
```

---

## 👨‍💻 Author

**Sagar Dubey**  
[GitHub](https://github.com/sagardubey14) | [LinkedIn](https://www.linkedin.com/in/sagar-dubey-9aab3b25b/)

---
