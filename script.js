let dilemma, choice1, choice2;
let c1=0,c2=0;
let selectedGame;

/* START */
function startApp(){
    dilemma = document.getElementById("dilemmaInput").value;
    choice1 = document.getElementById("choice1Input").value;
    choice2 = document.getElementById("choice2Input").value;

    document.getElementById("displayDilemma").innerText = dilemma;

    counter1.innerText = choice1 + " : 0";
    counter2.innerText = choice2 + " : 0";

    setup.classList.add("hidden");
    main.classList.remove("hidden");
}

/* INFO SCREEN */
function launchGame(game){
    selectedGame = game;

    const texts = {
        coin:"Flip the coin 🪙 and let fate decide.",
        friends:"Phoebe's game in friends💥 Just answer fast without thinking",
        spinner:"Spin the wheel 🎡 and see where it lands.",
        reaction:"Wait… then CLICK FAST ⚡ left or right.",
        dice:"Roll the dice 🎲 to decide your fate.",
        memory:"Game coming: remember fast sequences 🧠",
        mash:"Game coming: click as fast as possible 🔘",
        target:"Game coming: hit a moving target 🎯",
        elim:"Game coming: random elimination ✨"
    };

    document.getElementById("infoText").innerText = texts[game];
    document.getElementById("infoScreen").classList.add("active");
}

function startSelectedGame(){
    document.getElementById("infoScreen").classList.remove("active");

    if(selectedGame==="coin") startCoin();
    else if(selectedGame==="friends") startFriends();
    else if(selectedGame==="spinner") startSpinner();
    else if(selectedGame==="reaction") startReaction();
    else if(selectedGame==="dice") startDice();
    else showPopup("Game coming soon 🚧");
}

/* RESULT */
function endGame(res){
    if(res===0){
        c1++;
        counter1.innerText = choice1 + " : " + c1;
        showPopup("+1 for " + choice1);
    } else {
        c2++;
        counter2.innerText = choice2 + " : " + c2;
        showPopup("+1 for " + choice2);
    }

    gameArea.classList.add("hidden");
    main.classList.remove("hidden");
}

/* POPUP */
function showPopup(t){
    popupText.innerText=t;
    popup.classList.add("active");
}
function closePopup(){
    popup.classList.remove("active");
}

/* OPEN GAME */
function openGame(html){
    main.classList.add("hidden");
    gameArea.classList.remove("hidden");
    gameArea.innerHTML=html;
}

/* 🪙 COIN */
function startCoin(){
    openGame(`
        <div id="coin" class="coin">
            <div class="coin-face front">${choice1}</div>
            <div class="coin-face back">${choice2}</div>
        </div>
        <p>Click to toss the coin 🪙</p>
    `);

    let coin=document.getElementById("coin");

    coin.onclick=()=>{
        coin.classList.add("flip");

        let res=Math.random()<0.5?0:1;

        setTimeout(()=>{
            endGame(res);
        },2000);
    };
}

/* 👯 FRIENDS */
function startFriends(){

	// pool of questions
	let pool = [
		["Coffee or Tea?","Coffee","Tea"],
		["City or Beach?","City","Beach"],
		["Morning or Night?","Morning","Night"],
		["Sweet or Salty?","Sweet","Salty"],
		["Summer or Winter?","Summer","Winter"],
		["Movie or Series?","Movie","Series"],
		["Text or Call?","Text","Call"],
		["Pizza or Burger?","Pizza","Burger"],
		["Car or Bike?","Car","Bike"],
		["Dog or Cat?","Dog","Cat"]
	];
	// shuffle
	pool.sort(()=>Math.random()-0.5);

	// pick between 5 and 10 questions
	let nbQuestions = Math.floor(Math.random()*6) + 5; // 5 → 10

	let questions = pool.slice(0, nbQuestions);

	// ❗ ensure dilemma is AFTER at least 5 questions
	let insertIndex = Math.floor(Math.random() * (questions.length - 4)) + 5;
	
	let questionD = choice1 + " or " + choice2 ;
	questions.splice(insertIndex, 0, [questionD, choice1, choice2]);
    let i=0;

    function next(){
        let q = questions[i];
        let timeLeft = 3;

        openGame(`
			<h2>${q[0]}</h2>

			<button class="btn-choice1" onclick="answer(0)">
			👉 ${q[1]}
			</button>

			<button class="btn-choice2" onclick="answer(1)">
			👉 ${q[2]}
			</button>

			<p id="timer">⏱ ${timeLeft}</p>
		`);

        let timerInterval = setInterval(()=>{
            timeLeft--;
            document.getElementById("timer").innerText = "⏱ " + timeLeft;
        },1000);

        let timeout = setTimeout(()=>{
            clearInterval(timerInterval);

            // ❌ FAILED → restart game
            showPopup("you suck! play the game 😭");

            setTimeout(()=>{
                closePopup();
                startFriends(); // restart completely
            },1500);

        },3000);

        window.answer = (c)=>{
            clearInterval(timerInterval);
            clearTimeout(timeout);

            if(q[0] === questionD){
                endGame(c);
            } else {
                i++;
                next();
            }
        };
    }

    next();
}

/* 🎡 SPINNER */
function startSpinner(){
    openGame(`
        <div class="pointer">▼</div>
        <div id="spin" class="spinner-text">
            <div class="half left">${choice1}</div>
            <div class="half right">${choice2}</div>
        </div>
        <p>Click to spin the wheel 🎡</p>
    `);

    let s=document.getElementById("spin");

    s.onclick=()=>{
        let deg = Math.random()*2000 + 1000;
        s.style.transform = "rotate(" + deg + "deg)";

        let res = deg % 360 > 180 ? 1 : 0;

        setTimeout(()=>endGame(res),2000);
    };
}

/* ⚡ REACTION */
function startReaction(){
    openGame(`<h2>WAIT...</h2>`);

    setTimeout(()=>{
        gameArea.innerHTML=`
        <h2>CLICK NOW ⚡</h2>
        <button onclick="endGame(0)">LEFT</button>
        <button onclick="endGame(1)">RIGHT</button>
        `;
    },Math.random()*2000+1000);
}

/* 🎲 DICE */
function startDice(){
    openGame(`
        <div id="dice" class="dice">🎲</div>
        <p>Click to roll the dice 🎲</p>
        <p>Odd = ${choice1} | Even = ${choice2}</p>
        <p id="result"></p>
    `);

    let d=document.getElementById("dice");
    let result=document.getElementById("result");

    d.onclick=()=>{
        let rollInterval = setInterval(()=>{
            result.innerText = Math.floor(Math.random()*6)+1;
        },100);

        setTimeout(()=>{
            clearInterval(rollInterval);

            let n=Math.floor(Math.random()*6)+1;

            let text = n + " : " + (n%2===0
                ? "even → " + choice2
                : "odd → " + choice1);

            result.innerText = text;

            setTimeout(()=>{
                endGame(n%2===0?1:0);
            },1500);

        },1000);
    };
}

/* RESET */
function resetAll(){
    c1=0;c2=0;
    counter1.innerText=0;
    counter2.innerText=0;

    main.classList.add("hidden");
    setup.classList.remove("hidden");
}