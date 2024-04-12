import { SingleConversationContext } from '@frontapp/plugin-sdk';
import { CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useFrontContext } from "../providers/frontContext";
import { JsonResponse } from '../TypeGen/json-response';

const CustomerQuoted = () => {
  const [bidAmount, setBidAmount] = useState('');
  const context = useFrontContext() as SingleConversationContext;

  const _mark = () => {
    const amount = parseFloat(bidAmount) || 0;
    if (amount < 10 || amount > 1000000) {
      toast('Invalid bid amount entered');
      return;
    }

    fetch('/Front/CustomerQuoted', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + new URLSearchParams(window.location.search).get('auth_secret'),
      },
      body: JSON.stringify({
        BidAmount: amount,
        ConversationID: context.conversation.id,
        TeammateID: context.teammate.id,
      })
    })
      .then(async (response) => {
        const json = await response.json() as JsonResponse;
        if (json.Success) {
          // Create comment with $bidAmount
          toast('Marked as quoted');
        } else {
          toast(json.ErrorMessage);
        }
      })
      .catch(() => {
        toast('Unable to mark as quoted');
      });
  }

  return <div className="mt-2">
    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mark As Quoted</label>
    <div className="mt-1 flex rounded-md shadow-sm">
      <div className="relative flex flex-grow items-stretch focus-within:z-10">
        <input
          required
          type="number"
          name="bidAmount"
          id="bidAmount"
          className="block w-full rounded-none rounded-l-md border-none focus:outline-none sm:text-sm" 
          placeholder="Bid Amount (USD)"
          value={bidAmount}
          onChange={(event) => setBidAmount(event.target.value)}
        />
      </div>
      <button
        type="button"
        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-none  bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-0"
        onClick={_mark}
      >
        <CheckIcon className="h-5 w-5 text-white" />
        <span>Quoted</span>
      </button>
    </div>
  </div>
}

export default CustomerQuoted;