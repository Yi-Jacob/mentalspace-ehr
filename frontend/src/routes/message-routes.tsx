import Message from '../pages/Message';
import { RouteObject } from 'react-router-dom';

const messageRoutes: RouteObject[] = [
  {
    index: true,
    element: <Message />,
  },
];

export default messageRoutes; 