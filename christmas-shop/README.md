# Christmas Shop

[View result](https://rolling-scopes-school.github.io/dias1c-JSFE2024Q4/christmas-shop)

[Project Description](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/christmas-shop/christmas-shop.md)

### Progress

- [x] [Part 1: Layout](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/christmas-shop/christmas-shop-part1.md)
- [x] [Part 2: Handle Resize](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/christmas-shop/christmas-shop-part2.md)
- [x] [Part 3: Interactive with JS](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/christmas-shop/christmas-shop-part3.md)

## Notes

### Список вещей о которых я узнал:

#### В CSS `background-image` можно указывать несколько значений

```css
.example {
  background-image: url(../../assets/images/bg-snow.png), url(../../assets/images/bg-forest.png);
}
```

#### В CSS можно проверить доступны ли hover эффекты через запрос `@media(hover: hover)`
```css
.example {
  background-color: blue;
}

@media (hover: hover) {
  .example:hover {
    background-color: red;
  }
}
```


#### Наблюдение за медиа запросом через `window.matchMedia` в JS

До этого я не знал что можно создать наблюдатель на media запросы в js. Оказывается можно, пример:
```js
const observerMaxWidth = window.matchMedia("(max-width: 768px)");

// Добавляем listener на media запрос.
observerMaxWidth.addEventListener(
  "change",
  () => {
    // Запустился триггер
    if (observerMaxWidth.matches) {
      // При соответствии к условию
    } else {
      // Условие не матчится с media запросом
    }
  }
);
```

#### Тег `dialog` и методы работы с ним, его уникальные свойства и тд.
Это тег который дает возможность реализовывать диалоговое окно.
> В проекте это реализовано так себе, но в целом реализовано. Главное пользовался и узнал как работать. 





#### 


