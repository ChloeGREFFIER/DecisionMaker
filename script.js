let dilemma, choice1, choice2;
let c1=0,c2=0;
let selectedGame;

/* START */
function startApp(){

    let d = document.getElementById("dilemmaInput").value.trim();
    let c1input = document.getElementById("choice1Input").value.trim();
    let c2input = document.getElementById("choice2Input").value.trim();

    // 🎲 fallback dilemmas
    const randomDilemmas = [
        ["Pizza or Burger 🍕🍔","Pizza","Burger"],
        ["Stay home or go out 🏠🌆","Stay home","Go out"],
        ["Netflix or Sleep 📺😴","Netflix","Sleep"],
        ["Text or Call 📱📞","Text","Call"]
    ];

    if(!d || !c1input || !c2input){
        let rand = randomDilemmas[Math.floor(Math.random()*randomDilemmas.length)];

        dilemma = d || rand[0];
        choice1 = c1input || rand[1];
        choice2 = c2input || rand[2];
    } else {
        dilemma = d;
        choice1 = c1input;
        choice2 = c2input;
    }

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
        dice:"Roll the dice 🎲 to decide your fate. Odd = "+choice1+" | Even = "+choice2 ,
        memory:"Game coming: remember fast sequences 🧠",
        mash:"Game coming: click as fast as possible 🔘",
		target:"Multiple targets appear🎯. Click as many as possible. Each color represents a choice : the one you click most wins.",
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
	else if(selectedGame==="target") startTarget();
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
    popupText.innerHTML = t; // ⚠️ use innerHTML instead of innerText
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

    openGame(`
        <h2>Wait for it... ⚡</h2>
        <p>Click as fast as possible when the buttons appear!</p>
    `);

    let delay = Math.random()*2000 + 1000; // random wait

    setTimeout(()=>{

        // random order
        let order = Math.random() < 0.5
            ? [0,1]
            : [1,0];

        openGame(`
            <h2>CLICK NOW ⚡</h2>

            <button class="btn-choice${order[0]+1}" onclick="react(${order[0]})">
                ${order[0]===0 ? choice1 : choice2}
            </button>

            <button class="btn-choice${order[1]+1}" onclick="react(${order[1]})">
                ${order[1]===0 ? choice1 : choice2}
            </button>
        `);

        let clicked = false;

        let timeout = setTimeout(()=>{
            if(!clicked){
                showPopup(`
                    You weren't fast enough 😭<br><br>
                    <button onclick="restartReaction()">Play again</button>
                `);
            }
        },2000);

        window.react = (res)=>{
            if(clicked) return;
            clicked = true;

            clearTimeout(timeout);
            endGame(res);
        };

    }, delay);
}
function restartReaction(){
    closePopup();
    startReaction();
}

/* 🎲 DICE */
function startDice(){
    openGame(`
        <div id="dice" class="dice">🎲</div>
        <p>Click to roll the dice 🎲</p>
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


/*🎯 TARGET */
function startTarget(){

    let duration = 30000; // 30s
    let spawnRate = 500;

    let score1 = 0;
    let score2 = 0;

    openGame(`
        <div id="progressBarContainer">
            <div id="progressBar"></div>
        </div>

        <div id="playArea" style="position:relative; height:300px;"></div>

        <p>Targets appear every second ⏱</p>
        <p>Click them before they disappear! 🎯</p>
    `);

    let area = document.getElementById("playArea");

    // 🎯 PROGRESS BAR
    let bar = document.getElementById("progressBar");
    let startTime = Date.now();

    let progressInterval = setInterval(()=>{
        let elapsed = Date.now() - startTime;
        let percent = (elapsed / duration) * 100;
        bar.style.width = percent + "%";
    },50);

    function spawnTarget(){

        let isChoice1 = Math.random() < 0.5;

        let target = document.createElement("div");

        target.innerText = "🎯";
        target.style.position = "absolute";
        target.style.left = (Math.random()*90) + "%";
        target.style.top = (Math.random()*80) + "%";
        target.style.fontSize = "45px";
        target.style.cursor = "pointer";
        target.style.transition = "0.3s";

        target.style.filter = isChoice1
            ? "hue-rotate(0deg)"
            : "hue-rotate(140deg)";

        target.onclick = () => {

            // score
            if(isChoice1) score1++;
            else score2++;

            // ➕ +1 animation
            let plus = document.createElement("div");
            plus.innerText = "+1";
            plus.style.position = "absolute";
            plus.style.left = target.style.left;
            plus.style.top = target.style.top;
            plus.style.color = isChoice1 ? "#e76f51" : "#2a9d8f";
            plus.style.fontWeight = "bold";
            plus.style.transition = "1s";

            area.appendChild(plus);

            setTimeout(()=>{
                plus.style.top = (parseFloat(plus.style.top) - 5) + "%";
                plus.style.opacity = "0";
            },10);

            setTimeout(()=>plus.remove(),1000);

            target.remove();
        };

        area.appendChild(target);

        // ❌ fade out if not clicked
        setTimeout(()=>{
            target.style.opacity = "0";
        },4000);

        setTimeout(()=>{
            target.remove();
        },5000);
    }

    let spawnInterval = setInterval(spawnTarget, spawnRate);

    setTimeout(()=>{
        clearInterval(spawnInterval);
        clearInterval(progressInterval);
        finish();
    }, duration);

    function finish(){

        openGame(`
            <h2>Results 🎯</h2>
            <p style="color:#e76f51">${choice1} : ${score1}</p>
            <p style="color:#2a9d8f">${choice2} : ${score2}</p>
        `);

        let result = score1 >= score2 ? 0 : 1;

        setTimeout(()=>{
            endGame(result);
        },2000);
    }
}


/* RESET */
function resetAll(){
    c1=0;c2=0;
    counter1.innerText=0;
    counter2.innerText=0;

    main.classList.add("hidden");
    setup.classList.remove("hidden");
}