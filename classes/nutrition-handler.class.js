class NutritionHandler{

  get nutrition() {
    let nutritionSum = new Nutrition();
    let amountSum = 0;
    for (let item of this.ingredients) {
      if (item._gram == undefined) {
        item._gram = item._amount;
      }
      amountSum += Number(item._gram);
    }
    for (let item of this.ingredients) {
      Object.setPrototypeOf(item, Ingredient.prototype);
      let proportion = Number(item.gram) / amountSum;
      item.nutrition.energiKcal != undefined ? nutritionSum.energiKcal += proportion * item.nutrition.energiKcal : false;
      item.nutrition.kolhydrater != undefined ? nutritionSum.kolhydrater += proportion * item.nutrition.kolhydrater : false;
      item.nutrition.protein != undefined ? nutritionSum.protein += proportion * item.nutrition.protein : false;
      item.nutrition.fett != undefined ? nutritionSum.fett += proportion * item.nutrition.fett : false;
      item.nutrition.omega3 != undefined ? nutritionSum.omega3 += proportion * item.nutrition.omega3 : false;
      item.nutrition.salt != undefined ? nutritionSum.salt += proportion * item.nutrition.salt : false;
    }
    return nutritionSum;
  }
}