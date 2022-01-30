class Unit{
  constructor(x, type){
    this.pos = createVector(x, 20);
    if (type == 'grain')this.speed = 1.5;//rabbit speed
    else if (type == 'rabbit') this.speed = 2.2;
    else if (type == 'wolf') this.speed = 2;
    else if (type == 'human') this.speed = 1;
    else this.speed = 1;
    
    this.type = type;
  }
  
  display(){
    
    if (this.type == 'grain'){ 
        image(grain, this.pos.x, this.pos.y, 30, 60);
    }else if (this.type == 'rabbit'){
        image(rabbit, this.pos.x, this.pos.y, 42, 42);
    }else if (this.type == 'wolf'){ 
        image(wolf, this.pos.x, this.pos.y, 60, 30);
    }else if (this.type == 'human'){
        image(person, this.pos.x, this.pos.y, 30, 60);
    }
    else{
      image(grain, this.pos.x, this.pos.y, 30, 60);
    }
  }
  update(){
    this.pos.y += this.speed * dropSpeed;
  }
}