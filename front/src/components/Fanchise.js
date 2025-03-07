import React from "react";
import "./Fanchise.css";

const Franchise = () => (





  
  <div className="contain">
    <div className="form-header">
      <h1 className="head"> Employee Form</h1>
      <div className="para">
       
      </div>
    </div>

    <div className="formbody">
      <form className="franchise-form"  >
        <input
          type="number"
          placeholder=" Enter Employee ID"
          style={{ backgroundColor: "#CFE1FF" }}
          name="f_Id"
          // value={employeeData.f_Id}
          // onChange={handleChange}
          required
        />
        <input
          type="file"
          placeholder=""
          className="a1"
          style={{ backgroundColor: "#CFE1FF" }}
          required
        />
        <input
          type="date"
          placeholder="dd--mm--yyyy*"
          style={{ backgroundColor: "#CFE1FF" }}
          required
        />
        <input
          type="text"
          placeholder="Contact*"
          style={{ backgroundColor: "#CFE1FF" }}
          required
        />
        <select
          className="sbHolder"
          name="investment_level"
          id="investment_level"
          style={{ backgroundColor: "#CFE1FF" }}
        >
          <option value="">Your Investment Level</option>
          <option value="2.5L-4L">2.5L-4L</option>
          <option value="4L-8L">4L-8L</option>
          <option value="Above 8L">Above 8L</option>
        </select>
        <select
          className="sbHolder"
          name="state"
          id="state"
          style={{ backgroundColor: "#CFE1FF" }}
        >
          <option value="">Select State</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Chennai">Chennai</option>
          <option value="Chattisgadh">Chattisgadh</option>
          <option value="Tamilnadu">Tamilnadu</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Telangana">Telangana</option>
          <option value="Goa">Goa</option>
          <option value="Delhi">Delhi</option>
          <option value="Punjab">Punjab</option>
        </select>
        <input
          type="text"
          placeholder="City*"
          style={{ backgroundColor: "#CFE1FF" }}
          required
        />
       
        <button className="submit" type="submit">
          SUBMIT
        </button>
      </form>
    </div>
  </div>
);

export default Franchise;
