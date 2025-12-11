import { type SingleConversationContext } from '@frontapp/plugin-sdk';
import { useRef, useState } from "react";
import { toast } from 'react-toastify';
import { useFrontContext } from "../providers/frontContext";

const CustomerLink = () => {
  const [saving, setSaving] = useState(false);
  const context = useFrontContext() as SingleConversationContext;
  const contextRef = useRef(context);
  contextRef.current = context;

  const _insertLink = async (includeCounterOffer: boolean) => {
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
        IncludeCounterOffer: includeCounterOffer
      })
    })
      .then(async (response) => {
        const json = await response.json() as { Success: boolean; ErrorMessage: string; Html: string };
        if (json.Success) {
          if (typeof contextRef.current?.conversation.draftId !== 'undefined') {
            await contextRef.current.updateDraft(contextRef.current.conversation.draftId, {
              updateMode: 'insert',
              content: {
                body: json.Html,
                type: 'html'
              }
            });
          } else {
            const messages = await contextRef.current.listMessages();
            await contextRef.current.createDraft({
              content: {
                body: json.Html,
                type: 'html'
              },
              replyOptions: {
                type: 'replyAll',
                originalMessageId: messages.results[messages.results.length - 1].id
              }
            });
          }
        } else {
          toast(json.ErrorMessage);
        }
      })
      .catch((e) => {
        console.error(e);
        toast('Unable to insert Book It button.');
      })
      .finally(() => setSaving(false));
  }

  return <>
    <button
      className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm"
      onClick={() => _insertLink(true)}
      disabled={saving}
    >
      Book It Buttons
    </button>
    <button
      className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm"
      onClick={() => _insertLink(false)}
      disabled={saving}
    >
      Book It Buttons (No Counter)
    </button>
  </>;
}

export default CustomerLink;