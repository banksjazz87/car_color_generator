 //Object to store user input 
 let UserInput = {
     year: null,
     make: null,
     model: null,
     plate: null,
     state: null
 }

 const carsXeKey = "4jrklhq7m_gf7qnq5f5_oty30rgzz";
 const carsXeUrl = "http://api.carsxe.com/";

 /* http://api.carsxe.com/specs?key=4jrklhq7m_gf7qnq5f5_oty30rgzz&year=2017&make=nissan&model=altima
  
   http://api.carsxe.com/specs?key=4jrklhq7m_gf7qnq5f5_oty30rgzz&id=2016_nissan_altima_25*/


 //license plate call
 // http://api.carsxe.com/platedecoder?key=4jrklhq7m_gf7qnq5f5_oty30rgzz&plate=36619HT&state=MD&format=json
 //constant dom elements

 //Elements used to submit the year, make and model
 const year = document.getElementById('year');
 const make = document.getElementById('make');
 const model = document.getElementById('model');
 const submit = document.getElementById('submit');

 //Elements used to submit the license plate
 const plate = document.getElementById('plate');
 const state = document.getElementById('state');
 const plateSubmit = document.getElementById('plate_submit');


 //Store car models and model information received from the first api call
 let modelDetails = "";

 //Array to save user input
 let store = [];

 //Function to get all of the dates back to 1970
 const yearOptions = () => {
     const date = new Date;
     const currentYear = date.getFullYear();
     const yearInput = document.getElementById('year');

     for (let i = currentYear + 1; i >= 1970; i--) {
         let option = document.createElement('option');
         option.textContent = i;

         yearInput.appendChild(option);
     }
 }

 yearOptions();


 const cars = ["Toyota", "Honda", "Chevrolet", "Ford", "Mercedes-Benz", "Jeep", "BMW", "Porsche", "Subaru", "Nissan", "Cadillac", "Volkswagen", "Lexus", "Audi", "Ferrari", "Volvo", "Jaguar", "Lincoln", "Mazda", "Land Rover", "Tesla", "Ram Trucks", "Kia", "GMC", "Buick", "Acura", "Bentley", "Dodge", "Hyundai", "Chrysler", "Pontiac", "Infiniti", "Mitsubishi", "Oldsmobile", "Maserati", "Aston Martin", "Bugatti", "Fiat", "Mini", "Alfa Romeo", "Saab", "Genesis", "Suzuki", "Studebaker", "Renault", "Peugeot", "Daewoo", "Hudson", "Citroen", "MG"];

 const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

 //Function to create the car options.
 const makeOptions = () => {
     const sortedCars = cars.sort();

     for (let i = 0; i < sortedCars.length; i++) {

         const parent = document.getElementById("make");
         const option = document.createElement("option");
         option.textContent = sortedCars[i];

         parent.appendChild(option);
     }
 }

 makeOptions();

 //Function to make the State options, when submitting a license plate number.
 const makeStateOptions = () => {
     const parent = document.getElementById('state');

     for (let i = 0; i < states.length; i++) {
         let stateOption = document.createElement('option');
         stateOption.textContent = states[i];

         parent.appendChild(stateOption);
     }
 }

 makeStateOptions();

 //fetch function for the models
 const carUrl = "https://vpic.nhtsa.dot.gov/api";

 const carCall = async(year, make) => {

     let response = await fetch(carUrl + "/vehicles/GetModelsForMakeYear/make/" + make + "/modelyear/" + year + "?format=json");

     try {
         let valid = await response.json();
         modelDetails = Object.values(valid)[3];
         console.log("right here", valid);
         return modelDetails;
     } catch (e) {
         console.log("error", e);
     }
 }

 //add models
 const newModels = () => {
         let selectModel = document.getElementById('model');

         //Appending the different car model names, to the model option
         if (modelDetails.length === 0) {
             alert("Please make sure your year and make are correct");
         } else {

             for (let i = 0; i < modelDetails.length; i++) {
                 let option = document.createElement('option');
                 option.textContent = modelDetails[i].Model_Name;

                 selectModel.appendChild(option);
             }
         }
     }
     // http://api.carsxe.com/platedecoder?key=4jrklhq7m_gf7qnq5f5_oty30rgzz&plate=36619HT&state=MD&format=json

 //Fetch Function for the data related to the plate number
 const plateInfo = async(plateData, location, key) => {
     const response = await fetch(carsXeUrl + "platedecoder?key=" + key + "&plate=" + plateData + "&state=" + location + "&format=json", {
         method: 'GET',
         mode: 'cors',
         cache: 'no-cache',
         credentials: 'same-origin',
         headers: {
             'Content-Type': 'application/json'
         },
         redirect: 'follow',
         referrerPolicy: 'no-referrer',
         body: JSON.stringify()
     });

     try {
         let updatedResponse = await response.json();
         console.log(updatedResponse);
         return updatedResponse;
     } catch (e) {
         console.log('error in plateInf functon', e)
         return e;
     }
 }

 //Event listener for the year
 //const year = document.getElementById('year');

 year.addEventListener('change', (e) => {
     UserInput["year"] = e.target.value;
     removePastModOpt();
     console.log(UserInput);
 })

 //event listener for the make
 //const make = document.getElementById('make');

 make.addEventListener('change', (e) => {
     UserInput['make'] = e.target.value;
     missingInfo(UserInput.year, "year");
     //updateDom();
 })

 //event listener for the onchange model
 model.addEventListener('change', (e) => {
     UserInput['model'] = e.target.value;
     console.log(UserInput);
 })

 //event listener for the click on the submit button
 submit.addEventListener('click', (e) => {
     e.preventDefault();
     console.log(UserInput);
 })

 //series of promises: api call for the models, remove past models, add new models
 const updateDom = () => {
     carCall(UserInput.year, UserInput.make)
         .then(() => removePastModOpt())
         .then(() => newModels())
 }

 //Remove all prior model options
 const removePastModOpt = () => {
     let modSelect = document.getElementById("model");
     if (modSelect.children.length > 1) {

         modSelect.innerHTML = "";

         //create first option
         let firstOption = document.createElement('option');
         firstOption.textContent = "Model";
         modSelect.appendChild(firstOption);

     } else {
         console.log("children = 1")
     }
 }

 //Missing information message
 const missingInfo = (data, missing) => {
     if (data === null) {
         alert("Please select a " + missing + ".");
     }
 }

 //Handling when the user clicks on the model selection
 model.addEventListener('click', () => {
     updateDom();
 });

 //This function will update the license plate state on change
 state.addEventListener('change', (e) => {
     UserInput.state = e.target.value;
     console.log("plate state has been chosen", UserInput);
 });

 //This function will update the plate value in the UserInput object on keyup
 plate.addEventListener('keyup', (e) => {
     UserInput.plate = e.target.value;
     console.log("the plate data has been updated", UserInput);
 });

 //This function will make an api call to get information pertaining to the plate data that was submitted
 plateSubmit.addEventListener('click', (e) => {
     e.preventDefault();
     plateInfo(UserInput.plate, UserInput.state, carsXeKey);
 })