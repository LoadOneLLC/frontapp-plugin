import { useFrontContext } from '../providers/frontContext';
import Front, { SingleConversationContext } from '@frontapp/plugin-sdk';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { JsonResponse } from '../TypeGen/json-response';

function AgentNotes() {
  const context = useFrontContext() as SingleConversationContext;
  const [agentNote, setAgentNote] = useState("");
  const [billingCustomerId, setBillingCustomerId] = useState(0);
  const [topCustomer, setTopCustomer] = useState(false);
  const [creatingQuote, setCreatingQuote] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV)
    {
      setAgentNote("L-10, Asset Only, Bill-To: FIRJA, Autho: Confirm @ Booking");
      setBillingCustomerId(1);
      setTopCustomer(true);
      return;
    }
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
  }, [context?.conversation.recipient]);

  const createQuote = () => {
    setCreatingQuote(true);
    fetch('/Front/CreateQuote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + new URLSearchParams(window.location.search).get('auth_secret'),
      },
      body: JSON.stringify({ 
        ConversationID: context.conversation.id,
        TeammateID: context.teammate.id
      })
    })
    .then(async (response) => {
      var json = await response.json() as JsonResponse;
      if (json.Success) {
        var quoteLink = json.Links.find(l => l.Name === 'self');
        if (quoteLink) Front.openUrl(quoteLink.Link);
      } else {
        toast(json.ErrorMessage);
      }
    })
    .catch(() => {
      toast("Error creating quote!");
    })
    .finally(() => {
      setCreatingQuote(false);
    });
  }

  return (
    <>
      <h4 className='text-xl dark:text-white'>AGENT NOTES</h4>
      {topCustomer && <p className='dark:text-red-600'>Top Customer</p>}
      <p className='dark:text-slate-200 mb-2'>{agentNote}</p>
      {billingCustomerId > 0 ? <button className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={() => Front.openUrl(`https://app.load1.com/Customers/Customer/${billingCustomerId}`)}>
        Billing Customer
      </button> : null}
      <button className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={() => Front.openUrl(`https://app.load1.com/Quote/Index?frontId=${context.conversation.id}`)}>
        Build Quote
      </button>
      <button disabled={creatingQuote} className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={createQuote}>
        Create Quote <i>AI</i>
      </button>
      <button className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={() => Front.openUrl(`https://app.load1.com/Quote/BlindBidQuote?frontId=${context.conversation.id}`)}>
        Blind Bid Quote
      </button>
    </>
  );
}

export default AgentNotes;
