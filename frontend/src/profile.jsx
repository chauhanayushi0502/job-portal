// import React from "react";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// function Profile() {
//   const [profile, setprofile] = useState({
//     gender: "",
//     dob: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     pincode: "",
//     skills: "",
//     degree: "",
//     college: "",
//     university: "",
//     passingYear: "",
//     percentage: "",
//     company: "",
//     position: "",
//     startDate: "",
//     endDate: "",
//     description: "",
//     resume: "",
//     linkedin: "",
//     portfolio: "",
//   });

//   const countries = [
//     "India",
//     "United States",
//     "United Kingdom",
//     "Canada",
//     "Australia",
//     "Germany",
//     "France",
//     "Japan",
//     "China",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setprofile((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const save_profile = async (e) => {
//     e.preventDefault();

//     const data = {
//       gender: profile.gender,
//       dob: profile.dob,
//       phone: profile.phone,
//       address: profile.address,
//       city: profile.city,
//       state: profile.state,
//       country: profile.country,
//       pincode: profile.pincode,
//       skills: profile.skills,

//       education: {
//         degree: profile.degree,
//         college: profile.college,
//         university: profile.university,
//         passingYear: profile.passingYear,
//         percentage: profile.percentage,
//       },

//       experience: {
//         company: profile.company,
//         position: profile.position,
//         startDate: profile.startDate,
//         endDate: profile.endDate,
//         description: profile.description,
//       },

