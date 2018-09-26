//Började på denna men ej säker på om jag kommer använda den än då routes söker i recepten

class Recipe {
    get name(){
    return this._name;
    }

    get nutrition(){
        let nutritionSum = new Nutrition();
        for (let item of this.ingredients) {
    }
}
    get ingredients() {
        return this._ingredients;
      }

}