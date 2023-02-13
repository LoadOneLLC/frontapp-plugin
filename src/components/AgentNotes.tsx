import { useFrontContext } from '../providers/frontContext';
import { Button, Heading, Paragraph } from '@frontapp/ui-kit';
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
      <Heading>AGENT NOTES</Heading>
      {topCustomer && <Paragraph color="#dc3545">Top Customer</Paragraph>}
      <Paragraph>{agentNote}</Paragraph>
      <br />
      {billingCustomerId && <Button type='primary' className='Action-Button' onClick={() => Front.openUrl(`https://app.load1.com/Customers/Customer/${billingCustomerId}`)}>Billing Customer</Button>}
      <br />
      <Button type='primary' className='Action-Button' onClick={() => Front.openUrl(`https://app.load1.com/Quote/Index?frontId=${context.conversation.id}`)}>Quote</Button>
      <br />
      <Button type='primary' className='Action-Button' onClick={() => Front.openUrl(`https://app.load1.com/Quote/BlindBidQuote?frontId=${context.conversation.id}`)}>Blind Bid Quote</Button>
    </>
  );
}

export default AgentNotes;
