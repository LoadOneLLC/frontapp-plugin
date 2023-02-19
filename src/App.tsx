import './App.css';
import AgentNotes from './components/AgentNotes';
import CarrierGroups from './components/CarrierGroups';
import { useFrontContext } from './providers/frontContext';


function App() {
  const context = useFrontContext();

  if (!context)
    return (
      <div className="text-center dark:text-white">
        <p>Connecting...</p>
      </div>
    )

  return (
    <div className="text-center">
      {context.type === 'singleConversation' ? <AgentNotes /> : <p className="dark:text-white">Select a conversation to see Agent Notes.</p>}
      <CarrierGroups />
    </div>
  );
}

export default App;
