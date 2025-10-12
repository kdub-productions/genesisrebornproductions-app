# TODO: Fix Dropdown Menu Contrast Issues

## Tasks
- [x] Remove brightness filter from dropdown links to improve text visibility
- [x] Darken dropdown background in light mode for better contrast
- [x] Change text color to black in light mode and ensure dark background with white text in dark mode
- [x] Test the changes to ensure readability

## Notes
- Issue: White text on white background in dropdown menu, making it unreadable
- Solution: Adjust CSS in src/styles/site-wide-styles/styles.css
- Changes: Remove filter: brightness(1.1); from .dropdown li a, and modify background gradient to be darker in light mode
