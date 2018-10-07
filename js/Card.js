class Card {
    constructor(id, src, value) {
        this.id = ++id;
        this.src = src;
        this.value = value;
    }

    createCard(cls) {
        let node = document.createElement('div');
        node.className = "card";
        node.id = "card" + this.id;
        node.setAttribute("value", this.value);
        node.innerHTML = `<div class="flipper"><div class="front ${cls}"></div><div class="back"><img src="${this.src}"/></div></div>`;
        return node;
    }
}