import './App.css';
import AgentNotes from './components/AgentNotes';
import CarrierGroups from './components/CarrierGroups';
import { useFrontContext } from './providers/frontContext';


function App() {
  const context = useFrontContext();

  if (!context)
    return (
      <div className="App">
        <p>Connecting...</p>
      </div>
    )

  return (
    <div className="App">
      {context.type === 'singleConversation' ? <AgentNotes /> : <p>Select a conversation to see Agent Notes.</p>}
      <CarrierGroups />
    </div>
  );
}

export default App;
