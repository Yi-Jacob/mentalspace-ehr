import { RouteObject } from 'react-router-dom';
import TodoPage from '../pages/todo';

const todoRoutes: RouteObject[] = [
  {
    index: true,
    element: <TodoPage />,
  },
];

export default todoRoutes;
