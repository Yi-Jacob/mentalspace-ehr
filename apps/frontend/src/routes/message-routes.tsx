import Message from '../pages/messages';
import { RouteObject } from 'react-router-dom';

const messageRoutes: RouteObject[] = [
  {
    index: true,
    element: <Message />,
  },
];

export default messageRoutes; 