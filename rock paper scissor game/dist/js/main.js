import GameObj from "./Game.js";
const Game = new GameObj();

const initApp = () => {
  initAllTimeData();
  updateScoreBoard();
  listenForPlayerChoice();
  listenForEnterKey();
  listenForPlayAgain();
  lockComputerGameBoardHeight();
  document.querySelector("h1").focus();
};

document.addEventListener("DOMContentLoaded", initApp);

const initAllTimeData = () => {
  Game.setP1AllTime(parseInt(localStorage.getItem("p1AllTime")) || 0);
  Game.setCpAllTime(parseInt(localStorage.getItem("cpAllTime")) || 0);
};

const updateScoreBoard = () => {
  const p1Ats = document.getElementById("p1_all_time_score");
  let p1Score = Game.getP1AllTime();
  p1Ats.textContent = p1Score;
  p1Ats.ariaLabel = `Player One has ${p1Score} all time wins.`;

  const cpAts = document.getElementById("cp_all_time_score");
  let cpScore = Game.getCpAllTime();
  cpAts.textContent = cpScore;
  cpAts.ariaLabel = `Computer Player has ${cpScore} all time wins.`;

  const p1S = document.getElementById("p1_session_score");
  let p1ss = Game.getP1Session();
  p1S.textContent = p1ss;
  p1S.ariaLabel = `Player One has ${p1ss} wins this Session.`;

  const cpS = document.getElementById("cp_session_score");
  let cpss = Game.getCpSession();
  cpS.textContent = cpss;
  cpS.ariaLabel = `Computer Player has ${cpss} wins this Session.`;
};

const listenForPlayerChoice = () => {
  const p1Img = document.querySelectorAll(
    ".playerboard .gameboard__square img"
  );
  p1Img.forEach((img) => {
    img.addEventListener("click", (e) => {
      if (Game.getActiveStatus()) return;
      Game.startGame();
      const playerChoice = e.target.parentElement.id;
      updateP1Message(playerChoice);
      p1Img.forEach((img) => {
        if (img === e.target) {
          img.parentElement.classList.add("selected");
        } else {
          img.parentElement.classList.add("not-selected");
        }
      });
      computerAnimationSequence(playerChoice);
    });
  });
};

const listenForEnterKey = () => {
  window.addEventListener("keydown", (e) => {
    if (e.code === "Enter" && e.target.tagName === "IMG") {
      e.target.click();
    }
  });
};

const listenForPlayAgain = () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    resetBoard();
  });
};

const lockComputerGameBoardHeight = () => {
  const cpGameBoard = document.querySelector(".computerboard .gameboard");
  const cpGBStyles = getComputedStyle(cpGameBoard);
  const height = cpGBStyles.getPropertyValue("height");
  cpGameBoard.style.minHeight = height;
};

const updateP1Message = (choice) => {
  let p1msg = document.getElementById("p1msg").textContent;
  p1msg += `${properCase(choice)}!`;
  document.getElementById("p1msg").textContent = p1msg;
};

const computerAnimationSequence = (playerChoice) => {
  let interval = 1000;
  setTimeout(() => computerChoiceAnimation("cp_rock", 1), interval);
  setTimeout(() => computerChoiceAnimation("cp_paper", 2), (interval += 500));
  setTimeout(
    () => computerChoiceAnimation("cp_scissors", 3),
    (interval += 500)
  );
  setTimeout(() => countdownFade(), (interval += 750));
  setTimeout(() => {
    deleteCountdown();
    finishGameFlow(playerChoice);
  }, (interval += 1000));
  setTimeout(() => playAgain(), (interval += 1000));
};

const computerChoiceAnimation = (elementId, number) => {
  const element = document.getElementById(elementId);
  element.firstElementChild.remove();
  const p = document.createElement("p");
  p.textContent = number;
  element.appendChild(p);
};

const countdownFade = () => {
  const countdown = document.querySelectorAll(
    ".computerboard .gameboard__square p"
  );
  countdown.forEach((el) => {
    el.className = "fadeOut";
  });
};

const deleteCountdown = () => {
  const countdown = document.querySelectorAll(
    ".computerboard .gameboard__square p"
  );
  countdown.forEach((el) => {
    el.remove();
  });
};

