import './App.css';
import AgentNotes from './components/AgentNotes';
import CarrierGroups from './components/CarrierGroups';
import { useFrontContext } from './providers/frontContext';


function App() {
  const context = useFrontContext();

  if (!context)
    return (
      <div className="p-1 text-center dark:text-white">
        <p>Connecting...</p>
      </div>
    )

  return (
    <div className="p-1">
      {context.type === 'singleConversation' ? <AgentNotes /> : <p className="dark:text-slate-200">Select a conversation to see Agent Notes.</p>}
      <CarrierGroups />
    </div>
  );
}

export default App;
