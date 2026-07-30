## Dhiraj Kumar Sah — Portfolio

A personal portfolio built with Vite, React, and Tailwind CSS. This repo powers a single-page portfolio site where content is driven from `src/data.js` so you can update projects, skills, and personal details without touching the React components.

---

## Quick Start

Prerequisites: Node.js (16+ recommended) and npm or yarn.

```bash
npm install
npm run dev      # start local dev server (Vite)
npm run build    # build production assets -> dist/
npm run preview  # preview the production build locally
```

## Features

- Minimal, responsive portfolio layout
- Sections: Hero, Skills, Projects, Education, Contact, Footer
- Content kept in a single file (`src/data.js`) for easy editing
- Built with Vite + React + Tailwind CSS for fast development

## Project Structure

- `src/` — React source files and components
- `src/data.js` — Central place for name, bio, projects, skills, links
- `public/` — static assets (icons, resume PDF, manifest)
- `index.html` — Vite entry

## Editing Content

All site text and project data live in `src/data.js`. Update that file to change:

- Your name, role, and bio
- Project list (title, description, links, images)
- Skills and education entries
- Social links and contact info

You usually do NOT need to modify components in `src/components/`.


## License

This repository does not include a formal license file. Add a `LICENSE` if you want to publish it under a specific license (for example, MIT).
