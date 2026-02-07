# hiro Website Structure Guide (Plain English)

This guide explains how the **hiro Website** is structured so that anyone, even if you aren't a programmer, can understand what each part does.

---

## 📂 The Main Folders

### 1. `src` (The Engine Room) 🛠️
This is where 99% of the action happens. It contains the code that makes the website work and look good.
- **`src/pages`**: Think of these as the main "Rooms" of the house (the different pages like Home, Sign Up, and the SOP Builder).
- **`src/components`**: These are the "Furniture" inside the rooms (buttons, headers, text boxes, etc.).
- **`src/context`**: Special data that is shared across the whole site (like if you are logged in).

### 2. `public` (The Storage Room) 📦
This is where we keep all the "media assets." If you want to change a video, a logo, or an icon, it’s probably in here.
- **`public/videos`**: All the background animations and avatars.
- **`public/images`**: Logos and static graphics.

### 3. `node_modules` (The Tool Shed) 🧰
This is a huge folder where the computer stores thousands of small "tools" it needs to build the site. You never need to touch this!

---

## 📄 Key Project Files

### 🏠 Main Pages (`src/pages`)
- **`Home.jsx`**: The front door/landing page.
- **`SOPBuilder.jsx`**: The core application where you define your business systems. This is the most complex part of the site.
- **`SignUp.jsx`**: Where new users create an account.
- **`Results.jsx`**: The page that shows the outcome after completing a process.

### 🧩 Important Components (`src/components`)
- **`ExpertBox.jsx`**: The floating chat window with the "Steve Jobs" avatar. This gives you guidance while you work.
- **`Header.jsx`**: The navigation bar at the top of the screen.
- **`Hero.jsx`**: The big, bold intro section at the top of the homepage.

### ⚙️ Background Settings
- **`package.json`**: The "shopping list" of tools the project uses.
- **`vite.config.js`**: Specific instructions for the computer on how to bundle the code into a website.

---

## 🚀 How Changes Work
- If you change a **Page**, you change the whole screen.
- If you change a **Component**, you change a specific part (like a button) that might appear in many places.
- The site uses a tool called **React**, which means it only updates the parts of the screen that need to change, making it feel very fast.
