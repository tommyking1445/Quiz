let currentQuestion = 0;
let score = 0;
let isQuizInProgress = true; // クイズが進行中かどうかの状態を管理

let quizData = [];

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  document.body.classList.add('animate'); // アニメーションを追加
  loadQuizData();
}

function loadQuizData() {
  fetch('quiz01.json')
    .then(response => response.json())
    .then(data => {
      quizData = data;
      selectRandomQuestions();
      showQuestion();
    })
    .catch(error => console.error('Error fetching quiz data:', error));
}

function selectRandomQuestions() {
  // クイズデータからランダムに3つ選ぶ
  const selectedIndexes = [];
  while (selectedIndexes.length < 3) {
    const randomIndex = Math.floor(Math.random() * quizData.length);
    if (!selectedIndexes.includes(randomIndex)) {
      selectedIndexes.push(randomIndex);
    }
  }
  quizData = selectedIndexes.map(index => quizData[index]);
}

function showQuestion() {
  const questionContainer = document.getElementById('question');
  const optionsContainer = document.getElementById('options');
  const resultContainer = document.getElementById('result');
  const nextButton = document.getElementById('next-button');
  const restartButton = document.getElementById('restart-button');

  if (currentQuestion < quizData.length) {
    questionContainer.textContent = quizData[currentQuestion].question;
    optionsContainer.innerHTML = '';

    quizData[currentQuestion].options.forEach((option, index) => {
      const button = document.createElement('button');
      button.classList.add('option');
      button.textContent = option;
      
      // クイズが進行中の場合にのみクリックイベントを追加
      if (isQuizInProgress) {
        button.onclick = () => {
          if (isQuizInProgress) {
            checkAnswer(index);
            isQuizInProgress = false; // クイズが終了したら選択肢を無効にする
          }
        };
      }
      optionsContainer.appendChild(button);
    });
    resultContainer.textContent = '';
    nextButton.style.display = 'none';
    restartButton.style.display = 'none';
  } else {
    questionContainer.textContent = 'クイズおわり！';
    optionsContainer.innerHTML = '';
    resultContainer.classList.remove('correct');
    resultContainer.classList.remove('incorrect');
    resultContainer.textContent = `せいかいすう: ${score} / ${quizData.length}`;
    nextButton.style.display = 'none';
    restartButton.style.display = 'block';
  }
}

function checkAnswer(optionIndex) {
  const resultContainer = document.getElementById('result');
  const nextButton = document.getElementById('next-button');
  const restartButton = document.getElementById('restart-button');

  // クイズが終了したら選択肢を無効にする
  isQuizInProgress = false;

  if (quizData[currentQuestion].correctAnswer === quizData[currentQuestion].options[optionIndex]) {
    resultContainer.textContent = '◯せいかい！';
    resultContainer.classList.remove('incorrect');
    resultContainer.classList.add('correct');
    score++;
  } else {
    resultContainer.textContent = '✕ふせいかい！（せいかいは『' + quizData[currentQuestion].correctAnswer + '』です）';
    resultContainer.classList.remove('correct');
    resultContainer.classList.add('incorrect');
  }

  nextButton.style.display = 'block';
  restartButton.style.display = 'none';
}

function nextQuestion() {
  currentQuestion++;
  isQuizInProgress = true; // 次の問題に進むときに再び選択肢を有効にする
  showQuestion();
}

startQuiz();
