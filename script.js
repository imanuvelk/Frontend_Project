// Quiz questions data
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        explanation: "Paris is the capital and most populous city of France."
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        explanation: "Mars is often called the 'Red Planet' because iron minerals in the Martian soil oxidize, or rust, causing the soil and atmosphere to look red."
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correct: 1,
        explanation: "The blue whale is the largest mammal in the world, and the largest animal to have ever existed."
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        correct: 1,
        explanation: "Oxygen has the chemical symbol 'O' and atomic number 8."
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2,
        explanation: "The Mona Lisa was painted by Leonardo da Vinci between 1503 and 1506."
    },
    {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "Maldives", "Vatican City", "San Marino"],
        correct: 2,
        explanation: "Vatican City is the smallest country in the world, with an area of just 0.17 square miles."
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correct: 2,
        explanation: "JavaScript is often called the 'language of the web' because it's the primary language for front-end web development."
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correct: 2,
        explanation: "Diamond is the hardest known natural material on Earth."
    },
    {
        question: "Which organ in the human body is responsible for pumping blood?",
        options: ["Liver", "Heart", "Lungs", "Kidneys"],
        correct: 1,
        explanation: "The heart is responsible for pumping blood throughout the body."
    },
    {
        question: "What year did the World Wide Web become publicly available?",
        options: ["1985", "1991", "1995", "2000"],
        correct: 1,
        explanation: "The World Wide Web became publicly available in 1991."
    }
];

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const reviewBtn = document.getElementById('review-btn');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const progress = document.getElementById('progress');
const timer = document.getElementById('timer');
const scoreValue = document.getElementById('score-value');
const totalQuestions = document.getElementById('total-questions');
const correctAnswers = document.getElementById('correct-answers');
const timeTaken = document.getElementById('time-taken');
const feedback = document.getElementById('feedback');
const questionIndicators = document.getElementById('question-indicators');
const reviewSection = document.getElementById('review-section');
const reviewAnswers = document.getElementById('review-answers');

// Quiz state variables
let currentQuestion = 0;
let userAnswers = Array(quizData.length).fill(null);
let score = 0;
let quizTime = 600; // 10 minutes in seconds
let timerInterval;
let startTime;
let showReview = false;

// Initialize the quiz
function initQuiz() {
    currentQuestion = 0;
    userAnswers = Array(quizData.length).fill(null);
    score = 0;
    quizTime = 600;
    showReview = false;
    
    // Reset timer display
    updateTimerDisplay();
    
    // Create question indicators
    createQuestionIndicators();
    
    // Show welcome screen
    showScreen(welcomeScreen);
    
    // Hide review section
    reviewSection.style.display = 'none';
}

// Create question indicators
function createQuestionIndicators() {
    questionIndicators.innerHTML = '';
    
    quizData.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('current');
        indicator.textContent = index + 1;
        indicator.addEventListener('click', () => {
            if (userAnswers[index] !== null || index === currentQuestion) {
                currentQuestion = index;
                loadQuestion();
            }
        });
        questionIndicators.appendChild(indicator);
    });
}

// Update question indicators
function updateQuestionIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('current', 'answered', 'correct', 'incorrect');
        
        if (index === currentQuestion) {
            indicator.classList.add('current');
        }
        
        if (userAnswers[index] !== null) {
            indicator.classList.add('answered');
            
            // After quiz is submitted, show correct/incorrect
            if (showReview) {
                if (userAnswers[index] === quizData[index].correct) {
                    indicator.classList.add('correct');
                } else {
                    indicator.classList.add('incorrect');
                }
            }
        }
    });
}

// Show a specific screen
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// Start the quiz
function startQuiz() {
    showScreen(quizScreen);
    startTime = new Date();
    loadQuestion();
    startTimer();
}

// Load the current question
function loadQuestion() {
    const question = quizData[currentQuestion];
    
    // Update question number and text
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    questionText.textContent = question.question;
    
    // Update progress bar
    progress.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
    
    // Update question indicators
    updateQuestionIndicators();
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create option elements
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        if (userAnswers[currentQuestion] === index) {
            optionElement.classList.add('selected');
        }
        
        // If we're reviewing, show correct/incorrect answers
        if (showReview) {
            if (index === quizData[currentQuestion].correct) {
                optionElement.classList.add('correct');
            } else if (userAnswers[currentQuestion] === index && index !== quizData[currentQuestion].correct) {
                optionElement.classList.add('incorrect');
            }
        }
        
        const optionLabel = document.createElement('div');
        optionLabel.className = 'option-label';
        optionLabel.textContent = String.fromCharCode(65 + index); // A, B, C, D
        
        const optionText = document.createElement('div');
        optionText.className = 'option-text';
        optionText.textContent = option;
        
        optionElement.appendChild(optionLabel);
        optionElement.appendChild(optionText);
        
        // Only allow selection if not in review mode
        if (!showReview) {
            optionElement.addEventListener('click', () => selectOption(index));
        }
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update navigation buttons
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.style.display = currentQuestion === quizData.length - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = currentQuestion === quizData.length - 1 && !showReview ? 'inline-block' : 'none';
    
    // In review mode, show explanation if available
    if (showReview && question.explanation) {
        const explanationElement = document.createElement('div');
        explanationElement.className = 'feedback good';
        explanationElement.style.marginTop = '20px';
        explanationElement.textContent = question.explanation;
        optionsContainer.appendChild(explanationElement);
    }
}

