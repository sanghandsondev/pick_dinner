# Pick Dinner — Copilot Instructions

Tài liệu này lưu toàn bộ yêu cầu & quy ước của dự án. Mọi thay đổi code phải bám sát các mục dưới.

## 1. Mục tiêu & Nghiệp vụ

- Web tĩnh cá nhân giúp **random một món ăn để nấu buổi tối**, hoạt động như một "vòng xoay may mắn".
- Người dùng chính: chủ dự án, dùng trên **iPhone 15** qua trình duyệt Safari/Chrome thông thường (không phải PWA/native).
- Luồng sử dụng:
  1. Mở web → hiển thị **ngày/thứ hiện tại** + **danh sách toàn bộ món ăn** đang có.
  2. Nút **"Pick Dinner"** đặt ở vị trí nổi bật (floating action button hoặc CTA lớn), bắt mắt.
  3. Click "Pick Dinner" → hiện **modal** với hiệu ứng loading/xoay vòng ~2s → hiển thị món được chọn.
  4. Trong modal có 3 nút:
     - **Pick Again**: random lại (kèm hiệu ứng 2s).
     - **Deal**: chốt món → đóng modal → **disable (xám + mờ)** nút "Pick Dinner".
     - **Close/Ẩn**: đóng modal, không chốt, giữ nguyên trạng thái.
  5. Sau khi Deal, có thể hiển thị "Món tối nay: ..." ở đâu đó dễ thấy. Có nút reset (tuỳ chọn nhỏ) để chọn lại nếu đổi ý.

## 2. Danh sách món ăn

- Lưu trong file **`src/data/meals.json`** (mảng object), dễ chỉnh sửa thủ công.
- Cấu trúc mỗi món:
  ```json
  { "id": "string", "name": "string", "emoji": "optional string" }
  ```
- Bắt đầu với **5 món dummy** để test. Chủ dự án sẽ tự thêm sau.
- Ví dụ tên món: `"khoai tây luộc + ức gà"`.

## 3. Tech Stack

- **Vite + React + TypeScript** (template `react-swc-ts` — nhanh, hiện đại nhất).
- **CSS thuần hiện đại** (CSS variables, `color-mix()`, `oklch`, container queries khi phù hợp, `backdrop-filter`, gradient mượt). Không dùng Tailwind trừ khi được yêu cầu.
- Không cần state management ngoài (dùng `useState`/`useReducer` là đủ).
- Node ≥ 20, npm.

## 4. Thiết kế UI

- **Tông màu chủ đạo**: trắng + xanh dương (blue). Dùng palette blue hiện đại (ví dụ `#2563eb`, `#3b82f6`, `#dbeafe`, nền `#f8fafc`/`#ffffff`).
- Cảm giác: **giống app native hiện đại 2025** — bo góc lớn (16–28px), shadow mềm nhiều lớp, glassmorphism nhẹ ở modal (backdrop-filter blur), typography sans-serif hệ thống (`-apple-system, "SF Pro Text", "Inter", system-ui`).
- Animation: dùng `transition` + `@keyframes`, easing mượt (`cubic-bezier(0.22, 1, 0.36, 1)`). Không giật, không cứng.
- Hiệu ứng loading khi pick: spinner xoay + tên món "chạy" đổi liên tục (slot-machine feel) trong ~2s rồi dừng ở kết quả.
- Nút "Pick Dinner" khi disabled: giảm opacity (~0.45), grayscale, `cursor: not-allowed`, bỏ shadow.

## 5. Responsive (Mobile-First)

- Thiết kế **mobile-first**, tối ưu chính cho **iPhone 15** (viewport 393×852 CSS px, DPR 3).
- **Tránh tai thỏ / Dynamic Island**: dùng `viewport-fit=cover` trong `<meta viewport>` và padding qua `env(safe-area-inset-top/right/bottom/left)`. Vùng CTA cố định dưới màn hình phải nằm trên `safe-area-inset-bottom`.
- Hỗ trợ thêm các kích thước phổ biến: iPhone SE (375×667), iPhone 12/13/14 (390×844), iPhone 15 Pro Max (430×932), Android nhỏ (360×640). Dùng breakpoint linh hoạt (`clamp()`, `min()`, `max()`).
- Kiểm tra dark mode hệ thống — có thể bổ sung sau, nhưng mặc định là theme **sáng**.

## 6. Deploy & CI/CD

- Deploy lên **GitHub Pages** (không dùng hosting bên thứ ba).
- Build output ở thư mục **`dist/`** (mặc định của Vite).
- Repo có sẵn workflow **`.github/workflows/deploy.yml`**:
  - Trigger: `push` vào nhánh `main`.
  - Build (`npm ci && npm run build`), upload artifact, deploy qua `actions/deploy-pages@v4`.
- Cần cấu hình **Settings → Pages → Source: GitHub Actions** (làm 1 lần trong repo settings).
- `vite.config.ts` phải set `base: '/<repo-name>/'` để asset load đúng path trên GitHub Pages. Repo hiện tại: **`pick_dinner`** ⇒ `base: '/pick_dinner/'`.

## 7. Preview & Debug trong VS Code

- Dev server: `npm run dev` (Vite chạy port 5173, HMR).
- Preview build: `npm run preview`.
- Extension khuyên dùng (không bắt buộc, đã list trong `.vscode/extensions.json`):
  - **`ms-edgedevtools.vscode-edge-devtools`** — mở trang trong Edge DevTools ngay trong VS Code, device emulation cho iPhone 15, debug DOM/CSS/JS trực tiếp.
  - **`dbaeumer.vscode-eslint`** — lint TypeScript/React.
  - **`esbenp.prettier-vscode`** — format.
- Có sẵn task `.vscode/tasks.json` để chạy dev server bằng 1 phím tắt.
- Có sẵn `.vscode/launch.json` để **debug Edge DevTools** trỏ vào `http://localhost:5173`, cho phép Copilot/dev tự đặt breakpoint và trace component React.

## 8. Quy ước code

- Cấu trúc thư mục:
  ```
  src/
    components/       # PickDinnerButton, PickDinnerModal, MealList, DateHeader...
    data/meals.json
    hooks/            # usePickDinner, useToday...
    styles/           # index.css, tokens.css
    App.tsx
    main.tsx
  ```
- Components: functional, hooks. Không dùng class component.
- Kiểu dữ liệu tường minh, `strict: true` trong `tsconfig`.
- Không thêm dependency không cần thiết. Ưu tiên CSS thuần > thư viện.
- Commit message theo Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`…).

## 9. Định nghĩa "Xong"

Một thay đổi được coi là hoàn thành khi:
1. `npm run build` chạy pass, không lỗi TypeScript.
2. UI trên viewport iPhone 15 (393×852) không tràn, không đè tai thỏ, CTA không bị home indicator che.
3. Luồng Pick Dinner → Pick Again → Deal → disable hoạt động đúng như mục 1.
4. Sau khi push `main`, GitHub Actions build & deploy xanh, site truy cập được tại `https://<user>.github.io/pick_dinner/`.
