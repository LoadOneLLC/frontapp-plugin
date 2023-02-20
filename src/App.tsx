import './App.css';
import AgentNotes from './components/AgentNotes';
import CarrierGroups from './components/CarrierGroups';
import OrderStatusLink from './components/OrderStatusLink';
import OrderStatusUpdate from './components/OrderStatusUpdate';
import { useFrontContext } from './providers/frontContext';


function App() {
  const context = useFrontContext();

  // Testing in dev mode
  if (import.meta.env.DEV)
  {
    return (
      <div className="p-1">
        <AgentNotes />
        <br />
        <OrderStatusUpdate />
        <br />
        <OrderStatusLink />
        <br />
        <CarrierGroups />
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
      {context.type === 'singleConversation' ? <AgentNotes /> : <p className="dark:text-slate-200">Select a conversation to see Agent Notes.</p>}
      <br />
      <OrderStatusUpdate />
      <br />
      <OrderStatusLink />
      <br />
      <CarrierGroups />
    </div>
  );
}

export default App;
