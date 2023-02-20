import { useEffect, useState, Fragment } from 'react';
import { Combobox, Menu, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

type CarrierGroup = {
  GroupID: number;
  Name: string;
  VehicleTypeName: string | null;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function CarrierGroups() {
  const [loading, setLoading] = useState(true);
  const [carrierGroups, setCarrierGroups] = useState<CarrierGroup[]>([]);

  useEffect(() => {
    fetch('/Front/GetCarrierGroups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + new URLSearchParams(window.location.search).get('auth_secret'),
      },
    })
      .then(async (response) => {
        var json = await response.json() as CarrierGroup[];
        setCarrierGroups(json);
        setLoading(false);
      });
  }, []);

  const filteredCarriers =
    filter === ''
      ? carrierGroups
      : carrierGroups.filter((carrierGroup) => {
          return carrierGroup.Name.toLowerCase().includes(filter.toLowerCase())
        })

  return (
    <>
      <Combobox onChange={(value) => console.log(value)}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              placeholder="Copy Carrier Emails"
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
            <Combobox.Options className="w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              {filteredCarriers.length === 0 && filter !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
              filteredCarriers.map((carrierGroup) => (
                <Combobox.Option
                  key={carrierGroup.GroupID}
                  className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900`}
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
    </>
  );
}

export default CarrierGroups;