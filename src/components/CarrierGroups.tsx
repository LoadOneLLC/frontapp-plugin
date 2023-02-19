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
      <select>
        {carrierGroups.map((carrierGroup) => (
          <option
            key={carrierGroup.GroupID}
            onClick={() => console.log(carrierGroup)}
          >
            {carrierGroup.Name}
          </option>
        ))}
      </select>
    </>
  );
}

export default CarrierGroups;