import { Dropdown, DropdownItem } from '@frontapp/ui-kit';
import { useEffect, useState } from 'react';

type CarrierGroup = {
  GroupID: number;
  Name: string;
  VehicleTypeName: string;
};

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

  return (
    <>
      <Dropdown isLoading={loading}>
        {carrierGroups.map((carrierGroup) => (
          <DropdownItem type="simple" key={carrierGroup.GroupID} description={carrierGroup.VehicleTypeName}>{carrierGroup.Name}</DropdownItem>
        ))}
      </Dropdown>
    </>
  );
}

export default CarrierGroups;