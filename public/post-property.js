// Script for managing property post submission

let currentStep = 0;
const formSteps = document.querySelectorAll('.form-step');
const stepIndicators = document.querySelectorAll('.step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

function changeStep(stepChange) {
    formSteps[currentStep].classList.remove('active');
    stepIndicators[currentStep].classList.remove('active');

    currentStep += stepChange;

    if (currentStep < 0) currentStep = 0;
    if (currentStep >= formSteps.length) currentStep = formSteps.length - 1;

    formSteps[currentStep].classList.add('active');
    stepIndicators[currentStep].classList.add('active');

    if (currentStep == formSteps.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }

    if (currentStep == 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    if (currentStep == formSteps.length) {
        displaySuccessMessage();
    }
}

function displaySuccessMessage() {
    successMessage.style.display = 'block';
    document.getElementById('propertyListingForm').style.display = 'none';
}

// Prevent form submission for demo purpose
const propertyListingForm = document.getElementById('propertyListingForm');
propertyListingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    changeStep(1);
});
