import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAddress } from "../redux/slices/addressSlice";

function Address() {
  interface addr {
    city: string;
    country: string;
    area: string;
  }
  const storedAddress = localStorage.getItem("address");
  const address: addr | null = storedAddress ? JSON.parse(storedAddress) : null;

  const [city, setCity] = useState(address ? address.city : "");
  const [country, setCountry] = useState(address ? address.country : "");
  const [area, setArea] = useState(address ? address.area : "");
  const dispatch = useDispatch();

  const handleSave = () => {
    const myaddress = { city, country, area };
    dispatch(setAddress(myaddress));
    localStorage.setItem("address", JSON.stringify(myaddress));
  };

  return (
    <div className="p-4 border mb-4">
      <h2 className="text-lg font-semibold mb-4">Add Address</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border"
        />
        <input
          type="text"
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full p-2 border"
        />
        <button
          onClick={handleSave}
          className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}

export default Address;
