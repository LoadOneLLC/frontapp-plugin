import { useFrontContext } from '../providers/frontContext';
import Front, { SingleConversationContext } from '@frontapp/plugin-sdk';
import { useEffect, useState, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Listbox, Transition } from '@headlessui/react'
import { JsonResponse } from '../TypeGen/json-response';
import { ViewModel } from '../TypeGen/GetAgentNote/view-model';
import { NoteViewModel } from '../TypeGen/GetAgentNote/note-view-model';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

function AgentNotes() {
  const context = useFrontContext() as SingleConversationContext;
  const [notes, setNotes] = useState<NoteViewModel[]>([]);
  const [selectedNoteID, setSelectedNoteID] = useState(0);
  const [creatingQuote, setCreatingQuote] = useState(false);
  const [replyingQuote, setReplyingQuote] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV)
    {
      setNotes([
        {
          ID: 1,
          Tag1: "Test 1",
          AgentNote: "L-10, Asset Only, Bill-To: FIRJA, Autho: Confirm @ Booking",
          BillToCustomerID: 1,
          IsTop: true
        },
        {
          ID: 2,
          Tag1: "Test 2",
          AgentNote: "L-10, Asset Only, Bill-To: FIRJA, Autho: Confirm @ Booking",
          BillToCustomerID: 1,
          IsTop: false
        },
      ]);
      setSelectedNoteID(0);
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
        const json = await response.json() as ViewModel;
        setNotes(json.Notes);
        setSelectedNoteID(json.Notes.length === 1 ? json.Notes[0].ID : 0);
      })
      .catch(() => {
        setNotes([]);
        setSelectedNoteID(0);
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
      const json = await response.json() as JsonResponse;
      if (json.Success) {
        const quoteLink = json.Links.find(l => l.Name === 'self');
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

  const replyQuote = () => {
    setReplyingQuote(true);
    fetch('/Front/ReplyQuote', {
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
      const json = await response.json() as JsonResponse;
      if (json.Success === false) {
        toast(json.ErrorMessage);
      }
    })
    .catch(() => {
      toast("Error replying quote!");
    })
    .finally(() => {
      setReplyingQuote(false);
    });
  }

  const renderAgentNote = (note: NoteViewModel) => {
    return <>
      {note.IsTop && <p className='dark:text-red-600'>Top Customer</p>}
      <p className='dark:text-slate-200 mb-2'>{note.AgentNote}</p>
      {note.BillToCustomerID && <button className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={() => Front.openUrl(`https://app.load1.com/Customers/Customer/${note.BillToCustomerID}`)}>
        Billing Customer
      </button>}
    </>
  }

  return (
    <>
      <h4 className='text-xl dark:text-white'>AGENT NOTES</h4>
      {notes.length > 1 &&  <Listbox value={selectedNoteID} onChange={setSelectedNoteID}>
        <div className="relative mt-1 mb-2">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{notes.find(n => n.ID === selectedNoteID)?.Tag1 ?? "Select Agent Note"}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-900">
              {notes.map((note) => (
                <Listbox.Option
                  key={note.ID}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'text-white bg-sky-600' : 'text-gray-900 dark:text-gray-300'
                    }`
                  }
                  value={note.ID}
                >
                  <span
                    className="block truncate font-normal"
                  >
                    {note.Tag1 ?? "No Tag1"}
                  </span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>}
      {selectedNoteID > 0 && renderAgentNote(notes.find(n => n.ID === selectedNoteID) as NoteViewModel)}
      {notes.length === 0 && <p className='dark:text-slate-200'>No agent notes found.</p>}
      <button className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={() => Front.openUrl(`https://app.load1.com/Quote/Index?frontId=${context.conversation.id}`)}>
        Build Quote
      </button>
      <button disabled={creatingQuote || replyingQuote} className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={createQuote}>
        {creatingQuote ? 'Creating Quote...' : <>Create Quote <i>AI</i></>}
      </button>
      <button disabled={creatingQuote || replyingQuote} className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={replyQuote}>
        {replyingQuote ? 'Offering Quote...' : <>BETA: Reply <i>AI</i></>}
      </button>
      <button className="px-4 py-2 mb-2 d-block w-full font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm" onClick={() => Front.openUrl(`https://app.load1.com/Quote/BlindBidQuote?frontId=${context.conversation.id}`)}>
        Blind Bid Quote
      </button>
    </>
  );
}

export default AgentNotes;
