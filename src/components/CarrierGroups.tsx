import { useEffect, useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-toastify';

type CarrierGroup = {
  GroupID: number;
  Name: string;
  VehicleTypeName: string | null;
};

const CarrierGroups = () => {
  const [, setLoading] = useState(true);
  const [carrierGroups, setCarrierGroups] = useState<CarrierGroup[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/Front/GetCarrierGroups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + new URLSearchParams(window.location.search).get('auth_secret'),
      },
    })
      .then(async (response) => {
        const json = await response.json() as CarrierGroup[];
        setCarrierGroups(json);
        setLoading(false);
      });
  }, []);

  const _copyEmails = (carrierGroup: CarrierGroup | null) => {
    if (!carrierGroup) return;

    fetch('/Front/GetCarrierGroupEmails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + new URLSearchParams(window.location.search).get('auth_secret'),
      },
      body: JSON.stringify({ GroupID: carrierGroup.GroupID }),
    })
      .then(async (response) => {
        const json = await response.json() as { FullName: string, Email: string }[];
        if (json.length === 0) {
          toast("No emails found!");
        } else {
          navigator.clipboard.writeText(json.map((carrier) => carrier.Email).join(','));
          toast("Emails copied!");
        }
      });
  }

  const filteredCarriers =
    filter === ''
      ? carrierGroups
      : carrierGroups.filter((carrierGroup) => {
          return carrierGroup.Name.toLowerCase().includes(filter.toLowerCase())
        })

  return (
    <div className="mt-2">
      <label htmlFor="carrierGroups" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Copy Carrier Group Emails</label>
      <Combobox onChange={(value: CarrierGroup | null) => _copyEmails(value)}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              placeholder="Filter Carrier Groups.."
              onChange={(event) => setFilter(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setFilter('')}
          >
            <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900">
              {filteredCarriers.length === 0 && filter !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                  Nothing found.
                </div>
              ) : (
              filteredCarriers.map((carrierGroup) => (
                <Combobox.Option
                  key={carrierGroup.GroupID}
                  className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'text-white bg-sky-600' : 'text-gray-900 dark:text-gray-300'}`}
                  value={carrierGroup}
                >
                  <span
                    className="block truncate font-normal"
                  >
                    {carrierGroup.Name}
                  </span>
                </Combobox.Option>
              )))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {/*<a href="https://app.load1.com/Carrier/Groups" className="text-sm text-gray-500 hover:text-gray-700">Manage Carrier Groups</a>*/}
    </div>
  );
}

export default CarrierGroups;