// DOM
// Phần này là phần khai báo các biến lấy các ID, className của các element trong DOM tree, sau đó
// dùng các methods của DOM như getElementbyID() hoặc querySelector() để thực hiện các hành động
// thay đổi thuộc tính của element đó

// Ví dụ 1 cho DOM : startBtn - khai báo biến startBtn bằng cách chọc vào DOM và lấy ID của button
const startBtn = document.getElementById('start-btn');

// Ví dụ 2 cho DOM : questionNumber - khai báo biến questionNumber bằng cách chọc vào DOM là lấy ID
// của element <h2> nhằm thay đổi số thứ tự của câu hỏi
const questionNumber = document.querySelector('#question-number');

const mainMenu = document.querySelector('.main-menu');
const timer = document.querySelector('#timer');
var timeTicking = document.querySelector('#ticking');

const container = document.querySelector('.container');
const questionText = document.querySelector('#question-content');
const optionContainer = document.getElementById('option-container');
const statusContainer = document.querySelector('.status');
const next = document.getElementById('next-btn');

const results = document.querySelector('.results');
const attempts = document.getElementById('attempt-answers');
const rightAnswers = document.getElementById('right-answers');
const wrongAnswers = document.getElementById('wrong-answers');
const finalScore = document.getElementById('final-score');
const tryAgainBtn = document.getElementById('try-again');

let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let sec = 5;
let score = 0;
let attempt = 0;

// Arrays of questions
const quizzes = [
	{
		q: 'Which month comes right before the month that has Mid Autumn Festival in 2020?',
		o: ['January', 'May', 'August', 'September'],
		a: 3,
	},
	{
		q: 'What kind of animal that has wings?',
		o: ['Dog', 'Magpie', 'Deer', 'Lion'],
		a: 1,
	},
	{
		q: '100/(15+5) = 5?',
		o: ['True', 'False'],
		a: 0,
	},
	{
		q: 'A shepherd has 86 goats, all but 6 die. How many are left?',
		o: ['86', '80', '6', '1'],
		a: 2,
	},
	{
		q: 'I start with T, end with T and have T in me. What am I?',
		o: ['Teapot', 'Teeth', 'Tattooist', 'Transparent'],
		a: 0,
	},
];

// Functions :
// Phần này là khai báo các function để thực hiện các hành động mang tính logic có liên quan tới DOM
// nhằm hiển thị các giá trị mình cần

// Ví dụ 1 cho function (anh Hiếu copy paste cả 2 phần functions này, đừng xóa cái gì cả) : đẩy các
// questions vào availableQuestions array
function setQuestion() {
	for (let i = 0; i < quizzes.length; i++) {
		availableQuestions.push(quizzes[i]);
	}
}

// Ví dụ 2 cho function : set số thứ tự của question, thời gian kèm theo question và option, sau đó đẩy ra DOM
function getContentsToDOM() {
	// Set số thứ tự của question
	questionNumber.innerHTML = `Question ${questionCounter + 1} of 5`;

	// Đếm ngược thời gian
	startTimer(5, timeTicking);

	// Lấy question ngẫu nhiên
	const questIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
	currentQuestion = questIndex;
	questionText.innerHTML = currentQuestion.q;

	// Lấy vị trí của 'questionIndex' từ availableQuestions array
	const index_1 = availableQuestions.indexOf(questIndex);

	// Bỏ 'questionIndex' từ availableQuestions array, để cho các question ko bị lặp lại
	availableQuestions.splice(index_1, 1);

	// Set options trong 1 array
	const optLen = currentQuestion.o.length;
	for (let i = 0; i < optLen; i++) {
		availableOptions.push(i);
	}

	let delay = 0.2;
	// Clear optionContainer mỗi khi click button 'Next'
	optionContainer.innerHTML = '';

	// Tạo các options trong DOM
	for (let i = 0; i < optLen; i++) {
		// Tạo random option
		const optionIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];

		// Lấy vị trí của 'optionIndex' trong availableOptions
		const index_2 = availableOptions.indexOf(optionIndex);

		// Bỏ 'optionIndex' từ availableOptions array để cho các option ko bị lặp lại
		availableOptions.splice(index_2, 1);

		// Thêm option vào DOM
		const option = document.createElement('div');
		option.innerHTML = currentQuestion.o[optionIndex];
		option.id = optionIndex;
		option.style.animationDelay = delay + 's';
		delay += 0.2;
		option.className = 'option';
		optionContainer.appendChild(option);
		option.setAttribute('onclick', 'getResult(this)');
	}

	questionCounter++;
}

