class Game {
    constructor() {
        this.difficultyGame = null;
        this.skirtCard = null;
        this.isGameStarted = false;
        this.count = 0;
        this.removedCardsCount = 0;
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.finalScore = null;
    }

    timer() {
        let timer = document.querySelector("#timer");
        let score = document.querySelector("#score");
        let start = new Date();
        let go = startTimer.bind(this);
        let interval = setInterval(go, 100);

        function startTimer() {
            let currTime = new Date() - start;
            let sec = Math.abs(Math.floor(currTime / 1000) % 60);
            let min = Math.abs(Math.floor(currTime / 1000 / 60) % 60);
            let hours = Math.abs(Math.floor(currTime / 1000 / 60 / 60) % 24);
            if (sec.toString().length === 1) {
                sec = '0' + sec;
            }
            if (min.toString().length === 1) {
                min = '0' + min;
            }
            if (hours.toString().length === 1) {
                hours = '0' + hours;
            }
            timer.innerHTML = hours + ':' + min + ':' + sec;
            score.innerHTML = 100 * this.difficultyGame - Math.floor(currTime / 1000) * 5

            if (!this.isGameStarted) {
                clearInterval(interval);
            }
        }
    }

    createDeck(arr, diff) {
        let deck = [];
        let temp = [];
        let size = diff / 2;
        for (let i = 0; i < size; i++) {
            deck.push(new Card(i, arr[i].src, arr[i].value));
        }
        for (let i = 0; i < size; i++) {
            temp.push(new Card((i + size), arr[i].src, arr[i].value));
        }
        return deck.concat(temp);
    }

