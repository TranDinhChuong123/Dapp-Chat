import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/ConnectWallet.tsx'),
  route('chat/:address', 'routes/Chat.tsx'),
  route('start-chat', 'routes/StartChat.tsx'),

] satisfies RouteConfig;
