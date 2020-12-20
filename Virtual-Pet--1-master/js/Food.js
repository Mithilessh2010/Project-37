class Food {
    constructor() {

        this.foodStock = 0;
        this.lastFed = 0;

        this.image = loadImage("images/milk.png");

    }

    updateFoodStock(food) {
        this.foodStock = food;
    }

    getFoodStock(){
        return this.foodStock;
    }

    display() {

        var x = 80;
        var y = 200;

        if (this.foodStock != 0) {

            for (var i = 0; i < this.foodStock; i++) {
                if (i % 10 === 0) {
                    x = 80;
                    y = y + 50;
                }
                image(this.image, x, y, 50, 50);
                x = x + 30;

            }
        }



    }

    bedroom() {
        background(bedroom, 550, 500);
    }

    garden() {
        background(garden, 550, 500);
    }

    washroom() {
        background(washroom, 550, 500);
    }
}