    shuffle(array) {
        let counter = array.length, temp, index;

        while (counter > 0) {
            index = Math.floor(Math.random() * counter);
            counter--;
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }

    generate(arr, cls) {
        for (let i in arr) {
            document.querySelector('#game-field').appendChild(arr[i].createCard(cls));
            document.querySelector('#game-field').parentElement.classList.add('dif'+this.difficultyGame);
        }
        this.isGameStarted = true;
    }

    disableMenuButtons() {
        document.querySelector("#skirt-button").setAttribute("disabled","disabled");
        document.querySelector("#difficulty-button").setAttribute("disabled","disabled");
    }

    hideRules() {
        document.querySelector("#intro").classList.add("hide");
    }

    flip(e, skirt, arr) {
        if (arr.length < 2) {
            if (e.target.classList.contains(skirt)) {
                let elem = e.target.parentElement;
                let obj = {
                    objId: elem.parentElement.id,
                    objValue: elem.parentElement.getAttribute('value')
                }
                arr.push(obj);
                elem.classList.toggle("flip");
                this.count++;
                if (this.count === 2) {
                    setTimeout(() => { this.match(arr) }, 500);
                    return;
                }
            }
        }
    }

    match(arr, count) {
        if (arr[0].objValue === arr[1].objValue) {
            for (let i in arr) {
                document.getElementById(arr[i].objId).classList.add('unvisible');
                this.count--;
                this.removedCardsCount++;
                if (this.removedCardsCount === this.difficultyGame) {
                    this.showResult();
                    this.isGameStarted = false;
                }
            }
        }
        else {
            for (let i in arr) {
                document.getElementById(arr[i].objId).firstChild.classList.toggle('flip');
                this.count--;
            }
        }
        arr.shift();
        arr.shift();
    }

    showResult() {
        document.querySelector('#game-field').parentElement.classList.toggle('dif'+this.difficultyGame);
        document.querySelector('#game-field').remove();
        document.querySelector('#result').classList.add('show');
        this.checkTop();
    }

    checkTop() {
        this.finalScore = document.querySelector('#score').innerText;
        this.result = {score: Number(this.finalScore), name:this.firstName}

        const serialObj = JSON.stringify(this.result);

        for(let i = 0; i < 10; i++) {
            if (JSON.parse(localStorage.getItem(i)).score < this.result.score) {
                for(let j = 9; j > i; j--) {
                    localStorage.setItem(j, localStorage.getItem(j-1));
                }
                localStorage.setItem(i, serialObj);
                this.displayScore(i);
                break;
            }
            else if(i === 9) this.displayScore();
        }

    }

    displayScore(curResult) {
        for(let i = 0; i < 10; i++) {
            let isTop = document.getElementById('top10').getElementsByClassName('score-item')[i];
            isTop.classList.remove('current');
            if (i === curResult) {isTop.classList.add('current')};
            isTop.innerHTML = JSON.parse(localStorage.getItem(i)).score + ' ' + JSON.parse(localStorage.getItem(i)).name;
        }
    }

    gameViewModel() {
        let skirtMenuNode = document.querySelector("#skirt-button");
        let difficultyMenuNode = document.querySelector("#difficulty-button");
        let newGameNode = document.querySelector("#new-game-button");
        let skirtNode = document.querySelector("#skirt");
        let difficultyNode = document.querySelector("#difficulty");
        let fNameInputNode = document.querySelector("#fName");
        let lNameInputNode = document.querySelector("#lName");
        let emailInputNode = document.querySelector("#email");

        newGameNode.addEventListener("click", this.newGame);

        skirtNode.addEventListener("click", evt => {
            this.setSkirtCard(evt.target);
        });

        difficultyNode.addEventListener("click", evt => {
            this.setDifficultyGame(evt.target);
        });

        fNameInputNode.addEventListener("input", evt => {
            this.setFirstName(evt.target);
        });

        lNameInputNode.addEventListener("input", evt => {
            this.setLastName(evt.target);
        });

        emailInputNode.addEventListener("input", evt => {
            this.setEmail(evt.target);
        });

        for(let i = 0; i < 10; i++) {
            if (!localStorage.getItem(i)) {
                localStorage.setItem(i, JSON.stringify({score:0, name:0}));
            }
        }
    }

    show(node) {
        if (node.nextElementSibling.classList.contains("active")) {
            node.nextElementSibling.classList.toggle("active");
            return;
        }
        else {
            node.nextElementSibling.classList.add('active');
        }
    }

    newGame() {
        let node1 = document.querySelector("#intro");
        let node2 = document.querySelector("#result")
        if (node1.classList.contains("hide")) {
            if (node2.classList.contains("show")) {
                window.location.reload();
                return;
            }
            let answer = confirm("Are you sure?")
            if (answer) {
                window.location.reload();
            }
            else return;
        }
    }
    setFirstName(node) {
        this.firstName = node.value;
        if (this.isChecked()) {
            this.activateStartButton();
        }
    }
    setLastName(node) {
        this.lastName = node.value;
        if (this.isChecked()) {
            this.activateStartButton();
        }
    }
    setEmail(node) {
        this.email = node.value;
        if (this.isChecked()) {
            this.activateStartButton();
        }
    }

    setSkirtCard(node) {
        if (node.classList.contains("skirt-1")) {
            this.skirtCard = "skirt-1";
        }
        if (node.classList.contains("skirt-2")) {
            this.skirtCard = "skirt-2";
        }
        if (node.classList.contains("skirt-3")) {
            this.skirtCard = "skirt-3";
        }
        if (this.isChecked()) {
            this.activateStartButton();
        }
        document.querySelector("#skirt-preview").classList.add(this.skirtCard);
        return;
    }

    setDifficultyGame(node) {
        if (node.classList.contains("low")) {
            this.difficultyGame = 8;
        }
        if (node.classList.contains("medium")) {
            this.difficultyGame = 16;
        }
        if (node.classList.contains("high")) {
            this.difficultyGame = 24;
        }
        if (this.isChecked()) {
            this.activateStartButton();
        }
        document.querySelector("#diff-preview").innerHTML = node.innerText;
        return;
    }

    isChecked() {
        if (this.skirtCard && this.difficultyGame && this.lastName && this.firstName && this.email) {
            return true;
        }
        else return false;
    }

    activateStartButton() {
        let start = document.querySelector("#start");
        start.classList.add('enabled');
        start.removeAttribute('disabled');
    }
}