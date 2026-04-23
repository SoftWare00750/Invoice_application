# Invoice App

A clean, full-featured invoice management app built with **React + Vite**.

## Features

- 📄 Create, edit, and delete invoices
- 💾 Save drafts or send invoices
- ✅ Mark invoices as paid
- 🔍 Filter by status (draft / pending / paid)
- 🌙 Light & dark mode (persisted via localStorage)
- 💡 All data persisted in localStorage

## Tech Stack

- React 18
- Vite 5
- No external UI libraries — all styling is inline CSS with CSS custom properties

## Project Structure

```
src/
├── App.jsx                  # Root component + state management
├── main.jsx                 # React entry point
├── constants.js             # Themes, status styles, sample data
├── utils.js                 # Shared helpers (dates, ID generation, totals)
└── components/
    ├── Icons.jsx            # Logo & EmptyIllustration SVGs
    ├── StatusBadge.jsx      # Coloured status pill
    ├── FormFields.jsx       # Field, Input, Select primitives
    ├── InvoiceList.jsx      # Invoice list view with filter
    ├── InvoiceDetail.jsx    # Single invoice detail view
    ├── InvoiceForm.jsx      # Create / edit slide-in form
    └── DeleteModal.jsx      # Confirmation modal
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The app will be available at `http://localhost:5173`.
