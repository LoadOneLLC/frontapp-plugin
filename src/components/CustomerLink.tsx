import { type SingleConversationContext } from '@frontapp/plugin-sdk';
import { useState } from "react";
import { toast } from 'react-toastify';
import { useFrontContext } from "../providers/frontContext";
import type { JsonResponse } from '../TypeGen/json-response';
import type { ApiLink } from '../TypeGen/api-link';

const CustomerLink = () => {
  const [saving, setSaving] = useState(false);
  const context = useFrontContext() as SingleConversationContext;

  const _insertLink = () => {
    setSaving(true);
    fetch('/Front/CustomerLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + new URLSearchParams(window.location.search).get('auth_secret'),
      },
      body: JSON.stringify({
        ConversationID: context.conversation.id,
        TeammateID: context.teammate.id,
      })
    })
      .then(async (response) => {
        const json = await response.json() as JsonResponse;
        if (json.Success) {
          const customerLink = json.Links.find(l => l.Name === 'QuoteResponse') as ApiLink;
          if (typeof context?.conversation.draftId !== 'undefined') {
            const bookItLink = `${customerLink.Link}?action=book`;
            const counterLink = `${customerLink.Link}?action=counter`;
            const declineLink = `${customerLink.Link}?action=decline`;
            context.fetchDraft(context.conversation.draftId)
              .then(draft => {
                if (draft) {
                  context.updateDraft(draft.id, {
                    updateMode: 'insert',
                    content: {
                      body: `<a href="${bookItLink}" style="color: #10b981">Book It</a> | <a href="${counterLink}" style="color: #3b82f6">Counter</a> | <a href="${declineLink}" style="color: #ef4444">Decline</a>`,
                      type: 'html'
                    }
                  });
                }
              });
          }
        } else {
          toast(json.ErrorMessage);
        }
      })
      .catch(() => {
        toast('Unable to insert customer link.');
      })
      .finally(() => setSaving(false));
  }

  return typeof context?.conversation.draftId !== 'undefined'
    ? <button
        className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm"
        onClick={_insertLink}
        disabled={saving}
      >
        Insert Customer Link
      </button>
    : null;
}

export default CustomerLink;