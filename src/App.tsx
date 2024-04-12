import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AgentNotes from './components/AgentNotes';
import CarrierGroups from './components/CarrierGroups';
import OrderStatusLink from './components/OrderStatusLink';
import OrderStatusUpdate from './components/OrderStatusUpdate';
import { useFrontContext } from './providers/frontContext';

const App = () => {
  const context = useFrontContext();

  // Testing in dev mode
  if (import.meta.env.DEV)
  {
    return (
      <div className="p-1">
        <AgentNotes />
        <OrderStatusUpdate />
        <OrderStatusLink />
        <CarrierGroups />
        <ToastContainer theme='dark' />
      </div>
    );
  }

  if (!context)
    return (
      <div className="p-1 w-full">
        <p className="text-center text-xl dark:text-white">Connecting...</p>
      </div>
    )

  return (
    <div className="p-1">
      {context.type === 'singleConversation' ? <AgentNotes /> : null}
      {context.type === 'singleConversation' ? <OrderStatusUpdate /> : null}
      <OrderStatusLink />
      <CarrierGroups />
      <ToastContainer theme='dark' />
    </div>
  );
}

export default App;
