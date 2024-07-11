// Utility functions for localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Function to display error messages
function showError(element, message) {
    element.innerText = message;
    element.style.color = 'red';
}

// Function to clear error messages
function clearError(element) {
    element.innerText = '';
}

// Load saved data from localStorage
function loadData() {
    dormRoom = loadFromLocalStorage('dormRoom');
    apartment = loadFromLocalStorage('apartment');
    student = loadFromLocalStorage('student');
}

// Save data to localStorage
function saveData() {
    saveToLocalStorage('dormRoom', dormRoom);
    saveToLocalStorage('apartment', apartment);
    saveToLocalStorage('student', student);
}

// Classes
class Residence {
    constructor(name, address) {
        this.name = name;
        this.address = address;
        this.occupied = false;
    }
}

class DormRoom extends Residence {
    constructor(name, address, size) {
        super(name, address);
        this.size = size;
    }

    calculateRent() {
        return this.size * 2;
    }
}

class Apartment extends Residence {
    constructor(name, address, bedrooms) {
        super(name, address);
        this.bedrooms = bedrooms;
    }

    calculateRent() {
        return this.bedrooms * 500;
    }
}

class Student {
    constructor(name, studentID, gender, residence) {
        this.name = name;
        this.studentID = studentID;
        this.gender = gender;
        this.residence = residence;
        residence.occupied = true;
    }

    submitMaintenanceRequest(description) {
        return new MaintenanceRequest(description, this);
    }
}

class MaintenanceRequest {
    constructor(description, student) {
        this.description = description;
        this.status = 'submitted';
        this.student = student;
    }
}

// Variables to store created objects
let dormRoom;
let apartment;
let student;

loadData();

function createDormRoom() {
    const name = document.getElementById('dormName').value.trim();
    const address = document.getElementById('dormAddress').value.trim();
    const size = parseInt(document.getElementById('dormSize').value);

    const errorElement = document.getElementById('dormRoomOutput');
    clearError(errorElement);

    if (!name || !address || isNaN(size) || size <= 0) {
        showError(errorElement, 'Please provide valid inputs for all fields.');
        return;
    }

    dormRoom = new DormRoom(name, address, size);
    errorElement.innerText = `Created Dorm Room: ${name}, Address: ${address}, Size: ${size} sq ft, Rent: $${dormRoom.calculateRent()}`;
    saveData();
}

function createApartment() {
    const name = document.getElementById('apartmentName').value.trim();
    const address = document.getElementById('apartmentAddress').value.trim();
    const bedrooms = parseInt(document.getElementById('apartmentBedrooms').value);

    const errorElement = document.getElementById('apartmentOutput');
    clearError(errorElement);

    if (!name || !address || isNaN(bedrooms) || bedrooms <= 0) {
        showError(errorElement, 'Please provide valid inputs for all fields.');
        return;
    }

    apartment = new Apartment(name, address, bedrooms);
    errorElement.innerText = `Created Apartment: ${name}, Address: ${address}, Bedrooms: ${bedrooms}, Rent: $${apartment.calculateRent()}`;
    saveData();
}

function createStudent() {
    const name = document.getElementById('studentName').value.trim();
    const studentID = document.getElementById('studentID').value.trim();
    const gender = document.getElementById('studentGender').value.trim();
    const residenceName = document.getElementById('studentResidence').value.trim();

    const errorElement = document.getElementById('studentOutput');
    clearError(errorElement);

    if (!name || !studentID || !gender || !residenceName || (!dormRoom && !apartment) || (dormRoom && dormRoom.name !== residenceName && apartment && apartment.name !== residenceName)) {
        showError(errorElement, 'Please provide valid inputs for all fields and ensure the residence exists.');
        return;
    }

    const residence = (dormRoom && dormRoom.name === residenceName) ? dormRoom : (apartment && apartment.name === residenceName) ? apartment : null;

    if (!residence) {
        showError(errorElement, 'Residence not found.');
        return;
    }

    student = new Student(name, studentID, gender, residence);
    errorElement.innerText = `Created Student: ${name}, ID: ${studentID}, Gender: ${gender}, Residence: ${residenceName}`;
    saveData();
}

function submitMaintenanceRequest() {
    const description = document.getElementById('requestDescription').value.trim();
    const studentName = document.getElementById('requestStudentName').value.trim();

    const errorElement = document.getElementById('requestOutput');
    clearError(errorElement);

    if (!description || !studentName || !student || student.name !== studentName) {
        showError(errorElement, 'Please provide valid inputs for all fields and ensure the student exists.');
        return;
    }

    const request = student.submitMaintenanceRequest(description);
    errorElement.innerText = `Maintenance request submitted by ${studentName}: ${description}`;
    saveToLocalStorage('request', request);
}

function search() {
    const query = document.getElementById('searchBar').value.trim().toLowerCase();
    const errorElement = document.getElementById('searchOutput');
    clearError(errorElement);

    if (!query) {
        showError(errorElement, 'Please enter a search query.');
        return;
    }

    let result = '';
    if (dormRoom && (dormRoom.name.toLowerCase().includes(query) || dormRoom.address.toLowerCase().includes(query))) {
        result += `Found Dorm Room: ${dormRoom.name}, Address: ${dormRoom.address}, Size: ${dormRoom.size} sq ft, Rent: $${dormRoom.calculateRent()}\n`;
    }
    if (apartment && (apartment.name.toLowerCase().includes(query) || apartment.address.toLowerCase().includes(query))) {
        result += `Found Apartment: ${apartment.name}, Address: ${apartment.address}, Bedrooms: ${apartment.bedrooms}, Rent: $${apartment.calculateRent()}\n`;
    }
    if (student && (student.name.toLowerCase().includes(query) || student.studentID.toLowerCase().includes(query) || student.gender.toLowerCase().includes(query))) {
        result += `Found Student: ${student.name}, ID: ${student.studentID}, Gender: ${student.gender}, Residence: ${student.residence.name}\n`;
    }

    if (!result) {
        showError(errorElement, 'No results found.');
    } else {
        errorElement.innerText = result;
    }
}
