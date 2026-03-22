# 📘 JavaScript Concepts

---

## 1️⃣ Difference between `var`, `let`, and `const`

In JavaScript, `var`, `let`, and `const` are used to declare variables.

`var` is the old way of declaring variables. It has function scope, which means the variable can be accessed anywhere inside the function. A variable declared with `var` can be reassigned and redeclared.

Example:

```js
var number = 10;
number = 20;
```

`let` is a modern way of declaring variables. It has block scope, so it only works inside `{ }`. A variable declared with `let` can be reassigned but cannot be redeclared in the same block.

Example:

```js
let age = 20;
age = 25;
```

`const` is used when we do not want the variable value to change. It also has block scope. A variable declared with `const` cannot be reassigned after the first value is given.

Example:

```js
const country = "Bangladesh";
```

---

## 2️⃣ Spread Operator (`...`)

The spread operator is written with three dots `...`. It is used to expand or spread elements of an array or object.

It is helpful when we want to copy an array, merge arrays, or add new values.

Example:

```js
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];
```

Here the spread operator copies the elements of `numbers` and adds `4` to create a new array.

---

## 3️⃣ Difference between `map()`, `filter()`, and `forEach()`

These are array methods in JavaScript used to work with array elements.

`map()` is used to modify each element of an array and it returns a new array.

Example:

```js
const result = [1, 2, 3].map(n => n * 2);
```

`filter()` is used to select elements that match a condition and it returns a new array with those elements.

Example:

```js 
const even = [1, 2, 3, 4].filter(n => n % 2 === 0);
```

`forEach()` is used to run a function for each element, but it does not return a new array.

Example:

```js
[1, 2, 3].forEach(n => console.log(n));
```

---

## 4️⃣ Arrow Function

An arrow function is a shorter syntax for writing functions in JavaScript. It uses the `=>` symbol instead of the `function` keyword.

Arrow functions make the code shorter and easier to read, especially for simple functions.

Example:

```js
const sum = (a, b) => a + b;
```

This function takes two parameters and returns their sum.

---

## 5️⃣ Template Literals

Template literals are used to create strings using backticks (`` ` ``) instead of single or double quotes.

They allow us to insert variables inside a string using `${}`, which makes the code easier to read.

Example:

```js
const name = "Tisha";
const message = `Hello ${name}`;
```

In this example, the variable `name` is inserted inside the string.