//       resume: profile.resume,
//       linkedin: profile.linkedin,
//       portfolio: profile.portfolio,
//     };
//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/candidate/addcandidate",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: localStorage.getItem("token"),
//           },
//           body: JSON.stringify(data)
//         },
//       );
//       const result = await response.json();
//       if (response.ok) {
//         alert(result.message || "profile save Successfully");
//         setprofile({
//           gender: "",
//           dob: "",
//           phone: "",
//           address: "",
//           city: "",
//           state: "",
//           country: "",
//           pincode: "",
//           title: "",
//           skills: "",
//           degree: "",
//           college: "",
//           university: "",
//           passingYear: "",
//           percentage: "",
//           company: "",
//           position: "",
//           startDate: "",
//           endDate: "",
//           description: "",
//           resume: "",
//           linkedin: "",
//           portfolio: "",
//         });
//       } else {
//         alert(result.message || "Failed to save Profile");
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   return (
//     <div style={{ width: "500px", margin: "30px auto" }}>
//       <h2>Profile</h2>

//       <form onSubmit={save_profile}>
//         <div>
//           Gender :<label>Male</label>
//           <input
//             type="radio"
//             name="gender"
//             value="male"
//             onChange={handleChange}
//             required
//           />
//           <label>Female</label>
//           <input
//             type="radio"
//             name="gender"
//             value="female"
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <br />
//         <div>
//           <label>DOB :  </label>
//           <input type="date" name="dob" onChange={handleChange} required  value={profile.dob}/>
//         </div>
//         <br />
//         <div>
//           <label>Phone Number :  </label>
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone Number"
//             value={profile.phone}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <br />
//         <div>
//           <label>Address :  </label>
//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             value={profile.address}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <br />
//         <div>
//           <label>Country :  </label>

//           <select
//             name="country"
//             value={profile.country}
//             onChange={handleChange}
//           >
//             <option value="">Select Country</option>

//             {countries.map((country, index) => (
//               <option key={index} value={country}>
//                 {country}
//               </option>
//             ))}
//           </select>
//         </div>
//         <br />
//         <div>
//           <label>State :  </label>
//           <input
//             type="text"
//             name="state"
//             onChange={handleChange}
//             value={profile.state}
//             placeholder="state"
//           />
//         </div>
//         <br />
//         <div>
//           <label>city :  </label>
//           <input
//             type="text"
//             name="city"
//             onChange={handleChange}
//             value={profile.city}
//             placeholder="city"
//           />
//         </div>
//         <br />
//         <div>
//           <label>skills :  </label>
//           <input
//             type="text"
//             name="skills"
//             onChange={handleChange}
//             value={profile.skills}
//             placeholder="skills"
//           />
//         </div>
//         <br />
//         <div>
//           <label>degree :  </label>
//           <input
//             type="text"
//             name="degree"
//             onChange={handleChange}
//             value={profile.degree}
//             placeholder="degree"
//           />
//         </div>
//         <br />
//         <div>
//           <label>college :  </label>
//           <input
//             type="text"
//             name="college"
//             onChange={handleChange}
//             value={profile.college}
//             placeholder="college"
//           />
//         </div>
//         <br />
//         <div>
//           <label>university :  </label>
//           <input
//             type="text"
//             name="university"
//             onChange={handleChange}
//             value={profile.university}
//             placeholder="university"
//           />
//         </div>
//         <br />
//         <button type="submit">Save</button>
//       </form>
//     </div>
//   );
// }
// export default Profile;
import React, { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    gender: "",
    dob: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    title: "",
    skills: "",
    degree: "",
    college: "",
    university: "",
    passingYear: "",
    percentage: "",
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    resume: "",
    linkedin: "",
    portfolio: "",
  });

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
  ];

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/candidate/getcandidate",
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setProfile({
          gender: data.gender || "",
          dob: data.dob ? data.dob.substring(0, 10) : "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          pincode: data.pincode || "",
          title: data.title || "",
          skills: Array.isArray(data.skills)
            ? data.skills.join(", ")
            : data.skills || "",

          degree: data.education?.[0]?.degree || "",
          college: data.education?.[0]?.college || "",
          university: data.education?.[0]?.university || "",
          passingYear: data.education?.[0]?.passingYear || "",
          percentage: data.education?.[0]?.percentage || "",

          company: data.experience?.[0]?.company || "",
          position: data.experience?.[0]?.position || "",
          startDate: data.experience?.[0]?.startDate
            ? data.experience[0].startDate.substring(0, 10)
            : "",
          endDate: data.experience?.[0]?.endDate
            ? data.experience[0].endDate.substring(0, 10)
            : "",
          description: data.experience?.[0]?.description || "",

          resume: data.resume || "",
          linkedin: data.linkedin || "",
          portfolio: data.portfolio || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    const body = {
      gender: profile.gender,
      dob: profile.dob,
      phone: profile.phone,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      pincode: profile.pincode,
      title: profile.title,
      skills: profile.skills.split(",").map((item) => item.trim()),

      education: [
        {
          degree: profile.degree,
          college: profile.college,
          university: profile.university,
          passingYear: Number(profile.passingYear),
          percentage: Number(profile.percentage),
        },
      ],

      experience: [
        {
          company: profile.company,
          position: profile.position,
          startDate: profile.startDate,
          endDate: profile.endDate,
          description: profile.description,
        },
      ],

      resume: profile.resume,
      linkedin: profile.linkedin,
      portfolio: profile.portfolio,
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/candidate/addcandidate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(body),
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: "600px", margin: "20px auto" }}>
      <h2>Candidate Profile</h2>

      <form onSubmit={saveProfile}>
        <div>
          <label>Gender</label>
          <br />
          <input
            type="radio"
            name="gender"
            value="male"
            checked={profile.gender === "male"}
            onChange={handleChange}
          />
          Male
          <input
            type="radio"
            name="gender"
            value="female"
            checked={profile.gender === "female"}
            onChange={handleChange}
          />
          Female
        </div>

        <br />

        <input
          type="date"
          name="dob"
          value={profile.dob}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={profile.phone}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={profile.address}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={profile.city}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={profile.state}
          onChange={handleChange}
        />

        <br />
        <br />

        <select name="country" value={profile.country} onChange={handleChange}>
          <option value="">Select Country</option>

          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <br />
        <br />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={profile.pincode}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="title"
          placeholder="Professional Title"
          value={profile.title}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="skills"
          placeholder="React, Node, MongoDB"
          value={profile.skills}
          onChange={handleChange}
        />

        <hr />
        <h3>Education</h3>

        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={profile.degree}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="college"
          placeholder="College"
          value={profile.college}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="university"
          placeholder="University"
          value={profile.university}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="number"
          name="passingYear"
          placeholder="Passing Year"
          value={profile.passingYear}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="number"
          name="percentage"
          placeholder="Percentage"
          value={profile.percentage}
          onChange={handleChange}
        />

        <hr />

        <h3>Experience</h3>

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={profile.company}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={profile.position}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Start Date</label>

        <br />

        <input
          type="date"
          name="startDate"
          value={profile.startDate}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>End Date</label>

        <br />

        <input
          type="date"
          name="endDate"
          value={profile.endDate}
          onChange={handleChange}
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Job Description"
          value={profile.description}
          onChange={handleChange}
        />

        <hr />

        <h3>Other Details</h3>

        <input
          type="text"
          name="resume"
          placeholder="Resume URL"
          value={profile.resume}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn URL"
          value={profile.linkedin}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="portfolio"
          placeholder="Portfolio URL"
          value={profile.portfolio}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">Save Profile</button>
        <button>Next</button>
      </form>
    </div>
  );
}

export default Profile;
