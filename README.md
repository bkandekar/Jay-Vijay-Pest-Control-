# PV Pest Control Services Website

A premium, conversion-focused single-page website for PV Pest Control Services in Amravati, Maharashtra. Built with vanilla HTML, CSS, and JavaScript for optimal performance and easy deployment on GitHub Pages.

## Features

### Core Functionality
- **Responsive Design**: Mobile-first with breakpoints at 480px, 768px, 1024px, 1440px
- **Sticky Header**: With smooth scroll navigation
- **Instant Pest Treatment Calculator**: Client-side pricing estimation with animated count-up
- **Booking Modal**: Pre-fills from calculator, validates inputs, redirects to WhatsApp
- **Scroll Animations**: Reveal effects using IntersectionObserver

### Sections
1. **Hero Section**: Bold headline, trust badges, dual CTAs
2. **Pain Points → Solutions**: 6 common pest problems with solutions
3. **Instant Calculator**: Property type, size, pest concern, frequency inputs
4. **Services Section**: 8 service cards with 3D tilt-on-hover effect
5. **Why Choose Us**: Animated stats counter + 6 feature highlights
6. **Process Section**: 4-step visual workflow
7. **Testimonials**: 4 customer review cards
8. **Gallery**: 6 image placeholder slots
9. **Final CTA Banner**: Full-width with dual buttons
10. **Footer**: Contact info, services, quick links, social media

### Design System (Urban Guard Combo)
- **Primary Color**: Charcoal `#212529`
- **Accent Color**: Lime Green `#A0E426` (used sparingly)
- **Background**: White `#FFFFFF`
- **Heading Font**: Space Grotesk (weights 600-700)
- **Body Font**: Inter (weights 400-500)

## Project Structure

```
pv-pest-control/
├── index.html          # Main HTML structure
├── style.css           # All styling
├── script.js           # All interactivity & logic
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## Quick Start

### Local Development
1. Clone or download the repository
2. Open `index.html` in your browser
3. That's it! No build step required.

### Deployment to GitHub Pages
1. Create a new GitHub repository
2. Push all files to the `main` branch
3. Go to Settings → Pages
4. Select `main` branch and `/ (root)` folder
5. Your site will be live at `https://[username].github.io/[repo-name]/`

## Customization

### Update Client Details
Edit the following in `index.html`:
- Business name in `<title>` and logo
- Phone number: `9067257872` (multiple locations)
- Address in footer
- Service area
- Years in business
- Client count

### Update WhatsApp Number
In `script.js`, line 10:
```javascript
const WHATSAPP_NUMBER = '919067257872'; // Replace with actual number
```

### Update Pricing
In `script.js`, modify the `BASE_PRICES` object (lines 15-45) to adjust pricing for each service combination.

### Update Services
In `index.html`, find the Services section and add/remove service cards as needed.

### Replace Placeholder Images
Search for `data-placeholder-id` attributes in `index.html` and replace the placeholder divs with actual images:
```html
<!-- Before -->
<div class="placeholder-box" data-placeholder-id="hero-banner">
  [PLACEHOLDER: Hero Banner — 1600x900px]
</div>

<!-- After -->
<img src="images/hero-banner.jpg" alt="Pest control technician" class="hero-image">
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome for Android)

## Performance

- No external JS frameworks
- No render-blocking scripts (JS is deferred)
- Optimized CSS with minimal redundancy
- Efficient DOM queries with caching

## Credits

- **Design**: Custom design based on "Urban Guard" combo specification
- **Fonts**: [Google Fonts](https://fonts.google.com/) - Space Grotesk & Inter
- **Icons**: Native emoji and inline SVG
- **Development**: Built with vanilla HTML5, CSS3, JavaScript (ES6+)
- **Website by**: ebookcharm Web Services

## License

This project is created for PV Pest Control Services and is proprietary. All rights reserved.

---

**PV Pest Control Services**
Shop No 04, Rana Complex, Congress Nagar Rd, Rajendra Colony, Shyam Nagar, Amravati, Maharashtra 444606
Phone: 9067257872