// Select an option
function selectOption(optionIndex) {
    userAnswers[currentQuestion] = optionIndex;
    updateQuestionIndicators();
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    }, 500);
}

// Navigate to previous question
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

// Start the timer
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        quizTime--;
        updateTimerDisplay();
        
        if (quizTime <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(quizTime / 60);
    const seconds = quizTime % 60;
    timer.querySelector('span').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Change color when time is running out
    if (quizTime <= 60) {
        timer.style.background = 'rgba(247, 37, 133, 0.3)';
    }
}

// Submit the quiz
function submitQuiz() {
    clearInterval(timerInterval);
    
    // Calculate score
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            score++;
        }
    });
    
    // Calculate time taken
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // in seconds
    const minutesTaken = Math.floor(timeDiff / 60);
    const secondsTaken = Math.floor(timeDiff % 60);
    
    // Display results
    showResults(score, minutesTaken, secondsTaken);
    createConfetti();
}

// Show results screen
function showResults(score, minutes, seconds) {
    const percentage = Math.round((score / quizData.length) * 100);
    
    scoreValue.textContent = `${percentage}%`;
    totalQuestions.textContent = quizData.length;
    correctAnswers.textContent = score;
    timeTaken.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Set feedback based on score
    if (percentage >= 90) {
        feedback.textContent = "Excellent! You have a great knowledge base!";
        feedback.className = "feedback excellent";
    } else if (percentage >= 70) {
        feedback.textContent = "Good job! You have a solid understanding of the topics.";
        feedback.className = "feedback good";
    } else if (percentage >= 50) {
        feedback.textContent = "Not bad! Keep learning to improve your knowledge.";
        feedback.className = "feedback average";
    } else {
        feedback.textContent = "Keep studying! You'll do better next time.";
        feedback.className = "feedback poor";
    }
    
    showScreen(resultsScreen);
}

// Toggle review mode
function toggleReview() {
    showReview = !showReview;
    
    if (showReview) {
        reviewSection.style.display = 'block';
        reviewBtn.innerHTML = '<i class="fas fa-times"></i> Hide Review';
        loadReviewAnswers();
        showScreen(resultsScreen);
    } else {
        reviewSection.style.display = 'none';
        reviewBtn.innerHTML = '<i class="fas fa-list"></i> Review Answers';
    }
    
    // Update question indicators to show correct/incorrect
    updateQuestionIndicators();
}

// Load review answers
function loadReviewAnswers() {
    reviewAnswers.innerHTML = '';
    
    quizData.forEach((question, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const questionElement = document.createElement('div');
        questionElement.className = 'review-question';
        questionElement.textContent = `${index + 1}. ${question.question}`;
        
        const answerElement = document.createElement('div');
        answerElement.className = 'review-answer';
        
        const userAnswerIndex = userAnswers[index];
        const correctAnswerIndex = question.correct;
        
        if (userAnswerIndex !== null) {
            answerElement.innerHTML = `
                <span>Your answer:</span>
                <span class="${userAnswerIndex === correctAnswerIndex ? 'correct-answer' : 'user-answer'}">
                    ${String.fromCharCode(65 + userAnswerIndex)}. ${question.options[userAnswerIndex]}
                </span>
            `;
            
            if (userAnswerIndex !== correctAnswerIndex) {
                answerElement.innerHTML += `
                    <span>Correct answer:</span>
                    <span class="correct-answer">
                        ${String.fromCharCode(65 + correctAnswerIndex)}. ${question.options[correctAnswerIndex]}
                    </span>
                `;
            }
        } else {
            answerElement.innerHTML = `
                <span>Your answer:</span>
                <span class="user-answer">Not answered</span>
                <span>Correct answer:</span>
                <span class="correct-answer">
                    ${String.fromCharCode(65 + correctAnswerIndex)}. ${question.options[correctAnswerIndex]}
                </span>
            `;
        }
        
        if (question.explanation) {
            const explanationElement = document.createElement('div');
            explanationElement.className = 'feedback good';
            explanationElement.style.marginTop = '10px';
            explanationElement.textContent = question.explanation;
            reviewItem.appendChild(explanationElement);
        }
        
        reviewItem.appendChild(questionElement);
        reviewItem.appendChild(answerElement);
        reviewAnswers.appendChild(reviewItem);
    });
}

// Create confetti effect
function createConfetti() {
    const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#4bb543'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 3000,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
            delay: Math.random() * 1000
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Event listeners
startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', submitQuiz);
restartBtn.addEventListener('click', initQuiz);
reviewBtn.addEventListener('click', toggleReview);

// Initialize the quiz when the page loads
window.addEventListener('load', initQuiz);