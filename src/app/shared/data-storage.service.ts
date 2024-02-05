import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";

const DB_URL = 'https://angular-course-3e415-default-rtdb.firebaseio.com';
const RECIPES_URL = DB_URL + '/recipes.json';


@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
    ) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        return this.http
            .put(RECIPES_URL, recipes)
            .subscribe(response => { console.log(response); });
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>(RECIPES_URL)
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                    });
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}