class Hand{
  constructor(x, y, deck, player, initial_cards){
    this.x = x;
    this.y = y;
    this.cards_list = [];
    this.player = player;
  }

  display(){
    let x = this.x;
    let y = this.y;
    for (let card of this.cards_list){
      card.x = x;
      card.y = y;
      card.display();
      x += CARD_WIDTH + 20;
    }
  }

  count(){
    return this.cards_list.length;
  }

  addCard(deck, to_reveal){
    let card = deck.pop_card();
    if (to_reveal){
      card.reveal();
    }
    this.cards_list.push(card);
  }

  score(){
    let s = 0;
    for (let card of this.cards_list){
      if (card.isVisible()){
        s += card.value;
      }
    }
    return s;
  }
}