const finishGameFlow = (playerChoice) => {
  const computerChoice = computerChooses();
  const winner = determineWinner(playerChoice, computerChoice);
  const actionMessage = buildActionMessage(
    winner,
    playerChoice,
    computerChoice
  );
  displayActionMessage(actionMessage);
  updateAriaResult(actionMessage, winner);
  updateScoreState(winner);
  updatePersistentData(winner);
  updateScoreBoard();
  updateWinnerMessage(winner);
  displayComputerChoice(computerChoice);
};

const computerChooses = () => {
  const randnum = Math.floor(Math.random() * 3);
  const choiceArray = ["rock", "paper", "scissors"];
  return choiceArray[randnum];
};

const determineWinner = (p, c) => {
  if (p === c) return "tie";
  if (
    (p === "rock" && c === "paper") ||
    (p === "paper" && c === "scissors") ||
    (p === "scissors" && c === "rock")
  )
    return "computer";
  return "player";
};

const buildActionMessage = (winner, pChoice, cChoice) => {
  if (winner === "tie") return "Tie Game!";
  if (winner === "computer") {
    const action = getAction(cChoice);
    return `${properCase(cChoice)} ${action} ${properCase(pChoice)}.`;
  } else {
    const action = getAction(pChoice);
    return `${properCase(pChoice)} ${action} ${properCase(cChoice)}.`;
  }
};

const getAction = (choice) => {
  return choice === "rock" ? "smashes" : choice === "paper" ? "wraps" : "cuts";
};

const properCase = (string) => {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
};

const displayActionMessage = (actionMessage) => {
  document.getElementById("cpmsg").textContent = actionMessage;
};

const updateAriaResult = (result, winner) => {
  const ariaResult = document.getElementById("playAgain");
  const winMsg =
    winner === "player"
      ? "Congratulations, you are the winner."
      : winner === "computer"
      ? "The computer is the winner."
      : "";
  ariaResult.ariaLabel = `${result} ${winMsg} Click or Press enter to play again.`;
};

const updateScoreState = (winner) => {
  if (winner === "tie") return;
  winner === "computer" ? Game.cpWins() : Game.p1Wins();
};

const updatePersistentData = (winner) => {
  const store = winner === "computer" ? "cpAllTime" : "p1AllTime";
  const score =
    winner === "computer" ? Game.getCpAllTime() : Game.getP1AllTime();
  localStorage.setItem(store, score);
};

const updateWinnerMessage = (winner) => {
  if (winner === "tie") return;
  const message = winner === "computer" ? "🤖🤖Computer Wins!🤖🤖" : "🎉🔥You Win!🔥🎉";
  const p1msg = document.getElementById("p1msg");
  p1msg.textContent = message;
};

const displayComputerChoice = (choice) => {
  const square = document.getElementById("cp_paper");
  createGameImage(choice, square);
}

const playAgain = () => {
  const playAgain = document.getElementById("playAgain");
  playAgain.classList.toggle("hidden");
  playAgain.focus();
};

const resetBoard = () => {
  const gameSquares = document.querySelectorAll(".gameboard div");
  gameSquares.forEach((el) => {
    el.className = "gameboard__square";
  });
  const cpSquares = document.querySelectorAll(
    ".computerboard .gameboard__square"
  );
  cpSquares.forEach((el) => {
    if (el.firstElementChild) el.firstElementChild.remove();
    if (el.id === "cp_rock") createGameImage("rock", el);
    if (el.id === "cp_paper") createGameImage("paper", el);
    if (el.id === "cp_scissors") createGameImage("scissors", el);
    document.getElementById("p1msg").textContent = "Player One Chooses...";
    document.getElementById("cpmsg").textContent = "Computer Chooses...";
    const ariaResult = document.getElementById("playAgain");
    ariaResult.ariaLabel = "Player One Chooses";
    document.getElementById("p1msg").focus();
    document.getElementById("playAgain").classList.toggle("hidden");
    Game.endGame();
  });
};

const createGameImage = (icon, appendToElement) => {
  const image = document.createElement("img");
  image.src = `img/${icon}.png`;
  image.alt = icon;
  appendToElement.appendChild(image);
};
