  // controller
  Animal = {
   start : function() {
    this.view.start();//从视图触发
   },
   set : function(animalName) {
       this.model.setAnimal(animalName);
       //controller 改变 model 
   }
  };
  // model
  Animal.model = {
   animalDictionary : {
    car : 'meows',
    fish : 'swims',
    bird : 'flies'
   },
   currentAnimal : null,
   setAnimal : function(name) {
    this.currentAnimal = this.animalDictionary[name] ? name : null;
    this.onchange();
   },
   onchange : function() {
       Animal.view.update();
       //model传递结果到View(个人觉得这里可以由Controller来专递，最好不要直接操作视图)
   },
   getAnimalAction : function() {
    return this.currentAnimal ? this.currentAnimal + ' ' + this.animalDictionary[this.currentAnimal] : 'unknow';
   }
  };
  // view
  Animal.view = {
   start : function() {
       document.getElementById('setAnimal').onchange = this.onchange;
       //视图绑定事件
   },
   onchange : function() {
       Animal.set(document.getElementById('setAnimal').value);
       //视图执行操作，调用Controller
   },
   update : function() {
     //视图执行最后的更新响应  
     console.log(Animal.model.getAnimalAction());
     document.getElementById('animalDo').innerHTML = Animal.model.getAnimalAction();
   }
  };
  Animal.start();//入口