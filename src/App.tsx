import { ToastContainer } from 'react-toastify';
import './App.css';
import AgentNotes from './components/AgentNotes';
import CarrierGroups from './components/CarrierGroups';
import OrderStatusLink from './components/OrderStatusLink';
import OrderStatusUpdate from './components/OrderStatusUpdate';
import CustomerQuoted from './components/CustomerQuoted';
import CustomerLink from './components/CustomerLink';
import { useFrontContext } from './providers/frontContext';
import { Feature, FEATURE_FLAGS } from './featureFlags';
import { FeatureFlagPanel } from './featureFlags/FeatureFlagPanel';

const App = () => {
  const context = useFrontContext();

  // Testing in dev mode
  if (import.meta.env.DEV)
  {
    return (
      <div className="p-1 w-full">
        <AgentNotes />
        <Feature name={FEATURE_FLAGS.CustomerLink}>
          <CustomerLink />
        </Feature>
        <CustomerQuoted />
        <OrderStatusUpdate />
        <OrderStatusLink />
        <CarrierGroups />
        <ToastContainer theme='dark' />
        <FeatureFlagPanel />
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
    <div className="p-1 w-full">
      {context.type === 'singleConversation' ? <AgentNotes /> : null}
      {context.type === 'singleConversation' ? <Feature name={FEATURE_FLAGS.CustomerLink}><CustomerLink /></Feature> : null}
      {context.type === 'singleConversation' ? <CustomerQuoted /> : null}
      {context.type === 'singleConversation' ? <OrderStatusUpdate /> : null}
      <OrderStatusLink />
      <CarrierGroups />
      <ToastContainer theme='dark' />
      <FeatureFlagPanel />
    </div>
  );
}

export default App;
