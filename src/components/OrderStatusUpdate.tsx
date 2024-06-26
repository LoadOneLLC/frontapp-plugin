import Front, { SingleConversationContext } from '@frontapp/plugin-sdk';
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useFrontContext } from "../providers/frontContext";

const OrderStatusUpdate = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const context = useFrontContext() as SingleConversationContext;

  const _insertStatusUpdate = () => {
    if (orderNumber.length < 7) {
      toast('Please enter a valid Order #');
      return;
    }

    fetch('/Front/GetStatusUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + new URLSearchParams(window.location.search).get('auth_secret'),
        },
        body: JSON.stringify({ OrderNumber: orderNumber })
    })
        .then(async (response) => {
          const json = await response.json();

          context.listMessages().then((messages) =>
            Front.createDraft({
              content: {
                body: json.BodyHtml,
                type: 'html'
              },
              replyOptions: {
                type: 'replyAll',
                originalMessageId: messages.results[messages.results.length - 1].id
              }
            })
          );
        })
        .catch(() => {
            toast('Unable to create Status Update, usually this is because we couldn\'t find the Order #');
        });
  }

  return <div className="mt-2">
    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reply w/ Order Status</label>
    <div className="mt-1 flex rounded-md shadow-sm">
      <div className="relative flex flex-grow items-stretch focus-within:z-10">
        <input
          minLength={7}
          type="number"
          name="orderNumber"
          id="orderNumber"
          className="block w-full rounded-none rounded-l-md border-none focus:outline-none sm:text-sm" 
          placeholder="Order #"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
        />
      </div>
      <button
        type="button"
        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-none  bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-0"
        onClick={() => _insertStatusUpdate()}
      >
        <EnvelopeIcon className="h-5 w-5 text-white" />
        <span>Reply</span>
      </button>
    </div>
  </div>
}

export default OrderStatusUpdate;