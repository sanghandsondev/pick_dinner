import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// GitHub Pages sẽ host tại https://<user>.github.io/pick_dinner/
// nên cần set base = '/pick_dinner/' để asset load đúng path.
export default defineConfig({
  plugins: [react()],
  base: '/pick_dinner/',
  server: {
    host: true,
    port: 5173,
  },
});
