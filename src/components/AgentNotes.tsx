import { useFrontContext } from '../providers/frontContext';
import Front, { SingleConversationContext } from '@frontapp/plugin-sdk';
import { useEffect, useState } from 'react';

function AgentNotes() {
  const context = useFrontContext() as SingleConversationContext;
  const [agentNote, setAgentNote] = useState("");
  const [billingCustomerId, setBillingCustomerId] = useState(0);
  const [topCustomer, setTopCustomer] = useState(false);

  useEffect(() => {
    if (!context.conversation.recipient) {
      return;
    }

    fetch('/Front/GetAgentNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + new URLSearchParams(window.location.search).get('auth_secret'),
      },
      body: JSON.stringify({ email: context.conversation.recipient.handle })
    })
      .then(async (response) => {
        var json = await response.json() as { AgentNote: string, BillToCustomerID: number, IsTop: boolean };
        setAgentNote(json.AgentNote);
        setBillingCustomerId(json.BillToCustomerID);
        setTopCustomer(json.IsTop);
      })
      .catch(() => {
        setAgentNote("None");
        setBillingCustomerId(0);
        setTopCustomer(false);
      });
  }, [context.conversation.recipient]);

  return (
    <>
      <h4 className='dark:text-white'>AGENT NOTES</h4>
      {topCustomer && <p className='dark:text-red-600'>Top Customer</p>}
      <p className='dark:text-white'>{agentNote}</p>
      <br />
      <div>
        {billingCustomerId && <>
          <button onClick={() => Front.openUrl(`https://app.load1.com/Customers/Customer/${billingCustomerId}`)}>Billing Customer</button>
          <br />
        </>}
        <button onClick={() => Front.openUrl(`https://app.load1.com/Quote/Index?frontId=${context.conversation.id}`)}>Quote</button>
        <br />
        <button onClick={() => Front.openUrl(`https://app.load1.com/Quote/BlindBidQuote?frontId=${context.conversation.id}`)}>Blind Bid Quote</button>
        <br />
      </div>
    </>
  );
}

export default AgentNotes;
