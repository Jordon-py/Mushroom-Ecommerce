# Coding Errors & Concepts Guide

---

## 1. Semantic HTML & Accessibility

**Mistake:**  
Using `<table>`, `<tr>`, and `<button>` for navigation in `SideBar.jsx`.

**Correct Implementation:**

```jsx
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    ...
  </ul>
</nav>
```

**Concept:**  
Semantic HTML improves accessibility and SEO. Use `<nav>` for navigation, `<ul>` for lists, and `<a>` or `Link` for navigation links.

---

## 2. Inline Styles vs. CSS

**Mistake:**  
Using inline styles for background images and layout.

**Correct Implementation:**

```css
.background {
  background-image: url('...');
  /* ... */
}
```

**Concept:**  
Separation of concerns: CSS files should handle all styling. This keeps code maintainable and enables easier theming.

---

## 3. Color Space Consistency

**Mistake:**  
Using hex or named colors instead of LCH.

**Correct Implementation:**

```css
color: lch(70% 30 250);
```

**Concept:**  
LCH color space provides better perceptual uniformity and is a project requirement.

---

## 4. React Router Navigation

**Mistake:**  
Using `button` with `Link` prop for navigation.

**Correct Implementation:**

```jsx
<Link to="/shop" className="sidebar-link">Shop</Link>
```

**Concept:**  
Use `Link` from `react-router-dom` for SPA navigation. It prevents full page reloads and keeps routing in sync.

---

## 5. Visual Layout Comments

**Mistake:**  
No visual layout comments in CSS files.

**Correct Implementation:**

```css
/* .sidebar → Main Sidebar Navigation (All Pages) */
```

**Concept:**  
Visual layout comments help quickly map CSS classes to UI components, improving maintainability.

---

## 6. Accessibility

**Mistake:**  
No ARIA labels or focus styles for navigation.

**Correct Implementation:**

```jsx
<nav aria-label="Main navigation">
  ...
</nav>
```

**Concept:**  
ARIA labels and focus styles help users with assistive technologies navigate your site.

---

## 7. State Management

**Mistake:**  
Incorrect toggle logic for dark/light mode.

**Correct Implementation:**

```jsx
const toggleLightMode = () => setLightMode(prev => !prev);
```

**Concept:**  
Always use the functional form of state setters when the new state depends on the previous state.

---

## Sidebar links always visible when collapsed

**Mistake:**  
Sidebar links are not hidden when the sidebar is collapsed.

**Correct Implementation:**  

```css
.sidebar.collapsed .sidebar-links {
  display: none;
}
```

**Explanation:**  
This CSS rule hides the sidebar links when the sidebar has the `collapsed` class, matching the intended toggle behavior.

---

## Unwanted scrollbars on page load

**Mistake:**  
Horizontal and vertical scrollbars appear due to content overflow.

**Correct Implementation:**  

```css
.main-content {
  overflow-x: auto;
  overflow-y: auto;
  margin-left: 220px;
  width: calc(100vw - 220px);
}
```

**Explanation:**  
Setting the width to `calc(100vw - 220px)` and using `overflow-x: auto` ensures the main content fits the viewport and prevents unwanted scrollbars.

---

## Incorrect props destructuring in WelcomeBanner

**Mistake:**  
Accessing `props.backgroundImg` when `props` is not structured as expected.

**Correct Implementation:**  

```jsx
function WelcomeBanner({ backgroundImg, Shrooms_0 }) {
  // ...
}
```

**Explanation:**  
Destructuring props directly in the function signature is the idiomatic React pattern and prevents undefined errors.
