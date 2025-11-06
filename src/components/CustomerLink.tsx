import { type SingleConversationContext } from '@frontapp/plugin-sdk';
import { useState } from "react";
import { toast } from 'react-toastify';
import { useFrontContext } from "../providers/frontContext";

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
        const json = await response.json() as { Success: boolean; ErrorMessage: string; Html: string };
        if (json.Success) {
          if (typeof context?.conversation.draftId !== 'undefined') {
            context.fetchDraft(context.conversation.draftId)
              .then(draft => {
                if (draft) {
                  context.updateDraft(draft.id, {
                    updateMode: 'insert',
                    content: {
                      body: json.Html,
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
        toast('Unable to insert option links.');
      })
      .finally(() => setSaving(false));
  }

  return typeof context?.conversation.draftId !== 'undefined'
    ? <button
        className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm"
        onClick={_insertLink}
        disabled={saving}
      >
        Insert Option Links
      </button>
    : null;
}

export default CustomerLink;