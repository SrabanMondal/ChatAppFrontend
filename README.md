# Chat Application Frontend

## Overview

This is the frontend for a modern, real-time chat application inspired by WhatsApp’s sleek and intuitive interface, built with **Next.js** and styled with **Tailwind CSS** and **Shadcn UI**. It delivers a responsive, dark-themed UI with a focus on elegance and user experience, seamlessly integrating with a NestJS backend via HTTP (Axios) and WebSocket (Socket.IO Client). The app supports user authentication, profile management, real-time messaging, and friend interactions, all wrapped in a polished, WhatsApp-like design.

Key highlights:
- **Real-Time Chat**: Instant messaging with typing indicators, read receipts, and toast notifications for new messages.
- **Dark Theme**: Elegant, WhatsApp-inspired dark UI with vibrant accents for a refreshing look.
- **Responsive Design**: Adapts seamlessly to mobile, tablet, and desktop screens.
- **Modern Tech Stack**: Next.js for server-side rendering, TypeScript for type safety, and Shadcn UI for reusable components.

This frontend brings the backend’s powerful features to life with a user-friendly and visually appealing interface.

## Features

### 1. Authentication
- **Login/Registration**: Secure login and signup with email and password, integrated with backend JWT authentication.
- **OTP Verification**: Supports OTP-based verification for registration and password reset.
- **Password Recovery**: Forgot password flow with OTP-based reset.
- **Redirects**: Automatically redirects unauthenticated users to the login page.

### 2. Profile Management
- **Profile Display**: Shows user details including:
  - `user`: Email and userId.
  - `mongoUser`: Name, profile picture, and friends list (populated with name and profile picture).
- **Profile Updates**:
  - Edit display name with simple input and validation (minimum 2 characters).
  - Upload/delete profile picture with local preview and server sync.
- **Responsive UI**: Clean, centered layout with avatar, name, and email display.

### 3. Friends List
- **Friends Display**: Lists friends with name, profile picture, and online/offline status (green/gray dot).
- **Interactive Cards**: Clickable cards to start a chat, with hover effects and a chat button for quick access.
- **No Friends State**: Friendly UI with a "Find Friends" button linking to a search page.
- **Real-Time Updates**: Online status synced via WebSocket events (`userStatus`, `onlineFriends`).
- **Notifications**: Toast notifications for new messages from non-active chats using `react-toastify`.

### 4. Real-Time Chat
- **Chat Window**:
  - Displays messages in a scrollable area with sender/receiver distinction.
  - Shows message status (sending, sent, delivered, seen) with icons (e.g., double ticks for seen).
  - Typing indicator for real-time "Typing..." feedback.
- **Message Sending**: Send text messages via Socket.IO with optimistic updates for low latency.
- **Read Receipts**: Automatically mark messages as read when viewed (`readMessage` event).
- **Responsive Layout**: Full-width on mobile, constrained on desktop for a WhatsApp-like feel.

### 5. UI/UX
- **Dark Theme**: WhatsApp-inspired palette with:
  - Backgrounds: `#1f2a44` (main), `#2a3555` (cards), `#3b4a77` (hover).
  - Text: `#e5e7eb` (primary), `#9ca3af` (secondary).
  - Accents: `#34d399` (teal-green for online status/buttons), `#7c3aed` (purple for user messages), `#5b21b6` (friend messages).
- **Responsive Design**: Grid-based friends list (1-column mobile, 2-column desktop), fluid chat window.
- **Components**: Reusable Shadcn UI components (`Avatar`, `Button`, `Card`, `Input`) for consistency.
- **Animations**: Subtle hover transitions and smooth scroll for chat messages.

### 6. Notifications
- **Toast Notifications**: Display new message alerts with sender name and content using `react-toastify` (dark-themed, top-right).
- **Real-Time**: Triggered via `newMessageNotification` WebSocket event for non-active chats.

## Tech Stack

- **Framework**: Next.js (v14+) - For server-side rendering and routing.
- **Language**: TypeScript - For type-safe components and API payloads.
- **UI**:
  - **Tailwind CSS**: Utility-first styling with a custom dark theme.
  - **Shadcn UI**: Accessible, reusable components (`Avatar`, `Button`, `Card`, `Input`, `Skeleton`).
- **Real-Time**: Socket.IO Client - For WebSocket communication with the backend.
- **HTTP Client**: Axios - For API calls (wrapped in `axiosPublic` and `axiosPrivate`).
- **Notifications**: `react-toastify` - For toast notifications.
- **Icons**: `lucide-react` - For icons like `MessageSquare`, `Send`, `Upload`, `Trash2`.
- **Routing**: Next.js App Router for client-side and server-side navigation.
- **State Management**: React hooks (`useState`, `useEffect`, `useRef`).


## Installation & Setup

### Prerequisites
- Node.js (v18+)
- Backend server running (NestJS, see backend README)
- npm or Yarn

### Steps
1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd chat-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create `.env.local` in the root:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_WS_URL=ws://localhost:3000
   ```

4. **Run the Application**:
   ```bash
   npm run dev  # Development mode
   npm run build && npm run start  # Production mode
   ```

5. **Access**:
   - Open `http://localhost:3000` in your browser.
   - Ensure the backend is running at `NEXT_PUBLIC_API_URL`.

## Usage

### Authentication
- Navigate to `/auth/login` or `/auth/register` to sign in or create an account.
- Use OTP for verification or password reset.

### Profile
- View/edit profile (name, profile picture) on the dashboard.
- Upload images via file input with real-time preview.

### Friends List
- See friends with online/offline status on the dashboard.
- Click a friend card to open the chat window.
- Add friends via `/dashboard/search`.

### Chat
- Open a chat by selecting a friend.
- Send messages, view statuses (sent, delivered, seen), and see typing indicators.
- Receive toast notifications for messages from other chats.

## Styling
- **Dark Theme**: Matches backend’s aesthetic with `#1f2a44` base, `#34d399` accents, and purple message bubbles (`#7c3aed`, `#5b21b6`).
- **Responsive**: Single-column friends list on mobile, optional two-column on desktop.
- **WhatsApp-Inspired**: Clean cards, avatar-based UI, teal-green buttons, and smooth transitions.

## Deployment
- **Platform**: Vercel (recommended for Next.js) or Netlify.
- **Build**: `npm run build` for optimized production build.
- **Environment**: Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` in your deployment platform.
- **CI/CD**: Use GitHub Actions for automated builds and deployments.

## Contributing
1. Fork the repo.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit: `git commit -m 'Add your feature'`.
4. Push: `git push origin feature/your-feature`.
5. Submit a Pull Request.

## Future Improvements
- Add support for group chats.
- Implement message search and filtering.
- Support multimedia messages (images, videos).
- Enhance accessibility (ARIA labels, keyboard navigation).
- Add end-to-end encryption for messages.

## License
GNU License - see [LICENSE](LICENSE) for details.

## Contact
Drop an issue or reach out for feedback! Built with ❤️ for real-time chat lovers.