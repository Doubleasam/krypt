import React, { useEffect, useState } from 'react';
import './CheckoutForm.css'; // Import CSS file
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

export default function CheckoutForm({ submitOrder }) {
  const wallet = useWallet();
  const [canSubmit, setCanSubmit] = useState(false);
  useEffect(() => {
    if(!wallet.publicKey) {
      setCanSubmit(false);
    } else {
      console.log(wallet.publicKey.toString());
      setCanSubmit(true);
    }
  

  }, [wallet])
  


  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [size, setSize] = useState(''); // Add size state

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updated ${name}:`, value); // Debugging: Ensure size is captured

    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    // setFormData((prevData) => ({
    //   ...prevData,
    //   [name]: value,
    // }));
  };

    // Separate handler for size dropdown
    const handleSizeChange = (e) => {
        setSize(e.target.value);
      };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data on Submit:", formData); // Ensure size is correct

    if (!size) {
      toast.warn("Please select a size.");
        return;
    }
    submitOrder(formData, size);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Billing Information</h2>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <div className="form-group">
            <label>Size</label>
            <select
                name="size"
                value={formData.size}
                onChange={handleSizeChange}
                required
            >
                <option value="">Select Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="XLarge">X-Large</option>

            </select>
        </div>
      </div>

      <h2>Shipping Address</h2>

      <div className="form-group">
        <label>Address Line 1</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
        />
      </div>


      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>State/Province</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
   

        

        
      </div>

      <button type="submit" disabled = {canSubmit ? false : true} className={`submit-button cursor-pointer ${canSubmit === true ? "block" : "hidden"}`}>Mint and Order!</button>
      <div onClick={() => toast.warn("Kindly connect your wallet first!")} type="submit" className={`submit-button cursor-pointer justify-center items-center ${canSubmit === false ? "flex" : "hidden"}`}>Mint and Order!</div>
    </form>
  );
}
