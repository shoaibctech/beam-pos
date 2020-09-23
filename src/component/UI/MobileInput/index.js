import React from 'react';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'

const MobileInput = ({country = 'gb', phone, setPhone}) => {
    return (
      <PhoneInput
          country={country}
          enableAreaCodes={true}
          disableDropdown={true}
          disableCountryCode={true}
          enableLongNumbers={true}
          onlyCountries={['gb', 'pk']}
          value={phone}
          onChange={phone => setPhone(phone)}
      />
    );
};

export default MobileInput;
