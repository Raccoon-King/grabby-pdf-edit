# React PDF Editor

This project is a client-side PDF editor built with **React**, **TypeScript**, and **Tailwind CSS**. It allows users to:

- Upload a PDF file via drag-and-drop or file picker.
- View, reorder, and delete pages.
- Add, move, resize, and remove text or redaction boxes.
- Download a new PDF containing all modifications.

A lightweight Go server is included to serve the production build and expose a `/healthz` endpoint for uptime checks.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Production

1. Build the frontend assets:
   ```bash
   npm run build
   ```
2. Start the Go server (serves files from `dist/`):
   ```bash
   go run ./server
   ```
   Use the `PORT` environment variable to change the listening port and `STATIC_DIR` to override the directory served.

The server exposes a health endpoint at `/healthz` which returns `200 OK` when the service is ready.

## License

MIT

