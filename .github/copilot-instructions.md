# Pick Dinner — Copilot Instructions

Tài liệu này là single source of truth cho dự án. Mọi thay đổi code phải bám sát các mục dưới.

## 1. Mục tiêu & Nghiệp vụ

- Web tĩnh cá nhân giúp **random một món ăn để nấu buổi tối**, hoạt động như một "vòng xoay may mắn".
- Người dùng chính: chủ dự án, dùng trên **iPhone 15** dưới dạng **PWA cài lên Home Screen** (standalone, không có UI Safari).
- Luồng sử dụng:
  1. Mở app → hiển thị **Header** (Tonight's dinner + ngày/thứ + nút ✏️ Edit + 🕒 History) + **danh sách món ăn** theo tab Rice/Other.
  2. Tap vào từng món trong list để **loại tạm thời** (excluded) khỏi vòng random. Tap lại để bật lại.
  3. Nút **Pick Dinner** floating dưới cùng → mở modal slot-machine ~2s → hiển thị món được chọn.
  4. Trong modal có nút:
     - **Pick Again** — random lại (kèm hiệu ứng 2s).
     - **Deal** — chốt món → lưu vào history → đóng modal → nút "Pick Dinner" ở màn chính bị disable (đổi label "Dinner locked in").
     - **✕ Close** — đóng modal không chốt.
  5. Sau khi Deal: header vẫn hiển thị, phần list + tab bị ẩn, thay bằng **deal hero** (tên món ở giữa màn hình).
- Kiểm tra "đã deal hôm nay" bằng cách so entry history mới nhất với ngày local (hôm nay). Sang ngày mới → tự về trạng thái chọn tiếp.

## 2. Dữ liệu

- Toàn bộ dữ liệu lưu **localStorage** (không có backend):
  - `pick_dinner_meals_v1` — danh sách món ăn của user.
  - `pick_dinner_history_v1` — lịch sử các lần Deal (giới hạn 200 entry mới nhất).
- **`src/data/meals.json`** chỉ dùng làm **seed** khi user mở app lần đầu (chưa có key trong localStorage). Không phải nguồn dữ liệu runtime.
- Model:
  ```ts
  type MealCategory = "rice" | "other";
  interface Meal { id: string; name: string; category: MealCategory }
  interface HistoryEntry { id: string; mealId: string; mealName: string; category: MealCategory; dealtAt: string /* ISO */ }
  ```
- **KHÔNG** có field `emoji` per meal (đã bỏ). Emoji chỉ dùng trang trí ở UI (🍚 tab, 🕒 icon, v.v.).

## 3. Chức năng chính (đã có)

- **Pick Dinner**: modal slot-machine, tick 90ms, spin 2s, chọn ngẫu nhiên trong pool sau khi lọc excluded.
- **History** (nút 🕒 ở header): modal scroll list, sort mới nhất → cũ nhất; hiển thị tên món + `Weekday • Month D, Year • HH:mm`; có nút **Clear Today** — chỉ xoá entry của **hôm nay**, disabled khi chưa có entry hôm nay.
- **Edit meal list** (nút ✏️ ở header): modal `MealsManagerModal`:
  - Tabs Rice/Other với số đếm.
  - Tap tên món → inline edit (Enter/blur save, Esc hủy).
  - Nút ▲/▼ để đổi thứ tự (chỉ trong cùng category); disabled khi đã ở đầu/cuối.
  - Nút ✕ để xoá (có confirm).
  - Form Add cuối modal (input + Add).
- **Exclude tạm thời**: tap món trong `MealList` để loại khỏi vòng random (giữ nguyên trong storage). Có hint text nhắc user cách dùng.
- **Auto-update ngày**: hook `useToday` tick 60s + listen `visibilitychange`/`focus` để phát hiện sang ngày mới ngay khi user mở lại app.

## 4. Tech Stack

- **Vite 6 + React 19 + TypeScript** (template `react-swc-ts`).
- **CSS thuần hiện đại**: CSS variables, `clamp()`, `100dvh`, `env(safe-area-inset-*)`, `backdrop-filter`, `@keyframes` với easing `cubic-bezier(0.22, 1, 0.36, 1)`. Không dùng Tailwind / CSS-in-JS.
- Không state management ngoài (`useState`/`useReducer` + custom hooks là đủ).
- Node ≥ 20, npm.

## 5. Thiết kế UI

- **Tông màu chủ đạo**: trắng + xanh dương. Palette blue: `#2563eb` (600), `#3b82f6` (500), `#dbeafe` (100), `#1d4ed8` (700). Nền `#f5f8ff` + gradient radial mờ.
- Feel giống app native 2025: bo góc lớn (16–28px), shadow mềm nhiều lớp, glassmorphism nhẹ ở modal backdrop, typography `-apple-system, "SF Pro Text", "Inter", system-ui`.
- Animation mượt, không giật cứng.
- Nút CTA disabled: opacity 0.45, grayscale, bỏ shadow, `cursor: not-allowed`.
- **Input**: font-size ≥ 16px để iOS Safari không auto-zoom khi focus.

## 6. Responsive (Mobile-First)

- Tối ưu chính cho **iPhone 15** (393×852 CSS px). Hỗ trợ thêm iPhone SE, 12–14, 15 Pro Max, Android nhỏ (360×640).
- `viewport-fit=cover` + `env(safe-area-inset-*)`. CTA nằm trên safe-area-bottom, header cách tai thỏ bằng safe-area-top.
- Dùng `clamp()` / `min()` / `max()` cho font-size / spacing thay vì breakpoint cứng khi có thể.
- Dark mode: chưa hỗ trợ (mặc định light theme).

## 7. PWA

- **Cài như native app**: user mở Safari → Share → Add to Home Screen.
- Các file PWA:
  - `public/manifest.json` — `display: standalone`, `start_url: /pick_dinner/`, `scope: /pick_dinner/`, `theme_color: #2563eb`, `background_color: #f5f8ff`.
  - `public/sw.js` — service worker; cache-first cho assets, network-first cho navigation. **Bump `CACHE` version mỗi lần thay đổi code** để user nhận update.
  - `public/apple-touch-icon.png` (180×180) + `public/icon-192.svg` + `public/icon-512.svg`.
  - `scripts/gen-icons.mjs` — Node script dùng `sharp` để render PNG từ SVG (chỉ chạy khi đổi icon).
- Client (`src/main.tsx`) đăng ký SW ở `window load`, listen `controllerchange` để **auto-reload** khi có bundle mới.

## 8. Deploy & CI/CD

- Host trên **GitHub Pages** ở path `/pick_dinner/`.
- Workflow **`.github/workflows/deploy.yml`**: trigger push `main` → `npm ci && npm run build` → upload `dist/` → `actions/deploy-pages@v4`.
- Cần cấu hình 1 lần: **Settings → Pages → Source: GitHub Actions**.
- `vite.config.ts`: `base: '/pick_dinner/'`.

## 9. Preview & Debug trong VS Code

- Dev: `npm run dev` (port 5173, HMR).
- Preview build: `npm run preview`.
- Extension đề xuất (`.vscode/extensions.json`):
  - `ms-edgedevtools.vscode-edge-devtools` — device emulation iPhone 15.
  - `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode`.
- Có sẵn `.vscode/tasks.json` (dev task) và `.vscode/launch.json` (debug Edge trỏ `http://localhost:5173/pick_dinner/`).

## 10. Cấu trúc code

```
src/
  components/
    DateHeader.tsx          # header + nút Edit + History
    MealList.tsx            # tabs + list + hint text
    PickDinnerButton.tsx    # floating CTA
    PickDinnerModal.tsx     # slot-machine
    HistoryModal.tsx
    MealsManagerModal.tsx   # CRUD + reorder
  hooks/
    useMeals.ts             # localStorage CRUD + moveMeal
    usePickHistory.ts       # addEntry + clearToday
    useToday.ts             # tick 60s + visibilitychange
  data/meals.json           # seed only
  styles/index.css          # tokens + all styles
  types.ts                  # Meal, MealCategory
  App.tsx
  main.tsx                  # SW registration + controllerchange reload
public/
  manifest.json
  sw.js                     # bump CACHE version mỗi lần deploy code
  icon-192.svg, icon-512.svg
  apple-touch-icon.png
scripts/gen-icons.mjs
```

## 11. Quy ước code

- Components: **functional + hooks**, không class.
- `tsconfig`: `strict: true`, `noUnusedLocals`, `noUnusedParameters`.
- Kiểu dữ liệu tường minh ở API boundary; props có `interface`/`type`.
- Không thêm dependency nếu không cần thiết. Ưu tiên CSS thuần.
- Commit theo Conventional Commits (`feat:`, `fix:`, `style:`, `chore:`, `docs:`).
- Khi đổi shape của localStorage: bump version key (ví dụ `_v1` → `_v2`) và giữ backward-compat khi hợp lý.

## 12. Định nghĩa "Xong"

Một thay đổi được coi là hoàn thành khi:
1. `npm run build` pass, không lỗi TypeScript.
2. UI trên iPhone 15 (393×852) không tràn, không đè Dynamic Island, CTA không bị home indicator che.
3. Các luồng chính vẫn hoạt động đúng: Pick → Deal → disable + deal hero, Edit CRUD + reorder, History + Clear Today, sang ngày tự reset.
4. **Nếu đổi code (không phải chỉ docs)**: bump `CACHE` trong `public/sw.js` để PWA tự update qua `controllerchange`.
5. Sau khi push `main`: GitHub Actions build & deploy xanh, site sống tại `https://<user>.github.io/pick_dinner/`.
