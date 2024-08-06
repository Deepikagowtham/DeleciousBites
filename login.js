console.clear();
const username = document.getElementById("username")
const emailId = document.getElementById("emailId");
const password = document.getElementById("password");
const cpassword = document.getElementById("cpassword");
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');

form.addEventListener('submit', e => {
	e.preventDefault(); // Prevents form submission before validation
	checkInput();
});

function checkInput() {

	resetValidation();

	const username = username.value.trim();
	const emailIdValue = emailId.value.trim();
	const passwordValue = password.value.trim();
	const cpasswordValue = cpassword.value.trim();

	let isValid = true;

	if (username === '') {
		setError(username, 'Please enter your name');
		isValid = false;
	} else {
		setSuccess(username);
	}

	if (emailIdValue === '') {
		setError(emailId, 'Please enter your email');
		isValid = false;
	} else if (!isEmail(emailIdValue)) {
		setError(emailId, 'Entered email is not valid, please enter a valid email');
		isValid = false;
	} else {
		setSuccess(emailId);
	}

	if (passwordValue === '') {
		setError(password, 'Please enter your password');
		isValid = false;
	} else if(passwordValue.length < 8 ){
		setError(password, 'Password must be at least 8 characters long');
		isValid = false;
	} else {
		setSuccess(password);
	}

	if (cpasswordValue === '') {
		setError(cpassword, 'Please confirm your password');
		isValid = false;
	} else if (passwordValue !== cpasswordValue) {
		setError(cpassword, 'Passwords do not match');
		isValid = false;
	} else {
		setSuccess(cpassword);
	}

	if (isValid) {
		setSuccessColor();
	}
}

function resetValidation() {

	const formControls = document.querySelectorAll('.form-control');
	formControls.forEach(control => {
	control.classList.remove('error', 'success');
	const small = control.querySelector('small');
	small.innerText = '';
});
}

function setError(input, msg) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = msg;
}

function setSuccess(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}

function setSuccessColor() {
	const inputs = document.querySelectorAll('.form-control input');
	inputs.forEach(input => {
		input.classList.remove('error');
		input.classList.add('success');
	});
}

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

loginBtn.addEventListener('click', (e) => {
	let parent = e.target.parentNode.parentNode;
	Array.from(e.target.parentNode.parentNode.classList).find((element) => {
		if(element !== "slide-up") {
			parent.classList.add('slide-up')
		}else{
			signupBtn.parentNode.classList.add('slide-up')
			parent.classList.remove('slide-up')
		}
	});
});

document.getElementById('signupLink').addEventListener('click', function(e) {
	e.preventDefault();
	document.getElementById('signupPage').style.display = 'block';
	document.getElementById('loginPage').style.display = 'none';
});

document.getElementById('loginLink').addEventListener('click', function(e) {
	e.preventDefault();
	document.getElementById('loginPage').style.display = 'block';
	document.getElementById('signupPage').style.display = 'none';
});

signupBtn.addEventListener('click', (e) => {
	let parent = e.target.parentNode;
	Array.from(e.target.parentNode.classList).find((element) => {
		if(element !== "slide-up") {
			parent.classList.add('slide-up')
		}else{
			loginBtn.parentNode.parentNode.classList.add('slide-up')
			parent.classList.remove('slide-up')
		}
	});
});