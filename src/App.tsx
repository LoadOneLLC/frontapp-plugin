import './App.css';
import AgentNotes from './components/AgentNotes';
import { useFrontContext } from './providers/frontContext';


function App() {
  const context = useFrontContext();

  if (!context)
    return (
      <div className="App">
        <p>Connecting...</p>
      </div>
    )

  switch(context.type) {
    case 'noConversation':
      return (
        <div className="App">
          <p>No conversation selected. Select a conversation to use this plugin.</p>
        </div>
      );
    case 'singleConversation':
      return (
        <AgentNotes />
      );
    case 'multiConversations':
      return (
        <div className="App">
          <p>Multiple conversations selected. Select only one conversation to use this plugin.</p>
        </div>
      );
    default:
      return (
        <div className="App">
          <p>Unsupported context type: ${context.type}</p>
        </div>
      );
  };
}

export default App;
