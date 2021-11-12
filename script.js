const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');



  const renderUI = (results,value) => {
    resultHeading.innerHTML = `<h2>Search results for '${value}':</h2>`;
    if(results.meals === null) {
        resultHeading.innerHTML = `<h2>No Search results '${value}', try again</h2>`;
    } else {
        console.log(results.meals)
        mealsEl.innerHTML = results.meals.map((meal) => 
            `<div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-meal-id="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>`
        ).join('');
    }
  };

  const fetchMeals = async (value) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
        const result = await response.json();
        console.log(result);
        renderUI(result,value);
    } catch(e) {
        console.log(e);
    }
  }

  const searchMeal =  (e) => {
    e.preventDefault();
    single_mealEl.innerHTML = '';
    const searchterm = search.value;
    if(searchterm.trim()) {
        fetchMeals(searchterm);
        search.value = '';
    } else{
        console.log('enter the search term')
    }
  };


  const renderMealsInfo = (meal) => {
    let intgredents = []; //chicken
    for(let i =1;i<=20;i++) {
        if(meal[`strIngredient${i}`]) {
            intgredents.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    console.log(intgredents)
    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${intgredents.map((ingre) => `<li>${ingre}</li>`).join('')}
                </ul>
                <div class="video">
                </div>
            </div>
        </div>
    `
  };

  const fetchMealsById = async (mealID) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        const result = await response.json();
        console.log(result.meals[0]);
        renderMealsInfo(result.meals[0]);
    } catch(e) {
        console.log(e);
    }
  }

  const getMealById = (id) => {
    fetchMealsById(id);
  };

  const getSelectedMeal = (event) => {
    const mealInfo = event.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    })
    if(mealInfo) {
        const mealID = mealInfo.dataset.mealId;
        getMealById(mealID);
    }
  }

  const fetchRandomMeal = async () => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        const result = await response.json();
        console.log(result);
        renderMealsInfo(result.meals[0]);
    } catch(e) {
        console.log(e);
    }
    
  };

  const getRandomMeal = () => {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    fetchRandomMeal();
  };

  submit.addEventListener('submit', searchMeal);

  mealsEl.addEventListener('click', getSelectedMeal);

  random.addEventListener('click', getRandomMeal);