// Lấy kết quả của currentQuestion
function getResult(element) {
	const id = +element.id;

	// lấy kết quả bằng so sánh id của element được click
	if (id === currentQuestion.a) {
		// Kết quả đúng thì add class "right" vào element
		element.classList.add('right');

		// Khóa các option khác khi đã chọn
		disableOptions();

		// Update status
		updateStatus('right');
		score++;
	} else {
		// Kết quả sai thì add class "wrong" vào element
		element.classList.add('wrong');

		// Update status
		updateStatus('wrong');

		// Show đáp án đúng
		const optLen = optionContainer.children.length;
		for (let i = 0; i < optLen; i++) {
			if (parseInt(optionContainer.children[i].id) === currentQuestion.a) {
				optionContainer.children[i].classList.add('right');
			}
		}
	}
	attempt++;
	disableOptions();
}

// Khóa các option khác để tránh cho việc chọn 2 đáp án trở lên
function disableOptions() {
	const optLen = optionContainer.children.length;
	for (let i = 0; i < optLen; i++) {
		optionContainer.children[i].classList.add('disabled');
	}
}

// Lưu các kết quả và hiển thị qua DOM
function showAnswerStatusToDOM() {
	const totalQuestion = quizzes.length;
	for (let i = 0; i < totalQuestion; i++) {
		const status = document.createElement('div');
		statusContainer.appendChild(status);
	}
}

// Update status dựa theo kết quả
function updateStatus(result) {
	statusContainer.children[questionCounter - 1].classList.add(result);
}

// Đếm ngược thời gian từ 5 - 0s
function startTimer(duration, display) {
	var timeVar = duration,
		seconds;
	var x = setInterval(function () {
		seconds = parseInt(timeVar % 60, 10);

		display.textContent = seconds;

		if (--timeVar < 0) {
			clearInterval(x);
		}
	}, 1000);
}

// Game over, hiện ra bảng result và thử lại(nếu muốn)
function gameOver() {
	// Show bảng Result
	rightAnswers.innerText = `${score}`;
	wrongAnswers.innerText = (5 - score).toString();
	finalScore.innerText = `${score}`;
	attempts.innerText = `${attempt}`;
}

// Event :
// Phần này là dành cho các event sau khi có các hoạt động khác đã xảy ra như click chuột vào
// 1 button hoặc load trang web đó.

window.onload = function () {
	// Trước hết, set tất cả questions trong availableQuestions array
	setQuestion();

	// Sau đó, gọi getQuestions()
	getContentsToDOM();

	// Show tính trạng hiện tại của các câu trả lời
	showAnswerStatusToDOM();
};

// Listener :
// Phần này là dành cho các button khi đc click thì sẽ nghe theo event click đó
startBtn.addEventListener('click', function () {
	container.classList.remove('hide');
	mainMenu.classList.add('hide');
});

next.addEventListener('click', function () {
	if (questionCounter == quizzes.length) {
		gameOver();
		container.classList.add('hide');
		results.classList.remove('hide');
	} else {
		getContentsToDOM();
	}
});

tryAgainBtn.addEventListener('click', function () {
	results.classList.add('hide');
	mainMenu.classList.remove('hide');
});
