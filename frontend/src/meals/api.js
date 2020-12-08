import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi } from '../constants';
import fetch from 'cross-fetch';

export function createMeal() {
    return (dispatch) => {
        const user = getUserId();
        const mealName = getFormElementValue({ name: "meal-name" });
        const calories = getFormElementValue({ name: "calories" });
        const protein = getFormElementValue({ name: "protein" });
        return fetch(`${mealsApi}/meals/add`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mealName,
                calories: Number(calories),
                protein: Number(protein),
                user
            })
        })
        .then( (response) => response.json() )
        .then( () => dispatch(getMeals()) );
    };
}

export function getMeals() {
    return function (dispatch) {
        const user = getUserId();
        return fetch(`${mealsApi}/meals/get`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user
            })
        })
        .then( (response) => response.json() )
        .then( (meals) => dispatch({ type: "MEALS_UPDATED", meals }) );
    };
}

export function deleteMeal({ mealName }) {
    return function (dispatch) {
        const user = getUserId();
        return fetch(`${mealsApi}/meals/delete`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mealName,
                user
            })
        })
        .then(response => response.json())
        .then(() => dispatch(getMeals()));
    };
}